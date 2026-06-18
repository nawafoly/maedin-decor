import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { designs, pricing, projects, services, settings, slides } from "../data/siteData";

export const orderStatuses = [
  "جديد",
  "بانتظار المراجعة",
  "بانتظار الدفع",
  "مدفوع",
  "قيد التنفيذ",
  "مكتمل",
  "ملغي",
];

export const invoiceStatuses = ["مسودة", "مرسلة", "مدفوعة", "غير مدفوعة", "ملغية"];

export const adminSections = [
  {
    key: "projects",
    collectionName: "projects",
    title: "المشاريع",
    description: "إضافة وتعديل وحذف المشاريع المنشورة أو المخفية.",
    fields: [
      ["titleAr", "عنوان المشروع عربي", "text"],
      ["titleEn", "عنوان المشروع إنجليزي", "text"],
      ["descriptionAr", "وصف عربي", "textarea"],
      ["descriptionEn", "وصف إنجليزي", "textarea"],
      ["projectType", "نوع المشروع", "select", ["داخلي", "خارجي", "كامل", "تجاري", "سكني"]],
      ["status", "حالة النشر", "select", ["منشور", "مخفي"]],
      ["sortOrder", "ترتيب الظهور", "number"],
      ["featured", "Featured project", "checkbox"],
      ["images", "صور المشروع", "files"],
    ],
  },
  {
    key: "designs",
    collectionName: "designs",
    title: "التصاميم",
    description: "إدارة التصاميم الجاهزة وصورها وأسعارها وحالة نشرها.",
    fields: [
      ["titleAr", "اسم التصميم عربي", "text"],
      ["titleEn", "اسم التصميم إنجليزي", "text"],
      ["descriptionAr", "الوصف", "textarea"],
      ["designType", "نوع التصميم", "select", ["غرفة", "مطبخ", "مجلس", "مكتب", "فيلا", "متجر", "خارجي"]],
      ["price", "السعر إن وجد", "text"],
      ["purchaseMode", "طريقة العرض", "select", ["جاهز للشراء", "للعرض فقط"]],
      ["status", "حالة النشر", "select", ["منشور", "مخفي"]],
      ["images", "صور التصميم", "files"],
    ],
  },
  {
    key: "services",
    collectionName: "services",
    title: "الخدمات",
    description: "إدارة الخدمات وأسعار البداية وخيارات الشراء أو طلب السعر.",
    fields: [
      ["nameAr", "اسم الخدمة عربي", "text"],
      ["nameEn", "اسم الخدمة إنجليزي", "text"],
      ["descriptionAr", "وصف الخدمة", "textarea"],
      ["price", "السعر أو يبدأ من", "text"],
      ["priceFrom", "السعر يبدأ من", "text"],
      ["discount", "الخصم", "text"],
      ["executionTime", "مدة التنفيذ التقريبية", "text"],
      ["sortOrder", "ترتيب الظهور", "number"],
      ["directPurchase", "قابلة للشراء المباشر", "checkbox"],
      ["quoteOnly", "طلب عرض سعر فقط", "checkbox"],
      ["status", "حالة النشر", "select", ["منشور", "مخفي"]],
    ],
  },
  {
    key: "packages",
    collectionName: "packages",
    title: "الباقات",
    description: "إدارة الباقات والمميزات والفئة المناسبة وطريقة الطلب.",
    fields: [
      ["nameAr", "اسم الباقة", "text"],
      ["price", "السعر", "text"],
      ["discount", "الخصم", "text"],
      ["featuresText", "المميزات - كل ميزة في سطر", "textarea"],
      ["bestFor", "مناسبة لـ", "select", ["غرفة", "فيلا", "متجر", "استشارة", "مشروع كامل"]],
      ["purchaseMode", "طريقة الطلب", "select", ["شراء مباشر", "طلب عرض سعر"]],
      ["sortOrder", "ترتيب الظهور", "number"],
      ["status", "حالة النشر", "select", ["منشور", "مخفي"]],
    ],
  },
  {
    key: "orders",
    collectionName: "orders",
    title: "الطلبات",
    description: "مراجعة طلبات العملاء وتحديث الحالة والملاحظات الداخلية.",
    fields: [
      ["customerName", "العميل", "text"],
      ["customerEmail", "البريد", "email"],
      ["orderType", "نوع الطلب", "select", ["طلب عرض سعر", "شراء مباشر"]],
      ["serviceType", "نوع الخدمة", "text"],
      ["projectType", "نوع المشروع", "text"],
      ["city", "المدينة", "text"],
      ["budget", "الميزانية", "text"],
      ["area", "المساحة التقريبية", "text"],
      ["paymentMethod", "طريقة الدفع", "select", ["أونلاين", "كاش في المكتب", "تحويل لاحق"]],
      ["status", "الحالة", "select", orderStatuses],
      ["notes", "ملاحظات العميل", "textarea"],
      ["adminNotes", "ملاحظات داخلية للأدمن", "textarea"],
      ["attachments", "مرفقات إضافية", "files"],
    ],
  },
  {
    key: "invoices",
    collectionName: "invoices",
    title: "الفواتير",
    description: "إنشاء فواتير وربطها بالعميل والطلب ورفع PDF عند الحاجة.",
    fields: [
      ["invoiceNumber", "رقم الفاتورة", "text"],
      ["customerId", "معرف العميل", "text"],
      ["customerEmail", "بريد العميل", "email"],
      ["orderId", "معرف الطلب", "text"],
      ["amount", "الإجمالي", "number"],
      ["discount", "الخصم", "number"],
      ["status", "حالة الفاتورة", "select", invoiceStatuses],
      ["paymentMethod", "طريقة الدفع", "select", ["أونلاين", "كاش", "تحويل"]],
      ["description", "وصف الفاتورة", "textarea"],
      ["pdf", "ملف PDF", "files"],
    ],
  },
  {
    key: "siteSettings",
    collectionName: "siteSettings",
    title: "محتوى الموقع",
    description: "نصوص الصفحة الرئيسية ومعلومات التواصل وروابط السوشيال.",
    fields: [
      ["key", "مفتاح الإعداد", "text"],
      ["heroTitle", "عنوان Hero", "text"],
      ["homeText", "نصوص الصفحة الرئيسية", "textarea"],
      ["aboutText", "من نحن", "textarea"],
      ["heroImage", "رابط صورة Hero", "text"],
      ["sliderImages", "صور السلايدر", "textarea"],
      ["homepageServices", "الخدمات المعروضة في الرئيسية", "textarea"],
      ["featuredProjects", "المشاريع المميزة", "textarea"],
      ["phone", "رقم واتساب", "text"],
      ["email", "البريد", "email"],
      ["address", "العنوان", "text"],
      ["socialLinks", "روابط السوشيال", "textarea"],
    ],
  },
  {
    key: "settings",
    collectionName: "siteSettings",
    title: "إعدادات الموقع",
    description: "إعدادات تشغيلية عامة للعلامة والتواصل والعملات والسياسات.",
    fields: [
      ["key", "مفتاح الإعداد", "text"],
      ["brand", "اسم العلامة", "text"],
      ["currency", "العملة", "text"],
      ["defaultLanguage", "اللغة الأساسية", "select", ["ar", "en"]],
      ["whatsapp", "واتساب", "text"],
      ["email", "البريد", "email"],
      ["address", "العنوان", "text"],
      ["maintenanceMode", "وضع الصيانة", "checkbox"],
      ["policy", "سياسة التشغيل", "textarea"],
    ],
  },
  {
    key: "uploadsMetadata",
    collectionName: "uploadsMetadata",
    title: "الملفات",
    description: "سجل الملفات والصور المرفوعة إلى Cloudflare R2.",
    readOnly: true,
    fields: [],
  },
  {
    key: "users",
    collectionName: "users",
    title: "العملاء",
    description: "قائمة العملاء، تعطيل الحساب، وترقية الصلاحيات.",
    fields: [
      ["displayName", "اسم العميل", "text"],
      ["email", "البريد", "email"],
      ["phone", "الجوال", "text"],
      ["role", "الصلاحية", "select", ["customer", "admin", "owner"]],
      ["accountDisabled", "تعطيل الحساب", "checkbox"],
    ],
  },
];

export function subscribeCollection(collectionName, callback) {
  return onSnapshot(collection(db, collectionName), (snapshot) => {
    const items = snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort((a, b) => {
        const first = b.createdAt?.seconds || b.updatedAt?.seconds || 0;
        const second = a.createdAt?.seconds || a.updatedAt?.seconds || 0;
        return first - second;
      });
    callback(items);
  });
}

export async function saveAdminDocument(section, payload, editingId, user) {
  const now = serverTimestamp();
  const collectionName = section.collectionName;
  const nextPayload = {
    ...payload,
    updatedAt: now,
    updatedBy: user?.uid || "",
  };

  if (collectionName === "invoices" && !nextPayload.invoiceNumber) {
    nextPayload.invoiceNumber = `INV-${Date.now()}`;
  }

  if (editingId) {
    await updateDoc(doc(db, collectionName, editingId), nextPayload);
    return editingId;
  }

  nextPayload.createdAt = now;
  nextPayload.createdBy = user?.uid || "";
  const created = await addDoc(collection(db, collectionName), nextPayload);
  return created.id;
}

export function saveUserProfile(uid, payload) {
  return setDoc(doc(db, "users", uid), { ...payload, updatedAt: serverTimestamp() }, { merge: true });
}

export function removeAdminDocument(collectionName, id) {
  return deleteDoc(doc(db, collectionName, id));
}

function imageFile(url, name = "صورة محلية") {
  return url ? [{ url, key: url, name, source: "public" }] : [];
}

function seedDoc(collectionName, id, payload, user) {
  return setDoc(
    doc(db, collectionName, id),
    {
      ...payload,
      source: "legacy-seed",
      importedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: user?.uid || "",
    },
    { merge: true },
  );
}

export async function importExistingSiteData(user) {
  const writes = [];

  services.forEach((item, index) => {
    writes.push(
      seedDoc("services", item.id, {
        nameAr: item.title,
        nameEn: item.title,
        descriptionAr: item.description,
        details: item.details || "",
        category: item.category || "",
        price: item.price || "",
        priceFrom: item.price || "",
        features: item.features || [],
        featuresText: (item.features || []).join("\n"),
        images: imageFile(item.image, item.title),
        status: "منشور",
        sortOrder: index + 1,
        directPurchase: false,
        quoteOnly: true,
        createdAt: serverTimestamp(),
        createdBy: user?.uid || "",
      }, user),
    );
  });

  designs.forEach((item, index) => {
    writes.push(
      seedDoc("designs", item.id, {
        titleAr: item.title,
        titleEn: item.title,
        descriptionAr: item.description,
        designType: item.category || "",
        style: item.style || "",
        price: item.price || "",
        purchaseMode: "جاهز للشراء",
        images: imageFile(item.image, item.title),
        status: "منشور",
        sortOrder: index + 1,
        createdAt: serverTimestamp(),
        createdBy: user?.uid || "",
      }, user),
    );
  });

  projects.forEach((item, index) => {
    writes.push(
      seedDoc("projects", item.id, {
        titleAr: item.title,
        titleEn: item.title,
        descriptionAr: item.description,
        descriptionEn: item.details || item.description,
        projectType: item.category || "",
        city: item.city || "",
        area: item.area || "",
        duration: item.duration || "",
        status: "منشور",
        publishState: item.status || "",
        featured: index < 3,
        sortOrder: index + 1,
        images: imageFile(item.image, item.title).concat((item.gallery || []).map((url) => ({ url, key: url, name: url, source: "public" }))),
        scope: item.scope || [],
        materials: item.materials || [],
        results: item.results || "",
        createdAt: serverTimestamp(),
        createdBy: user?.uid || "",
      }, user),
    );
  });

  pricing.forEach((item, index) => {
    writes.push(
      seedDoc("packages", item.id, {
        nameAr: item.title,
        label: item.label,
        price: item.price,
        features: item.includes || [],
        featuresText: (item.includes || []).join("\n"),
        bestFor: "استشارة",
        purchaseMode: "طلب عرض سعر",
        descriptionAr: item.description,
        duration: item.duration,
        status: "منشور",
        sortOrder: index + 1,
        createdAt: serverTimestamp(),
        createdBy: user?.uid || "",
      }, user),
    );
  });

  writes.push(
    seedDoc("siteSettings", "general", {
      key: "general",
      brand: settings.brand,
      homeText: settings.tagline,
      aboutText: settings.tagline,
      phone: settings.phone,
      whatsapp: settings.phone,
      email: settings.email,
      address: settings.address,
      currency: "SAR",
      defaultLanguage: "ar",
      policy: "إدارة المحتوى والطلبات والفواتير من لوحة FORMA.",
      sliderImages: slides.map((slide) => slide.image).join("\n"),
      heroTitle: slides[0]?.title || settings.brand,
      heroImage: slides[0]?.image || "",
      homepageServices: services.slice(0, 4).map((item) => item.id).join("\n"),
      featuredProjects: projects.slice(0, 3).map((item) => item.id).join("\n"),
      createdAt: serverTimestamp(),
      createdBy: user?.uid || "",
    }, user),
  );

  await Promise.all(writes);
  return writes.length;
}
