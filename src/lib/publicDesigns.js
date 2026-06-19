import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

const hiddenStatuses = new Set(["مخفي", "hidden", "archived", "disabled"]);

const AR_TRANSLATIONS = [
  ["Majlis", "مجلس"],
  ["Villa", "فيلا"],
  ["Kitchen", "مطبخ"],
  ["Facade", "واجهة"],
  ["Commercial", "تجاري"],
  ["Room", "غرفة"],
  ["Office", "مكتب"],
  ["Store", "متجر"],
  ["Exterior", "خارجي"],
  ["Modern", "حديث"],
  ["Minimal", "بسيط"],
  ["Classic", "كلاسيكي"],
  ["Luxury", "فاخر"],
  ["Contemporary", "معاصر"],
  ["SAR", "ر.س"],
  ["Custom quote", "تسعير حسب النطاق"],
];

const EN_TRANSLATIONS = [
  ["مجلس", "Majlis"],
  ["فيلا", "Villa"],
  ["مطبخ", "Kitchen"],
  ["واجهة", "Facade"],
  ["تجاري", "Commercial"],
  ["غرفة", "Room"],
  ["مكتب", "Office"],
  ["متجر", "Store"],
  ["خارجي", "Exterior"],
  ["حديث", "Modern"],
  ["بسيط", "Minimal"],
  ["كلاسيكي", "Classic"],
  ["فاخر", "Luxury"],
  ["معاصر", "Contemporary"],
  ["ر.س", "SAR"],
  ["تسعير حسب النطاق", "Custom quote"],
];

function normalizeString(value) {
  return String(value || "").trim();
}

function replaceMany(value, entries) {
  return entries.reduce((result, [from, to]) => result.replaceAll(from, to), value);
}

function localizeText(value, language = "ar") {
  const normalized = normalizeString(value);
  if (!normalized) return "";
  return replaceMany(normalized, language === "ar" ? AR_TRANSLATIONS : EN_TRANSLATIONS);
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return value ? [value] : [];
}

function extractImageValue(entry) {
  if (!entry) return "";
  if (typeof entry === "string") return entry.trim();
  if (typeof entry === "object") {
    return entry.url || entry.src || entry.image || entry.path || "";
  }
  return "";
}

export function subscribePublicDesigns(callback, onError) {
  return onSnapshot(
    collection(db, "designs"),
    (snapshot) => {
      callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    },
    onError,
  );
}

export function isVisibleDesign(design) {
  const status = normalizeString(design?.status).toLowerCase();
  return !hiddenStatuses.has(status);
}

export function getDesignTitle(design, language = "ar") {
  return localizeText(design?.titleAr || design?.titleEn || design?.title || design?.name || design?.id, language);
}

export function getDesignDescription(design, language = "ar") {
  return localizeText(design?.descriptionAr || design?.descriptionEn || design?.description || "", language);
}

export function getDesignType(design, language = "ar") {
  return localizeText(design?.designType || design?.category || "", language);
}

export function getDesignStyle(design, language = "ar") {
  return localizeText(design?.style || design?.designStyle || "", language);
}

export function getDesignPrice(design, language = "ar") {
  return localizeText(design?.price || design?.priceFrom || (language === "ar" ? "تسعير حسب النطاق" : "Custom quote"), language);
}

export function getDesignImage(design) {
  const images = [
    ...normalizeArray(design?.images),
    ...normalizeArray(design?.gallery),
    ...normalizeArray(design?.heroImage),
    ...normalizeArray(design?.image),
  ]
    .map(extractImageValue)
    .filter(Boolean);

  return images[0] || "/images/product-item1.avif";
}

export function designMatchesText(design, query, language = "ar") {
  const normalizedQuery = normalizeString(query).toLowerCase();
  if (!normalizedQuery) return true;

  const haystack = [
    getDesignTitle(design, language),
    getDesignDescription(design, language),
    getDesignType(design, language),
    getDesignStyle(design, language),
    getDesignPrice(design, language),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

export function designMatchesFilter(design, filter, language = "ar") {
  if (!filter || filter === "all") return true;

  const text = [
    getDesignType(design, language),
    getDesignStyle(design, language),
    getDesignTitle(design, language),
    getDesignDescription(design, language),
  ]
    .join(" ")
    .toLowerCase();

  return text.includes(filter.toLowerCase());
}

export function sortPublicDesigns(designs, sortMode = "default") {
  return [...designs].sort((a, b) => {
    if (sortMode === "newest") {
      const timeA = a?.updatedAt?.seconds || a?.createdAt?.seconds || 0;
      const timeB = b?.updatedAt?.seconds || b?.createdAt?.seconds || 0;
      return timeB - timeA;
    }

    if (sortMode === "price") {
      const priceA = Number(String(a?.price || "").replace(/[^\d.]/g, "")) || Number.POSITIVE_INFINITY;
      const priceB = Number(String(b?.price || "").replace(/[^\d.]/g, "")) || Number.POSITIVE_INFINITY;
      return priceA - priceB;
    }

    const sortA = Number.isFinite(Number(a?.sortOrder)) ? Number(a.sortOrder) : Number.POSITIVE_INFINITY;
    const sortB = Number.isFinite(Number(b?.sortOrder)) ? Number(b.sortOrder) : Number.POSITIVE_INFINITY;
    if (sortA !== sortB) return sortA - sortB;

    return getDesignTitle(a, "en").localeCompare(getDesignTitle(b, "en"), "en");
  });
}

