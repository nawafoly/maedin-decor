import { legacyFooter, legacyHeader, legacyPages } from "../data/legacyPages.js";

const aboutPage = legacyPages.about
  .replace("<h4>Defined Scope</h4>", "<h4>Clear Project Scope</h4>")
  .replace(
    "<p>We define service scope, deliverables, materials, and timelines before work starts.</p>",
    "<p>We define the space requirements, design deliverables, materials, budget range, and timeline before work begins.</p>",
  )
  .replace("<h4>Quality Guarantee</h4>", "<h4>Quality Review</h4>")
  .replace(
    "<p>Dolor sit amet orem ipsu mcons ectetur adipi elit.</p>",
    "<p>Every design direction, finish, and execution stage is reviewed to keep the final result aligned with the approved concept.</p>",
  )
  .replace("<h4>Managed Updates</h4>", "<h4>Organized Progress</h4>")
  .replace(
    "<p>Services, projects, pricing, images, and content blocks are prepared for dashboard updates.</p>",
    "<p>Project decisions, selected materials, visual references, and stage updates are documented clearly from start to handover.</p>",
  )
  .replace("<h4>Clear Requests</h4>", "<h4>Focused Consultation</h4>")
  .replace(
    "<p>Every consultation request keeps client details, project type, budget, city, and notes.</p>",
    "<p>Each request is reviewed with the client brief, space type, city, budget range, and notes so the next step is clear.</p>",
  );

const en = {
  meta: {
    lang: "en",
    dir: "ltr",
    label: "English",
    nextLanguageLabel: "العربية",
  },
  ui: {
    home: "Home",
    request: "Request",
    viewProject: "View project",
    selectPackage: "Select this package",
    languageToggleLabel: "Switch language to Arabic",
    pageNotFoundTitle: "Page not found",
    pageNotFoundSubtitle: "The requested page could not be found.",
    backHome: "Back home",
  },
  header: legacyHeader,
  footer: legacyFooter,
  pages: {
    ...legacyPages,
    about: aboutPage,
  },
};

export default en;
