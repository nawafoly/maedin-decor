import { auth } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const UPLOAD_ENDPOINT = import.meta.env.VITE_UPLOAD_ENDPOINT || "/api/upload";

async function parseUploadResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => ({}));
  }

  const text = await response.text().catch(() => "");
  return {
    error: text.trim().startsWith("<!doctype") || text.trim().startsWith("<html")
      ? "مسار الرفع /api/upload يرجع صفحة الموقع وليس Cloudflare Worker. اربط VITE_UPLOAD_ENDPOINT بعنوان Worker أو انشر الموقع على Cloudflare Worker."
      : text.trim(),
  };
}

export async function uploadFiles(files, { folder = "customer", scope = "customer" } = {}) {
  const fileList = Array.from(files || []).filter(Boolean);
  if (!fileList.length) return [];

  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    throw new Error("يجب تسجيل الدخول قبل رفع الملفات.");
  }

  const formData = new FormData();
  formData.append("folder", folder);
  formData.append("scope", scope);
  fileList.forEach((file) => formData.append("files", file));

  const response = await fetch(UPLOAD_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const payload = await parseUploadResponse(response);

  if (!response.ok) {
    throw new Error(payload.error || `تعذر رفع الملفات إلى Cloudflare R2. رمز الخطأ: ${response.status}`);
  }

  const uploaded = payload.files || [];
  await Promise.all(
    uploaded.map((file) =>
      addDoc(collection(db, "uploadsMetadata"), {
        ...file,
        scope,
        folder,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      }),
    ),
  );

  return uploaded;
}
