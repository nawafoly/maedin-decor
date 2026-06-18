const img = (name) => `/images/${name}`;

export const settings = {
  brand: "FORMA",
  tagline:
    "A managed platform for interior design, fit-out, furnishing, project stories, consultation requests, and operational content.",
  email: "hello@forma.studio",
  phone: "+966 55 111 2233",
  address: "Riyadh, Saudi Arabia",
};

export const slides = [
  {
    title: "Interior design with confidence.",
    text: "We turn ideas into clear layouts, visual directions, material boards, and execution-ready decisions.",
    image: img("banner-image.avif"),
    cta: "Explore services",
    href: "/services.html",
  },
  {
    title: "From concept to fit-out.",
    text: "FORMA organizes scope, suppliers, finishing stages, and quality checks so the result stays controlled.",
    image: img("banner-image1.avif"),
    cta: "View projects",
    href: "/blog.html",
  },
  {
    title: "Furnishing, materials, and detail.",
    text: "Furniture, lighting, fabrics, metals, and accessories are selected as one coherent interior story.",
    image: img("banner-image2.avif"),
    cta: "Book consultation",
    href: "/cart.html",
  },
];

export const services = [
  {
    id: "interior-design",
    title: "Full Interior Design",
    category: "Interior",
    price: "From SAR 180 / m2",
    image: img("product-item1.avif"),
    description:
      "Space planning, moodboards, materials, lighting direction, 3D visuals, and a clear delivery file.",
    details: "Ideal for villas, apartments, majlis spaces, offices, and hospitality interiors.",
    features: ["Space planning", "Moodboards", "3D visual direction", "Lighting and material palette"],
  },
  {
    id: "fit-out",
    title: "Fit-out and Finishing",
    category: "Execution",
    price: "Quoted by scope",
    image: img("product-item3.avif"),
    description:
      "Execution coordination, drawing review, supplier alignment, staged follow-up, and quality control.",
    details: "Built around approved drawings, material schedules, and milestone-based progress.",
    features: ["Drawing review", "Supplier coordination", "Quality checkpoints", "Progress documentation"],
  },
  {
    id: "furnishing",
    title: "Furnishing and Materials",
    category: "Furnishing",
    price: "From SAR 7,500",
    image: img("product-item2.avif"),
    description:
      "Furniture selection, fabrics, lighting, accessories, and material boards for a complete space.",
    details: "A practical service for clients who want to refine an existing design or complete a new one.",
    features: ["Furniture selection", "Fabric and finish palette", "Lighting accessories", "Procurement direction"],
  },
  {
    id: "project-management",
    title: "Project Management",
    category: "Management",
    price: "Monthly retainer",
    image: img("cart-img2.avif"),
    description:
      "Scope control, stage planning, deliverable tracking, decision records, and handover review.",
    details: "Focused on keeping cost, timeline, quality, and documentation visible.",
    features: ["Stage planning", "Decision records", "Budget visibility", "Handover review"],
  },
  {
    id: "exterior-design",
    title: "Exterior Design",
    category: "Exterior",
    price: "From SAR 120 / m2",
    image: img("product-item4.avif"),
    description:
      "Facade studies, entry experience, outdoor materials, lighting mood, and proportion direction.",
    details: "Useful for villas, commercial facades, and projects that need a coherent exterior identity.",
    features: ["Facade proportions", "Exterior materials", "Entry experience", "Night lighting direction"],
  },
  {
    id: "design-consultation",
    title: "Design Consultation",
    category: "Consultation",
    price: "SAR 750",
    image: img("cart-img1.avif"),
    description:
      "A focused session to review the brief, site condition, style direction, budget, and next steps.",
    details: "Designed for early decisions before committing to a full design, fit-out, or furnishing package.",
    features: ["Brief review", "Budget discussion", "Style direction", "Next-step plan"],
  },
];

export const designs = [
  {
    id: "majlis-modern",
    title: "Modern Majlis Concept",
    category: "Majlis",
    style: "Modern",
    price: "SAR 12,000",
    image: img("product-item4.avif"),
    description:
      "A calm majlis design with warm lighting, balanced seating, and refined material contrast.",
  },
  {
    id: "villa-living",
    title: "Villa Living Room",
    category: "Villa",
    style: "Luxury",
    price: "SAR 18,500",
    image: img("video-image.avif"),
    description:
      "Open-plan living concept with furniture layout, lighting scenes, and a premium material palette.",
  },
  {
    id: "kitchen-stone",
    title: "Stone Kitchen Direction",
    category: "Kitchen",
    style: "Minimal",
    price: "SAR 9,800",
    image: img("product-item5.avif"),
    description:
      "Functional kitchen direction combining stone surfaces, hidden storage, and soft task lighting.",
  },
  {
    id: "facade-bronze",
    title: "Bronze Facade Study",
    category: "Facade",
    style: "Neo Classic",
    price: "SAR 14,000",
    image: img("product-item4.avif"),
    description:
      "Exterior facade concept with proportion studies, warm metals, and nighttime lighting direction.",
  },
  {
    id: "retail-boutique",
    title: "Retail Boutique Interior",
    category: "Commercial",
    style: "Contemporary",
    price: "SAR 22,000",
    image: img("product-item5.avif"),
    description:
      "Commercial interior concept designed for product display, circulation, and brand atmosphere.",
  },
];

export const projects = [
  {
    id: "riyadh-villa",
    title: "Riyadh Private Villa",
    category: "Residential / Interior Design",
    city: "Riyadh",
    status: "Delivered",
    image: img("video-image.avif"),
    description: "Complete interior direction for reception, dining, family living, and bedrooms.",
    details:
      "The project focused on warmer material choices, clearer circulation, concealed lighting, and a delivery file that made procurement and execution easier.",
    area: "420 m2",
    duration: "14 weeks",
    clientType: "Private residential client",
    gallery: [img("video-image.avif"), img("product-item4.avif"), img("cart-img1.avif")],
    scope: ["Space planning", "Lighting direction", "Material and furniture schedule", "Execution follow-up"],
    materials: ["Natural wood", "Warm stone", "Concealed lighting", "Neutral fabrics", "Bronze metal"],
    results: "Delivered a warmer, clearer, execution-ready interior with controlled procurement decisions.",
  },
  {
    id: "executive-office",
    title: "Executive Office Suite",
    category: "Commercial / Fit-out",
    city: "Riyadh",
    status: "In Progress",
    image: img("product-item3.avif"),
    description: "A quiet work-focused interior with meeting, lounge, and private office zones.",
    details:
      "Scope includes layout review, furniture planning, finishes, lighting, and staged execution follow-up.",
    area: "185 m2",
    duration: "8 weeks",
    clientType: "Commercial client",
    gallery: [img("product-item3.avif"), img("cart-img2.avif"), img("product-item1.avif")],
    scope: ["Layout review", "Furniture planning", "Finishes and lighting", "Milestone documentation"],
    materials: ["Leather seating", "Acoustic panels", "Wood veneer", "Task lighting"],
    results: "Clearer zoning, calmer material palette, and a staged delivery file for execution.",
  },
  {
    id: "boutique-showroom",
    title: "Boutique Showroom",
    category: "Commercial",
    city: "Jeddah",
    status: "Delivered",
    image: img("product-item5.avif"),
    description:
      "Retail showroom direction built around product visibility and a premium customer route.",
    details: "The final space uses controlled lighting, soft finishes, and branded focal zones.",
    area: "260 m2",
    duration: "10 weeks",
    clientType: "Retail brand",
    gallery: [img("product-item5.avif"), img("product-item2.avif"), img("cart-img1.avif")],
    scope: ["Customer route planning", "Display wall design", "Lighting scenes", "Brand focal zones"],
    materials: ["Stone display bases", "Matte paint", "Warm metals", "Track lighting"],
    results: "A clearer retail path, better focal displays, and a premium photographed result.",
  },
  {
    id: "jeddah-facade",
    title: "Jeddah Villa Facade",
    category: "Residential / Exterior Design",
    city: "Jeddah",
    status: "Concept",
    image: img("product-item4.avif"),
    description:
      "Exterior identity study for a private villa with facade proportions, entry experience, and night lighting.",
    details:
      "FORMA developed a calmer facade language, material contrast, and lighting references that connect the outdoor approach with the interior character.",
    area: "640 m2 plot",
    duration: "5 weeks",
    clientType: "Private residential client",
    gallery: [img("product-item4.avif"), img("banner-image1.avif"), img("cart-img1.avif")],
    scope: ["Facade concept", "Exterior material palette", "Entry sequence", "Lighting direction"],
    materials: ["Light stone", "Textured plaster", "Bronze metal", "Warm exterior lighting"],
    results: "A clearer villa arrival experience with balanced proportions and a practical material direction.",
  },
];

export const pricing = [
  {
    id: "consultation",
    title: "Design Consultation",
    label: "Starting point",
    price: "SAR 650",
    duration: "60-90 minutes",
    description:
      "A focused review session for the space, goals, budget range, style direction, and the best next step.",
    includes: ["Brief review", "Style and budget direction", "Service recommendation", "Next-step summary"],
  },
  {
    id: "concept",
    title: "Concept Package",
    label: "Visual direction",
    price: "From SAR 2,900",
    duration: "5-7 working days",
    description:
      "A compact visual direction for one room or focused zone before committing to a full design file.",
    includes: ["Moodboard", "Preliminary layout direction", "Color palette", "Material references"],
  },
  {
    id: "full",
    title: "Full Project File",
    label: "Complete design file",
    price: "From SAR 9,500",
    duration: "2-4 weeks",
    description:
      "A fuller design package with clear layouts, visual direction, material choices, and execution references.",
    includes: ["Space planning", "Material and lighting direction", "Furniture references", "Handover file"],
  },
];

export const testimonials = [
  {
    quote:
      "The FORMA team made the design direction clear and helped us make material decisions without losing the mood we wanted.",
    name: "Residential Client",
  },
  {
    quote:
      "The project documentation made execution and supplier conversations much easier.",
    name: "Commercial Client",
  },
];
