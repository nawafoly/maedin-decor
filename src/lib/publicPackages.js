import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { pricing } from "../data/siteData";

const fallbackArabic = {
  consultation: {
    nameAr: "استشارة التصميم",
    descriptionAr: "جلسة مركزة لمراجعة المساحة والأهداف والميزانية واتجاه التصميم وتحديد الخطوة التالية.",
    features: ["مراجعة موجز المشروع", "توجيه الأسلوب والميزانية", "توصية الخدمة المناسبة", "ملخص الخطوة التالية"],
  },
  concept: {
    nameAr: "بكج التصور",
    descriptionAr: "اتجاه بصري متكامل لمساحة محددة يشمل لوحة مزاجية وتخطيطاً أولياً وألواناً ومراجع مواد.",
    features: ["لوحة مزاجية", "اتجاه تخطيط أولي", "لوحة ألوان", "مراجع مواد"],
  },
  full: {
    nameAr: "ملف مشروع كامل",
    descriptionAr: "ملف تصميم متكامل يشمل التخطيط والاتجاه البصري والمواد والإضاءة والأثاث ومراجع التنفيذ.",
    features: ["تخطيط المساحة", "توجيه المواد والإضاءة", "مراجع الأثاث", "ملف التسليم"],
  },
};

function priceAmount(value) {
  return Number(String(value || "").replace(/[^\d.]/g, "")) || 0;
}

export const fallbackPackages = pricing.map((item, index) => ({
  id: item.id,
  code: item.id,
  nameAr: fallbackArabic[item.id]?.nameAr || item.title,
  nameEn: item.title,
  descriptionAr: fallbackArabic[item.id]?.descriptionAr || item.description,
  descriptionEn: item.description,
  price: item.price,
  priceAmount: priceAmount(item.price),
  duration: item.duration,
  features: fallbackArabic[item.id]?.features || item.includes,
  requestEnabled: true,
  requiresPayment: item.id === "consultation",
  status: "منشور",
  sortOrder: index + 1,
  source: "fallback",
}));

export function subscribeRequestPackages(callback, onError) {
  return onSnapshot(
    collection(db, "packages"),
    (snapshot) => {
      const packages = snapshot.docs
        .map((item) => {
          const fallback = fallbackPackages.find((entry) => entry.id === item.id) || {};
          return { ...fallback, id: item.id, ...item.data() };
        })
        .filter((item) => item.status !== "مخفي" && item.requestEnabled !== false)
        .sort((a, b) => Number(a.sortOrder || 999) - Number(b.sortOrder || 999));
      callback(packages.length ? packages : fallbackPackages);
    },
    (error) => {
      callback(fallbackPackages);
      onError?.(error);
    },
  );
}

export function packageName(item, language = "ar") {
  const fallback = fallbackArabic[item.code || item.id];
  const arabicName = item.nameAr && item.nameAr !== item.nameEn ? item.nameAr : fallback?.nameAr;
  return language === "ar" ? arabicName || item.nameAr || item.nameEn || item.code : item.nameEn || item.nameAr || item.code;
}

export function packageDescription(item, language = "ar") {
  const fallback = fallbackArabic[item.code || item.id];
  const arabicDescription = item.descriptionAr && item.descriptionAr !== item.descriptionEn ? item.descriptionAr : fallback?.descriptionAr;
  return language === "ar" ? arabicDescription || item.descriptionAr || item.descriptionEn || "" : item.descriptionEn || item.descriptionAr || "";
}

export function packageFeatures(item) {
  const fallback = fallbackArabic[item.code || item.id];
  if (Array.isArray(item.features)) {
    const containsArabic = item.features.some((entry) => /[\u0600-\u06ff]/.test(entry));
    return containsArabic ? item.features : fallback?.features || item.features;
  }
  const features = String(item.featuresText || "").split(/\r?\n/).map((entry) => entry.trim()).filter(Boolean);
  const containsArabic = features.some((entry) => /[\u0600-\u06ff]/.test(entry));
  return containsArabic ? features : fallback?.features || features;
}
