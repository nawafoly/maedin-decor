import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

const AR_TRANSLATIONS = [
  ["Residential / Interior Design", "سكني / تصميم داخلي"],
  ["Residential / Exterior Design", "سكني / تصميم خارجي"],
  ["Commercial / Fit-out", "تجاري / تنفيذ وتشطيبات"],
  ["Interior Design", "تصميم داخلي"],
  ["Fit-out", "تنفيذ وتشطيبات"],
  ["Fit out", "تنفيذ وتشطيبات"],
  ["Furnishing", "تأثيث"],
  ["Project Management", "إدارة المشاريع"],
  ["Residential", "سكني"],
  ["Commercial", "تجاري"],
  ["Interior", "داخلي"],
  ["Exterior", "خارجي"],
  ["Facade", "واجهة"],
  ["Villa", "فيلا"],
  ["Riyadh", "الرياض"],
  ["Jeddah", "جدة"],
  ["Delivered", "تم التسليم"],
  ["Completed", "مكتمل"],
  ["In Progress", "قيد التنفيذ"],
  ["Concept", "تصور"],
  ["Featured", "مميز"],
  ["Private residential client", "عميل سكني خاص"],
  ["Commercial client", "عميل تجاري"],
  ["Private client", "عميل خاص"],
  ["weeks", "أسابيع"],
  ["week", "أسبوع"],
  ["m2", "م2"],
];

const EN_TRANSLATIONS = [
  ["سكني / تصميم داخلي", "Residential / Interior Design"],
  ["سكني / تصميم خارجي", "Residential / Exterior Design"],
  ["تجاري / تنفيذ وتشطيبات", "Commercial / Fit-out"],
  ["تصميم داخلي", "Interior Design"],
  ["تنفيذ وتشطيبات", "Fit-out"],
  ["تأثيث", "Furnishing"],
  ["إدارة المشاريع", "Project Management"],
  ["سكني", "Residential"],
  ["تجاري", "Commercial"],
  ["داخلي", "Interior"],
  ["خارجي", "Exterior"],
  ["واجهة", "Facade"],
  ["فيلا", "Villa"],
  ["الرياض", "Riyadh"],
  ["جدة", "Jeddah"],
  ["تم التسليم", "Delivered"],
  ["مكتمل", "Completed"],
  ["قيد التنفيذ", "In Progress"],
  ["تصور", "Concept"],
  ["مميز", "Featured"],
  ["عميل سكني خاص", "Private residential client"],
  ["عميل تجاري", "Commercial client"],
  ["عميل خاص", "Private client"],
  ["أسابيع", "weeks"],
  ["أسبوع", "week"],
  ["م2", "m2"],
];

const hiddenStatuses = new Set(["مخفي", "hidden", "archived", "disabled"]);
const deliveredStatuses = new Set([
  "delivered",
  "completed",
  "complete",
  "finished",
  "handed over",
  "handover",
  "تم التسليم",
  "مكتمل",
  "منجز",
]);
const inProgressStatuses = new Set([
  "in progress",
  "ongoing",
  "under progress",
  "قيد التنفيذ",
  "جاري التنفيذ",
]);
const conceptStatuses = new Set(["concept", "idea", "تصور", "مفهوم"]);

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

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean))];
}

export function subscribePublicProjects(callback, onError) {
  return onSnapshot(
    collection(db, "projects"),
    (snapshot) => {
      callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    },
    onError,
  );
}

export function isVisibleProject(project) {
  const status = normalizeString(project?.status).toLowerCase();
  return !hiddenStatuses.has(status);
}

export function getProjectTitle(project, language = "ar") {
  return localizeText(
    project?.titleAr || project?.titleEn || project?.title || project?.name || project?.label || project?.id,
    language,
  );
}

export function getProjectDescription(project, language = "ar") {
  return localizeText(
    project?.descriptionAr || project?.descriptionEn || project?.description || project?.details || project?.results || "",
    language,
  );
}

export function getProjectType(project, language = "ar") {
  return localizeText(project?.projectType || project?.category || "", language);
}

export function getProjectCity(project, language = "ar") {
  return localizeText(project?.city || project?.location || "", language);
}

export function getProjectStatusLabel(project, language = "ar") {
  const rawStatus =
    project?.publishState ||
    project?.deliveryStatus ||
    project?.projectStatus ||
    project?.stage ||
    project?.statusLabel ||
    "";

  if (rawStatus) return localizeText(rawStatus, language);
  if (project?.featured) return language === "ar" ? "مميز" : "Featured";
  return language === "ar" ? "منشور" : "Published";
}

export function getProjectBadgeLabel(project, language = "ar") {
  return getProjectStatusLabel(project, language);
}

export function getProjectEyebrow(project, language = "ar") {
  const parts = [getProjectType(project, language), getProjectCity(project, language)].filter(Boolean);
  return parts.join(" / ");
}

export function getProjectImages(project) {
  const imageSources = [
    ...normalizeArray(project?.images),
    ...normalizeArray(project?.gallery),
    ...normalizeArray(project?.heroImage),
    ...normalizeArray(project?.image),
  ];

  return uniqueStrings(imageSources.map(extractImageValue));
}

export function getProjectHeroImage(project) {
  return getProjectImages(project)[0] || "/images/video-image.avif";
}

export function getProjectGallery(project) {
  return getProjectImages(project);
}

export function getProjectList(project) {
  return normalizeArray(project).map((entry) => normalizeString(entry)).filter(Boolean);
}

export function getProjectScope(project) {
  return getProjectList(project?.scope || project?.scopeItems || project?.highlights);
}

export function getProjectMaterials(project) {
  return getProjectList(project?.materials || project?.materialsList);
}

export function getProjectFacets(project) {
  const text = [
    project?.projectType,
    project?.category,
    project?.titleAr,
    project?.titleEn,
    project?.descriptionAr,
    project?.descriptionEn,
    project?.details,
    project?.city,
    project?.location,
    project?.scope,
    project?.materials,
  ]
    .flat()
    .map((entry) => normalizeString(entry).toLowerCase())
    .join(" ");

  const facets = new Set();

  if (/(commercial|تجاري|retail|showroom|office|مكتب|store|shop|معرض)/i.test(text)) {
    facets.add("commercial");
  }

  if (/(residential|سكني|villa|فيلا|home|apartment|شقة)/i.test(text)) {
    facets.add("residential");
  }

  if (/(exterior|خارجي|facade|واجهة|outdoor|outside)/i.test(text)) {
    facets.add("exterior");
  }

  if (/(fit-?out|execution|تنفيذ|تشطيب|تشطيبات|finishing|finish|التشطيب)/i.test(text)) {
    facets.add("fitout");
  }

  if (/(furnishing|furniture|تأثيث|أثاث)/i.test(text)) {
    facets.add("furnishing");
  }

  if (/(interior|داخلي)/i.test(text)) {
    facets.add("interior");
  }

  return [...facets];
}

export function matchesProjectFilter(project, filter) {
  if (!filter || filter === "all") return true;
  return getProjectFacets(project).includes(filter);
}

export function sortPublicProjects(a, b) {
  const featuredDelta = Number(Boolean(b?.featured)) - Number(Boolean(a?.featured));
  if (featuredDelta) return featuredDelta;

  const sortA = Number.isFinite(Number(a?.sortOrder)) ? Number(a.sortOrder) : Number.POSITIVE_INFINITY;
  const sortB = Number.isFinite(Number(b?.sortOrder)) ? Number(b.sortOrder) : Number.POSITIVE_INFINITY;
  if (sortA !== sortB) return sortA - sortB;

  const timeA = a?.updatedAt?.seconds || a?.createdAt?.seconds || 0;
  const timeB = b?.updatedAt?.seconds || b?.createdAt?.seconds || 0;
  if (timeA !== timeB) return timeB - timeA;

  return getProjectTitle(a, "en").localeCompare(getProjectTitle(b, "en"), "en");
}

export function getProjectProgressState(project) {
  const raw =
    project?.publishState ||
    project?.deliveryStatus ||
    project?.projectStatus ||
    project?.stage ||
    project?.statusState ||
    "";
  const normalized = normalizeString(raw).toLowerCase();

  if (!normalized) return "";
  if ([...deliveredStatuses].some((entry) => normalized.includes(entry))) return "delivered";
  if ([...inProgressStatuses].some((entry) => normalized.includes(entry))) return "in-progress";
  if ([...conceptStatuses].some((entry) => normalized.includes(entry))) return "concept";
  return "other";
}

export function getProjectArea(project, language = "ar") {
  return localizeText(project?.area || project?.size || "", language);
}

export function getProjectDuration(project, language = "ar") {
  return localizeText(project?.duration || project?.timeline || "", language);
}

export function getProjectClientType(project, language = "ar") {
  return localizeText(project?.clientType || project?.client || project?.customerType || "", language);
}
