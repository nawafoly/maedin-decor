const DEFAULT_PROJECT_ID = "maedin-decor";
const OWNER_EMAIL = "nawafoly0@gmail.com";
const JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Authorization,Content-Type",
};

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function base64UrlToBytes(value) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function decodeJwtPart(value) {
  return JSON.parse(new TextDecoder().decode(base64UrlToBytes(value)));
}

async function getJwk(kid) {
  const response = await fetch(JWKS_URL, { cf: { cacheTtl: 3600, cacheEverything: true } });
  if (!response.ok) throw new Error("Unable to load Firebase public keys.");
  const keys = await response.json();
  const jwk = keys.keys?.find((key) => key.kid === kid);
  if (!jwk) throw new Error("Firebase token key was not found.");
  return jwk;
}

async function verifyFirebaseToken(token, env) {
  const [headerPart, payloadPart, signaturePart] = token.split(".");
  if (!headerPart || !payloadPart || !signaturePart) throw new Error("Invalid token.");

  const header = decodeJwtPart(headerPart);
  const payload = decodeJwtPart(payloadPart);
  const projectId = env.FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID;
  const now = Math.floor(Date.now() / 1000);

  if (header.alg !== "RS256") throw new Error("Unsupported token algorithm.");
  if (payload.aud !== projectId) throw new Error("Invalid token audience.");
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) throw new Error("Invalid token issuer.");
  if (!payload.sub || payload.exp < now) throw new Error("Expired token.");

  const jwk = await getJwk(header.kid);
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const verified = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64UrlToBytes(signaturePart),
    new TextEncoder().encode(`${headerPart}.${payloadPart}`),
  );

  if (!verified) throw new Error("Token signature failed.");
  return payload;
}

function firestoreValueToPlain(field) {
  if (!field) return undefined;
  if ("stringValue" in field) return field.stringValue;
  if ("booleanValue" in field) return field.booleanValue;
  if ("integerValue" in field) return Number(field.integerValue);
  if ("doubleValue" in field) return Number(field.doubleValue);
  return undefined;
}

async function getUserRole(payload, env, token) {
  if (String(payload.email || "").toLowerCase() === OWNER_EMAIL) return "admin";

  const projectId = env.FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${payload.sub}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return "";
  const document = await response.json();
  return firestoreValueToPlain(document.fields?.role) || "";
}

function sanitizePathPart(value, fallback = "file") {
  return String(value || fallback)
    .trim()
    .replace(/[^a-zA-Z0-9._/-]+/g, "-")
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "")
    .slice(0, 140) || fallback;
}

function publicUrlForKey(request, env, key) {
  const base = env.PUBLIC_ASSET_BASE_URL || new URL(request.url).origin;
  return `${base.replace(/\/$/, "")}/api/files/${encodeURIComponent(key).replaceAll("%2F", "/")}`;
}

async function requireUser(request, env) {
  const header = request.headers.get("Authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new Error("Missing Authorization token.");
  const payload = await verifyFirebaseToken(token, env);
  return { token, payload };
}

async function handleUpload(request, env) {
  if (!env.MAEDIN_ASSETS) return json({ error: "R2 bucket binding MAEDIN_ASSETS is missing." }, 500);

  const { token, payload } = await requireUser(request, env);
  const formData = await request.formData();
  const scope = sanitizePathPart(formData.get("scope"), "customer");

  if (scope.startsWith("admin")) {
    const role = await getUserRole(payload, env, token);
    if (!["admin", "owner"].includes(role)) {
      return json({ error: "Admin upload is not allowed for this account." }, 403);
    }
  }

  const folder = sanitizePathPart(formData.get("folder"), scope.startsWith("admin") ? "admin" : "customer");
  const files = formData.getAll("files").filter((file) => file && typeof file === "object" && file.name);

  if (!files.length) {
    const single = formData.get("file");
    if (single && typeof single === "object" && single.name) files.push(single);
  }

  if (!files.length) return json({ error: "No files were provided." }, 400);

  const uploaded = [];
  const date = new Date();
  const datePrefix = `${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

  for (const file of files) {
    const safeName = sanitizePathPart(file.name, "upload.bin").replaceAll("/", "-");
    const key = `${folder}/${datePrefix}/${crypto.randomUUID()}-${safeName}`;
    await env.MAEDIN_ASSETS.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type || "application/octet-stream",
      },
      customMetadata: {
        uploadedBy: payload.sub,
        email: payload.email || "",
        scope,
        originalName: file.name,
      },
    });
    uploaded.push({
      key,
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      url: publicUrlForKey(request, env, key),
    });
  }

  return json({ files: uploaded }, 201);
}

async function handleFile(request, env, key) {
  if (!env.MAEDIN_ASSETS) return json({ error: "R2 bucket binding MAEDIN_ASSETS is missing." }, 500);
  const object = await env.MAEDIN_ASSETS.get(decodeURIComponent(key));
  if (!object) return json({ error: "File not found." }, 404);

  return new Response(object.body, {
    headers: {
      ...corsHeaders,
      "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (url.pathname === "/api/upload" && request.method === "POST") {
        return await handleUpload(request, env);
      }

      if (url.pathname.startsWith("/api/files/") && request.method === "GET") {
        return await handleFile(request, env, url.pathname.replace("/api/files/", ""));
      }
    } catch (error) {
      return json({ error: error.message || "Request failed." }, 401);
    }

    return env.ASSETS.fetch(request);
  },
};
