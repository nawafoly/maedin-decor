import { pricing } from "../data/siteData.js";

const labels = {
  en: {
    packages: "Packages",
    availablePackages: "Available packages",
    intro:
      "These are the current FORMA packages used to prepare the project request total. The final quote is confirmed after reviewing the scope.",
    details: "Package details",
    stage: "Stage",
    finalQuote: "Confirmed after scope review",
    totalNote: "The total combines the listed starting package prices.",
  },
  ar: {
    packages: "البكجات",
    availablePackages: "البكجات المتاحة",
    intro:
      "هذه هي بكجات فورما الحالية المستخدمة لتجهيز إجمالي طلب المشروع. يتم اعتماد السعر النهائي بعد مراجعة النطاق.",
    details: "تفاصيل البكج",
    stage: "المرحلة",
    finalQuote: "يعتمد بعد مراجعة النطاق",
    totalNote: "الإجمالي يجمع أسعار البداية للبكجات المعروضة.",
  },
};

const arabicPackages = {
  consultation: {
    title: "استشارة التصميم",
    label: "نقطة البداية",
    price: "650 ر.س",
    duration: "60-90 دقيقة",
    description:
      "جلسة مركزة لمراجعة المساحة والأهداف ونطاق الميزانية واتجاه الأسلوب والخطوة الأنسب.",
    includes: ["مراجعة الموجز", "توجيه الأسلوب والميزانية", "توصية الخدمة", "ملخص الخطوة التالية"],
  },
  concept: {
    title: "بكج التصور",
    label: "اتجاه بصري",
    price: "يبدأ من 2,900 ر.س",
    duration: "5-7 أيام عمل",
    description: "تصور بصري مختصر لغرفة واحدة أو منطقة محددة قبل اعتماد ملف تصميم كامل.",
    includes: ["لوحة مزاجية", "اتجاه تخطيط أولي", "لوحة ألوان", "مراجع مواد"],
  },
  full: {
    title: "ملف مشروع كامل",
    label: "ملف تصميم متكامل",
    price: "يبدأ من 9,500 ر.س",
    duration: "2-4 أسابيع",
    description: "بكج تصميم أوسع يشمل التخطيط والاتجاه البصري واختيارات المواد ومراجع التنفيذ.",
    includes: ["تخطيط المساحة", "توجيه المواد والإضاءة", "مراجع الأثاث", "ملف التسليم"],
  },
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parsePriceAmount(price) {
  const match = price.match(/[\d,]+/);
  return match ? Number(match[0].replaceAll(",", "")) : 0;
}

function formatCurrency(value, language) {
  const amount = value.toLocaleString("en-US");
  return language === "ar" ? `${amount} ر.س` : `SAR ${amount}`;
}

function getPackages(language) {
  return pricing.map((item) => {
    if (language !== "ar") return item;
    return { ...item, ...(arabicPackages[item.id] || {}) };
  });
}

function renderPackageSection(language) {
  const text = labels[language] || labels.en;
  const packages = getPackages(language);

  return `<section class="request-packages mb-5">
    <div class="request-packages-head">
      <span class="title-accent text-uppercase">${escapeHtml(text.packages)}</span>
      <h2>${escapeHtml(text.availablePackages)}</h2>
      <p>${escapeHtml(text.intro)}</p>
    </div>
    <div class="row g-3">
      ${packages
        .map(
          (item, index) => `<div class="col-lg-4">
            <article class="forma-package-card ${index === 1 ? "is-featured" : ""}">
              <div class="forma-package-card__head">
                <span class="forma-package-card__number">${String(index + 1).padStart(2, "0")}</span>
                <span class="forma-package-card__label">${escapeHtml(item.label)}</span>
              </div>
              <h4>${escapeHtml(item.title)}</h4>
              <p class="forma-package-card__description">${escapeHtml(item.description)}</p>
              <div class="forma-package-card__meta">
                <span>${escapeHtml(text.stage)}</span>
                <strong>${escapeHtml(item.duration)}</strong>
              </div>
              <div class="forma-package-card__includes">
                <span>${escapeHtml(text.details)}</span>
                <ul>${item.includes.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}</ul>
              </div>
              <div class="forma-package-card__footer">
                <span>${escapeHtml(item.price)}</span>
                <strong>${escapeHtml(item.price)}</strong>
              </div>
            </article>
          </div>`,
        )
        .join("")}
    </div>
  </section>`;
}

function replaceTotalValues(html, language) {
  const total = pricing.reduce((sum, item) => sum + parsePriceAmount(item.price), 0);
  const text = labels[language] || labels.en;
  const totalValue = formatCurrency(total, language);

  return html.replace(
    /(<section class="cart-total[\s\S]*?<div class="total-row[\s\S]*?<span class="text-primary">)([^<]*)(<\/span>[\s\S]*?<div class="total-row[\s\S]*?<span class="text-primary">)([^<]*)(<\/span>)/,
    `$1${escapeHtml(totalValue)}$3${escapeHtml(text.finalQuote)}$5`,
  );
}

function appendTotalNote(html, language) {
  const text = labels[language] || labels.en;
  return html.replace(
    /(<\/section>\s*<\/div>\s*<\/main>)/,
    `<p class="mt-3 text-body-secondary">${escapeHtml(text.totalNote)}</p>$1`,
  );
}

export function enhanceRequestHtml(html, language) {
  const section = renderPackageSection(language);
  return appendTotalNote(
    replaceTotalValues(html.replace('<div class="cart-header row', `${section}<div class="cart-header row`), language),
    language,
  );
}

export function enhanceCheckoutHtml(html, language) {
  const section = renderPackageSection(language);
  return appendTotalNote(
    replaceTotalValues(html.replace('<section class="cart-total">', `${section}<section class="cart-total">`), language),
    language,
  );
}
