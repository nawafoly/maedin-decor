const DEFAULT_PROJECT_ID = "maedin-decor";
const OWNER_EMAIL = "nawafoly0@gmail.com";
const JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
const DEFAULT_PAYMENT_PACKAGES = {
  consultation: {
    code: "consultation",
    nameAr: "استشارة التصميم",
    priceAmount: 650,
    requiresPayment: true,
  },
};

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

let googleAccessToken;

function encodeBase64Url(value) {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value;
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function privateKeyBytes(pem) {
  const normalized = String(pem || "").replaceAll("\\n", "\n");
  const base64 = normalized.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, "");
  if (!base64) throw new Error("FIREBASE_PRIVATE_KEY is missing.");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function getGoogleAccessToken(env) {
  const now = Math.floor(Date.now() / 1000);
  if (googleAccessToken?.expiresAt > now + 60) return googleAccessToken.value;
  if (!env.FIREBASE_CLIENT_EMAIL) throw new Error("FIREBASE_CLIENT_EMAIL is missing.");

  const header = encodeBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = encodeBase64Url(JSON.stringify({
    iss: env.FIREBASE_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const key = await crypto.subtle.importKey(
    "pkcs8",
    privateKeyBytes(env.FIREBASE_PRIVATE_KEY),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(`${header}.${claims}`),
  );
  const assertion = `${header}.${claims}.${encodeBase64Url(new Uint8Array(signature))}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error_description || "Firebase service authentication failed.");
  googleAccessToken = { value: result.access_token, expiresAt: now + Number(result.expires_in || 3600) };
  return googleAccessToken.value;
}

function toFirestoreValue(value) {
  if (value === null) return { nullValue: null };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (typeof value === "object") {
    return { mapValue: { fields: toFirestoreFields(value) } };
  }
  return { stringValue: String(value) };
}

function toFirestoreFields(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined).map(([key, entry]) => [key, toFirestoreValue(entry)]),
  );
}

function fromFirestoreValue(value) {
  if (!value) return undefined;
  if ("nullValue" in value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("timestampValue" in value) return new Date(value.timestampValue);
  if (value.arrayValue) return (value.arrayValue.values || []).map(fromFirestoreValue);
  if (value.mapValue) return fromFirestoreFields(value.mapValue.fields || {});
  return undefined;
}

function fromFirestoreFields(fields) {
  return Object.fromEntries(Object.entries(fields || {}).map(([key, value]) => [key, fromFirestoreValue(value)]));
}

function firestoreDocumentUrl(env, collectionName, id) {
  const projectId = env.FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID;
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}/${id}`;
}

async function writeFirestoreDocument(env, collectionName, id, data) {
  const token = await getGoogleAccessToken(env);
  const response = await fetch(firestoreDocumentUrl(env, collectionName, id), {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  });
  if (!response.ok) throw new Error(`Firestore write failed: ${await response.text()}`);
}

async function readFirestoreDocument(env, collectionName, id) {
  const token = await getGoogleAccessToken(env);
  const response = await fetch(firestoreDocumentUrl(env, collectionName, id), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Firestore read failed: ${await response.text()}`);
  const document = await response.json();
  return fromFirestoreFields(document.fields || {});
}

async function readFirestoreWithToken(env, collectionName, id, token) {
  const response = await fetch(firestoreDocumentUrl(env, collectionName, id), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Firestore request failed: ${await response.text()}`);
  const document = await response.json();
  return fromFirestoreFields(document.fields || {});
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendEmail(env, { to, subject, html, idempotencyKey }) {
  if (!env.RESEND_API_KEY) return { configured: false };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from: env.RESEND_FROM || "FORMA <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Email delivery request failed.");
  return { configured: true, id: result.id || "" };
}

function emailFrame(title, content) {
  return `<!doctype html><html lang="ar" dir="rtl"><body style="margin:0;background:#f4f1ec;color:#191919;font-family:Arial,sans-serif"><div style="max-width:620px;margin:0 auto;padding:36px 18px"><div style="padding:28px;background:#17191b;color:#fff"><div style="color:#c8a97e;font-size:12px;letter-spacing:2px">FORMA</div><h1 style="margin:10px 0 0;font-size:28px">${escapeHtml(title)}</h1></div><div style="padding:30px;background:#fff;line-height:1.8">${content}</div><div style="padding:18px;color:#716b65;font-size:12px;text-align:center">FORMA Interior Design · Riyadh</div></div></body></html>`;
}

function orderEmailContent(order, orderId, admin = false) {
  const heading = admin ? `طلب جديد من ${escapeHtml(order.customerName || order.customerEmail)}` : `مرحباً ${escapeHtml(order.customerName || "")}`;
  return `<h2 style="margin-top:0">${heading}</h2><p>${admin ? "تم استلام طلب خدمة جديد ويحتاج إلى المتابعة." : "استلمنا طلبك وسيقوم الفريق بمراجعة التفاصيل والتواصل معك بالخطوة التالية."}</p><table style="width:100%;border-collapse:collapse"><tr><td style="padding:10px 0;border-bottom:1px solid #ddd">الخدمة</td><td style="padding:10px 0;border-bottom:1px solid #ddd;font-weight:bold">${escapeHtml(order.packageName || order.serviceType)}</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #ddd">المدينة</td><td style="padding:10px 0;border-bottom:1px solid #ddd;font-weight:bold">${escapeHtml(order.city)}</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #ddd">نوع المشروع</td><td style="padding:10px 0;border-bottom:1px solid #ddd;font-weight:bold">${escapeHtml(order.projectType)}</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #ddd">السعر</td><td style="padding:10px 0;border-bottom:1px solid #ddd;font-weight:bold">${escapeHtml(order.packagePrice || "حسب النطاق")}</td></tr><tr><td style="padding:10px 0">مرجع الطلب</td><td style="padding:10px 0;font-weight:bold">${escapeHtml(orderId)}</td></tr></table>${admin ? `<p><b>البريد:</b> ${escapeHtml(order.customerEmail)}<br><b>الجوال:</b> ${escapeHtml(order.contactPhone)}<br><b>الملاحظات:</b> ${escapeHtml(order.notes)}</p>` : ""}`;
}

async function sendOrderNotifications(env, order, orderId) {
  if (!env.RESEND_API_KEY) return { configured: false };
  const adminEmail = env.ADMIN_EMAIL || OWNER_EMAIL;
  const results = await Promise.all([
    sendEmail(env, {
      to: order.customerEmail,
      subject: `تم استلام طلبك - ${order.packageName || "FORMA"}`,
      html: emailFrame("تم استلام طلبك", orderEmailContent(order, orderId)),
      idempotencyKey: `order-customer-${orderId}`,
    }),
    sendEmail(env, {
      to: adminEmail,
      subject: `طلب جديد: ${order.packageName || orderId}`,
      html: emailFrame("طلب خدمة جديد", orderEmailContent(order, orderId, true)),
      idempotencyKey: `order-admin-${orderId}`,
    }),
  ]);
  return { configured: true, customerEmailId: results[0].id, adminEmailId: results[1].id };
}

async function handleOrderNotification(request, env) {
  const { token, payload } = await requireUser(request, env);
  const input = await request.json();
  const orderId = String(input.orderId || "");
  if (!/^[a-zA-Z0-9]{10,40}$/.test(orderId)) return json({ error: "Invalid order ID." }, 400);
  const order = await readFirestoreWithToken(env, "orders", orderId, token);
  if (!order || order.userId !== payload.sub) return json({ error: "Order was not found for this account." }, 404);
  const trustedOrder = { ...order, customerEmail: String(payload.email || "").toLowerCase() };
  const notification = await sendOrderNotifications(env, trustedOrder, orderId);
  return json(notification);
}

function moyasarHeaders(env, transactionId) {
  if (!env.MOYASAR_SECRET_KEY) throw new Error("MOYASAR_SECRET_KEY is missing.");
  return {
    Authorization: `Basic ${btoa(`${env.MOYASAR_SECRET_KEY}:`)}`,
    "Content-Type": "application/json",
    ...(transactionId ? { "Idempotency-Key": transactionId } : {}),
  };
}

async function fetchMoyasarInvoice(env, invoiceId) {
  const response = await fetch(`https://api.moyasar.com/v1/invoices/${encodeURIComponent(invoiceId)}`, {
    headers: moyasarHeaders(env),
  });
  const invoice = await response.json();
  if (!response.ok) throw new Error(invoice.message || "Unable to verify Moyasar invoice.");
  return invoice;
}

function paymentDetails(invoice) {
  const payments = Array.isArray(invoice.payments) ? invoice.payments : [];
  const payment = payments.find((entry) => entry.status === "paid") || payments.at(-1) || {};
  const source = payment.source || {};
  return {
    providerPaymentId: payment.id || "",
    paymentMethod: source.type || source.company || source.name || "",
    cardBrand: source.company || "",
    cardLastFour: String(source.number || source.last_four || "").replace(/\D/g, "").slice(-4),
    failureCode: payment.source?.message || payment.message || "",
    gatewayFee: payment.fee || 0,
    paidAt: invoice.status === "paid" ? new Date(payment.updated_at || invoice.updated_at || Date.now()) : null,
  };
}

function auditSnapshot(invoice) {
  return {
    id: invoice.id || "",
    status: invoice.status || "",
    amount: invoice.amount || 0,
    currency: invoice.currency || "",
    description: invoice.description || "",
    createdAt: invoice.created_at || "",
    updatedAt: invoice.updated_at || "",
    metadata: invoice.metadata || {},
    payments: (Array.isArray(invoice.payments) ? invoice.payments : []).map((payment) => ({
      id: payment.id || "",
      status: payment.status || "",
      amount: payment.amount || 0,
      fee: payment.fee || 0,
      currency: payment.currency || "",
      createdAt: payment.created_at || "",
      updatedAt: payment.updated_at || "",
      source: {
        type: payment.source?.type || "",
        company: payment.source?.company || "",
        lastFour: String(payment.source?.number || payment.source?.last_four || "").replace(/\D/g, "").slice(-4),
        message: payment.source?.message || "",
      },
    })),
  };
}

async function reconcileTransaction(env, transactionId, existing) {
  const record = existing || await readFirestoreDocument(env, "paymentTransactions", transactionId);
  if (!record?.providerInvoiceId) throw new Error("Payment transaction was not found.");
  const invoice = await fetchMoyasarInvoice(env, record.providerInvoiceId);
  if (Number(invoice.amount) !== Number(record.amountMinor) || invoice.currency !== record.currency) {
    throw new Error("Moyasar invoice amount does not match the stored transaction.");
  }
  const status = invoice.status === "paid" ? "paid" : invoice.status === "expired" ? "expired" : "pending";
  const updated = {
    ...record,
    status,
    ...paymentDetails(invoice),
    verifiedAt: new Date(),
    updatedAt: new Date(),
    providerSnapshot: auditSnapshot(invoice),
  };
  await writeFirestoreDocument(env, "paymentTransactions", transactionId, updated);
  if (status === "paid" && record.status !== "paid") {
    try {
      if (record.orderId) {
        const order = await readFirestoreDocument(env, "orders", record.orderId);
        if (order) {
          await writeFirestoreDocument(env, "orders", record.orderId, {
            ...order,
            status: "مدفوع",
            paymentStatus: "مدفوع",
            paymentTransactionId: transactionId,
            updatedAt: new Date(),
            updates: [...(Array.isArray(order.updates) ? order.updates : []), { label: "تم تأكيد الدفع", at: new Date().toISOString() }],
          });
        }
      }
      await Promise.all([
        sendEmail(env, {
          to: record.customerEmail,
          subject: `تأكيد الدفع - ${record.reference}`,
          html: emailFrame("تم استلام دفعتك", `<p>تم تأكيد عملية الدفع بنجاح.</p><table style="width:100%;border-collapse:collapse"><tr><td style="padding:10px 0;border-bottom:1px solid #ddd">الخدمة</td><td style="font-weight:bold">${escapeHtml(record.description)}</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #ddd">المبلغ</td><td style="font-weight:bold">${escapeHtml(record.amount)} ${escapeHtml(record.currency)}</td></tr><tr><td style="padding:10px 0">المرجع</td><td style="font-weight:bold">${escapeHtml(record.reference)}</td></tr></table>`),
          idempotencyKey: `payment-customer-${transactionId}`,
        }),
        sendEmail(env, {
          to: env.ADMIN_EMAIL || OWNER_EMAIL,
          subject: `دفعة ناجحة: ${record.reference}`,
          html: emailFrame("دفعة ناجحة", `<p>تم تأكيد دفعة جديدة من ${escapeHtml(record.customerName || record.customerEmail)}.</p><p><b>المبلغ:</b> ${escapeHtml(record.amount)} ${escapeHtml(record.currency)}<br><b>مرجع الطلب:</b> ${escapeHtml(record.orderId)}<br><b>مرجع الدفع:</b> ${escapeHtml(record.reference)}</p>`),
          idempotencyKey: `payment-admin-${transactionId}`,
        }),
      ]);
    } catch (error) {
      await writeFirestoreDocument(env, "paymentTransactions", transactionId, {
        ...updated,
        notificationError: error.message || "Payment notification failed.",
      });
    }
  }
  return updated;
}

async function handleCreateCheckout(request, env) {
  const { payload, token } = await requireUser(request, env);
  const input = await request.json();
  const orderId = String(input.orderId || "");
  const order = await readFirestoreWithToken(env, "orders", orderId, token);
  if (!order || order.userId !== payload.sub) throw new Error("A valid order is required before payment.");
  const storedPackage = await readFirestoreWithToken(env, "packages", order.packageId, token);
  const paymentPackage = { ...(DEFAULT_PAYMENT_PACKAGES[order.packageId] || {}), ...(storedPackage || {}) };
  const amount = Number(paymentPackage?.priceAmount || order.packagePriceAmount || 0);
  if (!paymentPackage?.requiresPayment || !Number.isFinite(amount) || amount < 1) {
    throw new Error("This package is not configured for direct payment.");
  }
  const transactionId = crypto.randomUUID();
  const amountMinor = Math.round(amount * 100);
  const appUrl = String(env.APP_URL || new URL(request.url).origin).replace(/\/$/, "");
  const callbackSecret = String(env.PAYMENT_CALLBACK_SECRET || "");
  if (!callbackSecret) throw new Error("PAYMENT_CALLBACK_SECRET is missing.");
  const workerUrl = new URL(request.url).origin;
  const now = new Date();
  const record = {
    reference: `FORMA-${now.getUTCFullYear()}-${transactionId.slice(0, 8).toUpperCase()}`,
    userId: payload.sub,
    customerName: String(input.customerName || payload.name || "").trim().slice(0, 160),
    customerEmail: String(payload.email || "").toLowerCase(),
    customerPhone: String(input.phone || "").trim().slice(0, 40),
    notes: String(input.notes || "").trim().slice(0, 1000),
    orderId,
    itemCode: paymentPackage.code || order.packageCode || order.packageId,
    description: paymentPackage.nameAr || order.packageName || "FORMA service",
    amount,
    amountMinor,
    currency: "SAR",
    provider: "moyasar",
    status: "initiated",
    createdAt: now,
    updatedAt: now,
    clientIp: request.headers.get("CF-Connecting-IP") || "",
    userAgent: request.headers.get("User-Agent") || "",
  };
  await writeFirestoreDocument(env, "paymentTransactions", transactionId, record);

  const response = await fetch("https://api.moyasar.com/v1/invoices", {
    method: "POST",
    headers: moyasarHeaders(env, transactionId),
    body: JSON.stringify({
      amount: amountMinor,
      currency: "SAR",
      description: `${record.description} - ${record.reference}`,
      callback_url: `${workerUrl}/api/payments/moyasar/callback?secret=${encodeURIComponent(callbackSecret)}&transaction_id=${transactionId}`,
      success_url: `${appUrl}/checkout.html?payment=success&transaction_id=${transactionId}`,
      back_url: `${appUrl}/checkout.html?payment=cancelled&transaction_id=${transactionId}`,
      metadata: { transaction_id: transactionId, order_id: orderId, user_id: payload.sub, reference: record.reference },
    }),
  });
  const invoice = await response.json();
  if (!response.ok) {
    await writeFirestoreDocument(env, "paymentTransactions", transactionId, {
      ...record,
      status: "creation_failed",
      failureCode: invoice.message || invoice.type || "invoice_creation_failed",
      updatedAt: new Date(),
    });
    throw new Error(invoice.message || "Moyasar invoice creation failed.");
  }
  await writeFirestoreDocument(env, "paymentTransactions", transactionId, {
    ...record,
    status: invoice.status === "paid" ? "paid" : "pending",
    providerInvoiceId: invoice.id,
    checkoutUrl: invoice.url,
    providerCreatedAt: invoice.created_at || "",
    updatedAt: new Date(),
  });
  return json({ transactionId, reference: record.reference, url: invoice.url }, 201);
}

async function handlePaymentCallback(request, env) {
  const url = new URL(request.url);
  if (!env.PAYMENT_CALLBACK_SECRET || url.searchParams.get("secret") !== env.PAYMENT_CALLBACK_SECRET) {
    return json({ error: "Invalid callback secret." }, 403);
  }
  const transactionId = url.searchParams.get("transaction_id") || "";
  if (!/^[0-9a-f-]{36}$/i.test(transactionId)) return json({ error: "Invalid transaction." }, 400);
  await reconcileTransaction(env, transactionId);
  return json({ received: true });
}

async function handlePaymentStatus(request, env, transactionId) {
  const { payload, token } = await requireUser(request, env);
  const record = await readFirestoreDocument(env, "paymentTransactions", transactionId);
  if (!record) return json({ error: "Payment transaction was not found." }, 404);
  const role = await getUserRole(payload, env, token);
  if (record.userId !== payload.sub && !["admin", "owner"].includes(role)) {
    return json({ error: "Payment transaction is not available for this account." }, 403);
  }
  const updated = record.status === "paid" ? record : await reconcileTransaction(env, transactionId, record);
  return json({
    transactionId,
    reference: updated.reference,
    status: updated.status,
    amount: updated.amount,
    currency: updated.currency,
    paidAt: updated.paidAt || null,
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

      if (url.pathname === "/api/payments/checkout" && request.method === "POST") {
        return await handleCreateCheckout(request, env);
      }

      if (url.pathname === "/api/notifications/order-created" && request.method === "POST") {
        return await handleOrderNotification(request, env);
      }

      if (url.pathname === "/api/payments/moyasar/callback" && request.method === "POST") {
        return await handlePaymentCallback(request, env);
      }

      if (url.pathname.startsWith("/api/payments/status/") && request.method === "GET") {
        return await handlePaymentStatus(request, env, url.pathname.replace("/api/payments/status/", ""));
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
