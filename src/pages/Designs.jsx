import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import LegacyPage from "../components/LegacyPage";
import NewsletterSection from "../components/NewsletterSection";
import { useLanguage } from "../contexts/LanguageContext";
import {
  designMatchesFilter,
  designMatchesText,
  getDesignImage,
  getDesignPrice,
  getDesignTitle,
  isVisibleDesign,
  sortPublicDesigns,
  subscribePublicDesigns,
} from "../lib/publicDesigns";
import { routes } from "../utils/routes";

const categories = [
  { key: "all", ar: "الكل", en: "All" },
  { key: "فيلا", ar: "فلل", en: "Villas" },
  { key: "مجلس", ar: "مجالس", en: "Majlis" },
  { key: "واجهة", ar: "واجهات", en: "Facades" },
  { key: "تجاري", ar: "تجاري", en: "Commercial" },
];

const styles = [
  { key: "حديث", ar: "حديث", en: "Modern" },
  { key: "بسيط", ar: "بسيط", en: "Minimal" },
  { key: "كلاسيكي", ar: "كلاسيكي", en: "Classic" },
];

const services = [
  { key: "تصميم داخلي", ar: "تصميم داخلي", en: "Interior Design" },
  { key: "تنفيذ", ar: "تنفيذ وتشطيبات", en: "Fit-out" },
  { key: "تأثيث", ar: "تأثيث", en: "Furnishing" },
];

const pricing = [
  { key: "استشارة", ar: "الاستشارة", en: "Consultation" },
  { key: "باقة", ar: "باقة التصور", en: "Concept package" },
  { key: "متكامل", ar: "ملف مشروع متكامل", en: "Full project file" },
  { key: "تنفيذ", ar: "تسعير التنفيذ", en: "Fit-out quote" },
  { key: "النطاق", ar: "نطاق مخصص", en: "Custom scope" },
];

function SidebarGroup({ title, items, activeFilter, language, onFilter }) {
  return (
    <div className="widget mb-5">
      <h5 className="widget-title text-uppercase">{title}</h5>
      <ul className="list-unstyled lh-lg">
        {items.map((item) => (
          <li key={`${title}-${item.key}`}>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                onFilter(item.key);
              }}
              aria-current={activeFilter === item.key ? "true" : undefined}
            >
              {language === "ar" ? item.ar : item.en}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DesignCard({ design, language }) {
  const title = getDesignTitle(design, language);

  return (
    <div className="col-sm-6 col-lg-4">
      <div className="product-card position-relative">
        <div className="image-holder zoom-effect">
          <img src={getDesignImage(design)} alt={title} className="img-fluid zoom-in" />
          <div className="cart-concern position-absolute">
            <div className="cart-button">
              <Link to={`${routes.serviceDetails}?design=${design.id}`} className="btn">
                {language === "ar" ? "عرض التفاصيل" : "View details"}
              </Link>
            </div>
          </div>
        </div>
        <div className="card-detail text-center pt-3 pb-2">
          <h5 className="card-title fs-3 text-capitalize">
            <Link to={`${routes.serviceDetails}?design=${design.id}`}>{title}</Link>
          </h5>
          <span className="item-price text-primary fs-3 fw-light">{getDesignPrice(design, language)}</span>
        </div>
      </div>
    </div>
  );
}

export default function Designs() {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(() => searchParams.get("search") || "");
  const [sortMode, setSortMode] = useState("default");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const unsubscribe = subscribePublicDesigns(
      (items) => {
        setDesigns(items);
        setLoading(false);
        setError("");
      },
      (nextError) => {
        console.error("Designs page snapshot error:", nextError);
        setError(nextError?.message || "Unable to load designs.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const visibleDesigns = useMemo(() => {
    return designs.filter(isVisibleDesign);
  }, [designs]);

  const filteredDesigns = useMemo(() => {
    const matches = visibleDesigns
      .filter((design) => designMatchesText(design, query, language))
      .filter((design) => designMatchesFilter(design, activeFilter, language));

    return sortPublicDesigns(matches, sortMode);
  }, [activeFilter, language, query, sortMode, visibleDesigns]);

  if ((loading || error) && !designs.length) {
    return <LegacyPage page="shop" />;
  }

  return (
    <>
      <section className="page-title jarallax">
        <div className="container">
          <h1>{language === "ar" ? "التصاميم" : "Designs"}</h1>
        </div>
      </section>

      <main className="page-content product-store Designs-page padding-large">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-9">
              <div className="Designs-toolbar d-flex flex-wrap justify-content-between align-items-center mb-4">
                <p className="mb-0">
                  {language === "ar"
                    ? `عرض ${filteredDesigns.length} من ${visibleDesigns.length} تصميم منشور`
                    : `Showing ${filteredDesigns.length} of ${visibleDesigns.length} published designs`}
                </p>
                <select aria-label={language === "ar" ? "ترتيب التصاميم" : "Design sorting"} value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
                  <option value="default">{language === "ar" ? "الترتيب الافتراضي" : "Default order"}</option>
                  <option value="price">{language === "ar" ? "الترتيب حسب السعر" : "Sort by price"}</option>
                  <option value="newest">{language === "ar" ? "الأحدث أولاً" : "Sort by newest"}</option>
                </select>
              </div>

              <div className="row product-grid g-4">
                {filteredDesigns.map((design) => (
                  <DesignCard design={design} language={language} key={design.id} />
                ))}
                {!filteredDesigns.length ? (
                  <div className="col-12">
                    <div className="projects-aside__block">
                      <h3>{language === "ar" ? "لا توجد تصاميم مطابقة" : "No matching designs"}</h3>
                      <p>
                        {language === "ar"
                          ? "جرّب مسح البحث أو اختيار تصنيف آخر لعرض التصاميم المنشورة."
                          : "Clear the search or choose another filter to view published designs."}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <aside className="col-lg-3 sidebar">
              <div className="widget-search-bar mb-5">
                <form
                  className="d-flex align-items-center justify-content-between"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <input
                    className="search-field w-100"
                    type="search"
                    placeholder={language === "ar" ? "بحث" : "Search"}
                    aria-label={language === "ar" ? "بحث في التصاميم" : "Search designs"}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <button className="search-submit" type="submit" aria-label={language === "ar" ? "بحث" : "Search"} />
                </form>
              </div>

              <SidebarGroup
                title={language === "ar" ? "التصنيفات" : "Categories"}
                items={categories}
                activeFilter={activeFilter}
                language={language}
                onFilter={setActiveFilter}
              />
              <SidebarGroup
                title={language === "ar" ? "الأنماط" : "Styles"}
                items={styles}
                activeFilter={activeFilter}
                language={language}
                onFilter={setActiveFilter}
              />
              <SidebarGroup
                title={language === "ar" ? "الخدمات" : "Services"}
                items={services}
                activeFilter={activeFilter}
                language={language}
                onFilter={setActiveFilter}
              />
              <SidebarGroup
                title={language === "ar" ? "الأسعار" : "Pricing"}
                items={pricing}
                activeFilter={activeFilter}
                language={language}
                onFilter={setActiveFilter}
              />
            </aside>
          </div>
        </div>
      </main>

      <NewsletterSection />
    </>
  );
}
