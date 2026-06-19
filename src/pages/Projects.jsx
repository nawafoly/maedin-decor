import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LegacyPage from "../components/LegacyPage";
import NewsletterSection from "../components/NewsletterSection";
import { useLanguage } from "../contexts/LanguageContext";
import {
  getProjectBadgeLabel,
  getProjectDescription,
  getProjectEyebrow,
  getProjectHeroImage,
  getProjectProgressState,
  getProjectStatusLabel,
  getProjectTitle,
  isVisibleProject,
  matchesProjectFilter,
  sortPublicProjects,
  subscribePublicProjects,
} from "../lib/publicProjects";
import { routes } from "../utils/routes";

const projectFilters = [
  { key: "all", labelAr: "الكل", labelEn: "All" },
  { key: "interior", labelAr: "داخلي", labelEn: "Interior" },
  { key: "exterior", labelAr: "خارجي", labelEn: "Exterior" },
  { key: "fitout", labelAr: "تنفيذ وتشطيبات", labelEn: "Fit-out" },
  { key: "furnishing", labelAr: "تأثيث", labelEn: "Furnishing" },
  { key: "residential", labelAr: "سكني", labelEn: "Residential" },
  { key: "commercial", labelAr: "تجاري", labelEn: "Commercial" },
];

export default function Projects() {
  const { language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const unsubscribe = subscribePublicProjects(
      (items) => {
        setProjects(items);
        setLoading(false);
        setError("");
      },
      (nextError) => {
        console.error("Projects page snapshot error:", nextError);
        setError(nextError?.message || "Unable to load projects.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const visibleProjects = useMemo(() => {
    return projects.filter(isVisibleProject).sort(sortPublicProjects);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return visibleProjects.filter((project) => matchesProjectFilter(project, activeFilter));
  }, [activeFilter, visibleProjects]);

  const stats = useMemo(() => {
    const published = visibleProjects.length;
    const delivered = visibleProjects.filter((project) => getProjectProgressState(project) === "delivered").length;
    const inProgress = visibleProjects.filter((project) => getProjectProgressState(project) === "in-progress").length;

    return [
      [language === "ar" ? "المشاريع المنشورة" : "Published Projects", published],
      [language === "ar" ? "تم التسليم" : "Delivered", delivered],
      [language === "ar" ? "قيد التنفيذ" : "In Progress", inProgress],
    ];
  }, [language, visibleProjects]);

  if ((loading || error) && !projects.length) {
    return <LegacyPage page="blog" />;
  }

  return (
    <>
      <main className="page-content projects-page padding-large">
        <div className="container narrow-container">
          <section className="projects-head">
            <span className="title-accent fs-6 text-uppercase">FORMA Projects</span>
            <div className="projects-head__grid">
              <div>
                <h2>{language === "ar" ? "قصص مشاريع مبنية حول التصميم والتنفيذ والتسليم." : "Project stories shaped around design, execution, and delivery."}</h2>
                <p>
                  {language === "ar"
                    ? "استعرض أعمالًا سكنية وتجارية في التصميم الداخلي والخارجي والتنفيذ والتأثيث وإدارة المشاريع والتسليم النهائي."
                    : "Explore residential and commercial work across interiors, exteriors, fit-out, furnishing, project management, and final handover."}
                </p>
              </div>
              <div className="projects-stats">
                {stats.map(([label, value]) => (
                  <article key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </article>
                ))}
              </div>
            </div>
            <div className="projects-filter-bar">
              {projectFilters.map((filter) => (
                <button
                  type="button"
                  className={activeFilter === filter.key ? "active" : ""}
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                >
                  {language === "ar" ? filter.labelAr : filter.labelEn}
                </button>
              ))}
            </div>
          </section>

          <section className="projects-layout">
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <article className="project-card project-card--forma" key={project.id}>
                  <Link className="project-card__media" to={`${routes.projectStory}?id=${project.id}`}>
                    <img src={getProjectHeroImage(project)} alt={getProjectTitle(project, language)} />
                    <span>{getProjectBadgeLabel(project, language)}</span>
                  </Link>
                  <div className="project-card__content">
                    <p className="project-card__eyebrow">{getProjectEyebrow(project, language) || getProjectStatusLabel(project, language)}</p>
                    <h2>
                      <Link to={`${routes.projectStory}?id=${project.id}`}>{getProjectTitle(project, language)}</Link>
                    </h2>
                    <p>{getProjectDescription(project, language)}</p>
                    <div className="project-card__specs">
                      {project.area ? (
                        <span>
                          <b>{language === "ar" ? "المساحة" : "Area"}</b>
                          {project.area}
                        </span>
                      ) : null}
                      {project.duration ? (
                        <span>
                          <b>{language === "ar" ? "المدة" : "Duration"}</b>
                          {project.duration}
                        </span>
                      ) : null}
                      {project.clientType ? (
                        <span>
                          <b>{language === "ar" ? "العميل" : "Client"}</b>
                          {project.clientType}
                        </span>
                      ) : null}
                    </div>
                    <Link className="btn btn-dark" to={`${routes.projectStory}?id=${project.id}`}>
                      {language === "ar" ? "عرض المشروع" : "View project"}
                    </Link>
                  </div>
                </article>
              ))}
              {!filteredProjects.length ? (
                <article className="project-card project-card--forma">
                  <div className="project-card__content">
                    <p className="project-card__eyebrow">
                      {language === "ar" ? "لا توجد مشاريع مطابقة" : "No matching projects"}
                    </p>
                    <h2>{language === "ar" ? "جرّب فئة أخرى" : "Try another filter"}</h2>
                    <p>
                      {language === "ar"
                        ? "يمكنك فتح الكل أو اختيار تصنيف آخر لعرض المشاريع المنشورة."
                        : "Open all projects or choose another category to view published work."}
                    </p>
                    <Link className="btn btn-dark" to={routes.checkout}>
                      {language === "ar" ? "طلب استشارة" : "Book consultation"}
                    </Link>
                  </div>
                </article>
              ) : null}
            </div>

            <aside className="projects-aside">
              <div className="projects-aside__block">
                <h3>{language === "ar" ? "نطاق المشروع" : "Project Scope"}</h3>
                <p>
                  {language === "ar"
                    ? "تشمل المشاريع معارض صور، والموقع، والمساحة، والمدة، ونوع العميل، والنطاق، والمواد، ونتائج التسليم، وفيديو عند توفره."
                    : "Projects include image galleries, location, area, duration, client type, scope, materials, results, and video when available."}
                </p>
              </div>

              <div className="projects-aside__block">
                <h3>{language === "ar" ? "أحدث المشاريع" : "Recent Projects"}</h3>
                <div className="projects-mini-list">
                  {visibleProjects.slice(0, 3).map((project) => (
                    <Link to={`${routes.projectStory}?id=${project.id}`} key={project.id}>
                      <img src={getProjectHeroImage(project)} alt={getProjectTitle(project, language)} />
                      <span>{getProjectTitle(project, language)}</span>
                    </Link>
                  ))}
                  {!visibleProjects.length ? <p>{language === "ar" ? "لا توجد مشاريع منشورة بعد." : "No published projects yet."}</p> : null}
                </div>
              </div>

              <Link className="btn btn-dark w-100 text-center" to={routes.checkout}>
                {language === "ar" ? "طلب استشارة" : "Request consultation"}
              </Link>
            </aside>
          </section>
        </div>
      </main>
      <NewsletterSection />
    </>
  );
}
