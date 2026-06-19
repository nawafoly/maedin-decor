import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import LegacyPage from "../components/LegacyPage";
import NewsletterSection from "../components/NewsletterSection";
import { useLanguage } from "../contexts/LanguageContext";
import {
  getProjectArea,
  getProjectCity,
  getProjectClientType,
  getProjectDescription,
  getProjectFacets,
  getProjectEyebrow,
  getProjectGallery,
  getProjectHeroImage,
  getProjectMaterials,
  getProjectProgressState,
  getProjectScope,
  getProjectStatusLabel,
  getProjectTitle,
  isVisibleProject,
  sortPublicProjects,
  subscribePublicProjects,
} from "../lib/publicProjects";
import { routes } from "../utils/routes";

function formatProjectMeta(language, project) {
  const items = [];

  if (project.projectType || project.category) {
    items.push([language === "ar" ? "النوع" : "Type", getProjectEyebrow(project, language) || getProjectStatusLabel(project, language)]);
  }

  if (project.city || project.location) {
    items.push([language === "ar" ? "الموقع" : "Location", getProjectCity(project, language)]);
  }

  if (project.area) {
    items.push([language === "ar" ? "المساحة" : "Area", getProjectArea(project, language) || project.area]);
  }

  if (project.duration) {
    items.push([language === "ar" ? "المدة" : "Duration", project.duration]);
  }

  if (project.clientType || project.client) {
    items.push([language === "ar" ? "العميل" : "Client", getProjectClientType(project, language)]);
  }

  if (project.publishState || project.deliveryStatus || project.projectStatus || project.stage) {
    items.push([language === "ar" ? "الحالة" : "Stage", getProjectStatusLabel(project, language)]);
  }

  return items;
}

function RelatedProjectCard({ project, language }) {
  return (
    <article className="col-md-3">
      <Link to={`${routes.projectStory}?id=${project.id}`}>
        <img src={getProjectHeroImage(project)} alt={getProjectTitle(project, language)} />
        <p>{getProjectEyebrow(project, language)}</p>
        <h4>{getProjectTitle(project, language)}</h4>
      </Link>
    </article>
  );
}

function ProjectNotFound({ language }) {
  return (
    <main className="page-content single-post-page padding-large">
      <div className="container post-container">
        <p>{language === "ar" ? "المشروع غير موجود" : "Project not found"}</p>
        <h1>{language === "ar" ? "لم نتمكن من العثور على هذا المشروع." : "We could not find this project."}</h1>
        <p>
          {language === "ar"
            ? "قد يكون المشروع غير منشور أو تم حذف الرابط. جرّب العودة إلى قائمة المشاريع."
            : "The project may be hidden or the link may be incorrect. Go back to the project list."}
        </p>
        <Link className="btn btn-dark" to={routes.projects}>
          {language === "ar" ? "العودة إلى المشاريع" : "Back to projects"}
        </Link>
      </div>
    </main>
  );
}

export default function ProjectStory() {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const projectId = searchParams.get("id") || "";

  useEffect(() => {
    const unsubscribe = subscribePublicProjects(
      (items) => {
        setProjects(items);
        setLoading(false);
        setError("");
      },
      (nextError) => {
        console.error("Project story snapshot error:", nextError);
        setError(nextError?.message || "Unable to load project.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const visibleProjects = useMemo(() => {
    return projects.filter(isVisibleProject).sort(sortPublicProjects);
  }, [projects]);

  const project = useMemo(() => {
    return visibleProjects.find((item) => item.id === projectId);
  }, [projectId, visibleProjects]);

  const relatedProjects = useMemo(() => {
    if (!project) return visibleProjects.slice(0, 4);
    const currentFacets = getProjectFacets(project);

    return visibleProjects
      .filter((item) => item.id !== project.id)
      .sort((a, b) => {
        const scoreA = currentFacets.filter((facet) => getProjectFacets(a).includes(facet)).length;
        const scoreB = currentFacets.filter((facet) => getProjectFacets(b).includes(facet)).length;
        if (scoreA !== scoreB) return scoreB - scoreA;
        return sortPublicProjects(a, b);
      })
      .slice(0, 4);
  }, [language, project, visibleProjects]);

  if ((loading || error) && !projects.length) {
    return <LegacyPage page="single-post" />;
  }

  if (!projectId) {
    return <LegacyPage page="single-post" />;
  }

  if (!project) {
    return <ProjectNotFound language={language} />;
  }

  const gallery = getProjectGallery(project);
  const scope = getProjectScope(project);
  const materials = getProjectMaterials(project);
  const meta = formatProjectMeta(language, project);
  const progressState = getProjectProgressState(project);
  const heroImage = getProjectHeroImage(project);

  return (
    <>
      <main className="page-content single-post-page padding-large">
        <div className="container post-container">
          <p>{getProjectEyebrow(project, language) || getProjectStatusLabel(project, language)}</p>
          <h1>{getProjectTitle(project, language)}</h1>
          <img className="post-hero" src={heroImage} alt={getProjectTitle(project, language)} />

          {getProjectDescription(project, language) ? <p>{getProjectDescription(project, language)}</p> : null}

          {project.results ? (
            <blockquote>{project.results}</blockquote>
          ) : progressState ? (
            <blockquote>{getProjectStatusLabel(project, language)}</blockquote>
          ) : null}

          <div className="project-meta-grid my-5">
            {meta.map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>

          {scope.length || materials.length ? (
            <div className="project-detail-grid my-5">
              {scope.length ? (
                <section>
                  <h3>{language === "ar" ? "نطاق العمل" : "Project Scope"}</h3>
                  <ul>
                    {scope.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {materials.length ? (
                <section>
                  <h3>{language === "ar" ? "المواد" : "Materials"}</h3>
                  <ul>
                    {materials.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          ) : null}

          {gallery.length > 1 ? (
            <section className="project-gallery-grid my-5">
              {gallery.slice(0, 6).map((image) => (
                <img src={image} alt={getProjectTitle(project, language)} key={image} />
              ))}
            </section>
          ) : null}

          <section className="related-posts padding-large pb-0">
            <div className="display-header d-flex justify-content-between">
              <h2>{language === "ar" ? "مشاريع ذات صلة" : "Related Projects"}</h2>
              <Link className="btn" to={routes.projects}>
                {language === "ar" ? "عرض المشاريع" : "View projects"}
              </Link>
            </div>
            <div className="row g-4 mt-3">
              {relatedProjects.map((item) => (
                <RelatedProjectCard key={item.id} project={item} language={language} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <NewsletterSection />
    </>
  );
}
