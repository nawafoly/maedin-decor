(function($) {

    "use strict";

    //  Header sticky
    const headerSticky = function() {
      const header = document.querySelector('#header');
      if (!header) return;      
      const trigHeight = 1;

      window.addEventListener('scroll', function () {
          let tj = window.scrollY;

          if (tj > trigHeight) {
              header.classList.add('sticky');
          } else {
              header.classList.remove('sticky');
          }
      });
    };

    // init jarallax parallax
    var initJarallax = function() {
      jarallax(document.querySelectorAll(".jarallax"));

      jarallax(document.querySelectorAll(".jarallax-img"), {
        keepImg: true,
      });
    }

    // product quantity
    var initProductQty = function(){

      $('.product-qty').each(function(){

        var $el_product = $(this);
        var quantity = 0;

        $el_product.find('.quantity-right-plus').click(function(e){
            e.preventDefault();
            var quantity = parseInt($el_product.find('#quantity').val());
            $el_product.find('#quantity').val(quantity + 1);
        });

        $el_product.find('.quantity-left-minus').click(function(e){
            e.preventDefault();
            var quantity = parseInt($el_product.find('#quantity').val());
            if(quantity>0){
              $el_product.find('#quantity').val(quantity - 1);
            }
        });

      });

    }

    const FORMA_STORAGE_KEY = "forma.site.data.v3";
    const CANONICAL_CATALOG_URL = "services.html";
    const LEGACY_CATALOG_URL = "shop.html";
    const CANONICAL_REQUEST_URL = "cart.html";
    const LEGACY_REQUEST_URL = "checkout.html";

    const formaImages = {
      heroInterior: "images/banner-image.avif",
      heroExterior: "images/banner-image1.avif",
      heroFurnishing: "images/banner-image2.avif",
      interior: "images/product-item1.avif",
      exterior: "images/product-item4.avif",
      fitout: "images/product-item3.avif",
      furnishing: "images/product-item2.avif",
      management: "images/cart-img2.avif",
      consultation: "images/cart-img1.avif",
      villa: "images/video-image.avif",
      apartment: "images/product-item5.avif",
      office: "images/product-item3.avif",
      showroom: "images/product-item5.avif",
      materials: "images/cart-img1.avif",
      majlis: "images/product-item4.avif"
    };

    const formaDefaults = {
      settings: {
        brand: "FORMA",
        tagline: "A managed platform for interior design, fit-out, furnishing, project stories, consultation requests, and operational content.",
        email: "hello@forma.studio",
        phone: "+966 55 111 2233",
        address: "Riyadh, Saudi Arabia",
        policy: "Public catalog content is readable by visitors, while services, designs, projects, pricing, images, files, orders, customers, and content blocks are maintained from the dashboard."
      },
      slides: [
        {
          title: "Interior design with confidence.",
          text: "We turn ideas into clear layouts, visual directions, material boards, and execution-ready decisions.",
          image: formaImages.heroInterior,
          cta: "Explore services",
          href: CANONICAL_CATALOG_URL
        },
        {
          title: "From concept to fit-out.",
          text: "FORMA organizes scope, suppliers, finishing stages, and quality checks so the result stays controlled.",
          image: formaImages.heroExterior,
          cta: "View projects",
          href: "blog.html"
        },
        {
          title: "Furnishing, materials, and detail.",
          text: "Furniture, lighting, fabrics, metals, and accessories are selected as one coherent interior story.",
          image: formaImages.heroFurnishing,
          cta: "Book consultation",
          href: CANONICAL_REQUEST_URL
        }
      ],
      services: [
        {
          id: "interior-design",
          title: "Full Interior Design",
          category: "Interior",
          price: "From SAR 180 / m2",
          status: "visible",
          image: formaImages.interior,
          description: "Space planning, moodboards, materials, lighting direction, 3D visuals, and a clear delivery file.",
          details: "Ideal for villas, apartments, majlis spaces, offices, and hospitality interiors.",
          features: "Space planning\nMoodboards\n3D visual direction\nLighting and material palette",
          scope: "Concept design\nFurniture layout\nMaterial selection\nExecution-ready design file"
        },
        {
          id: "fit-out",
          title: "Fit-out and Finishing",
          category: "Execution",
          price: "Quoted by scope",
          status: "visible",
          image: formaImages.fitout,
          description: "Execution coordination, drawing review, supplier alignment, staged follow-up, and quality control.",
          details: "Built around approved drawings, material schedules, and milestone-based progress.",
          features: "Drawing review\nSupplier coordination\nQuality checkpoints\nProgress documentation",
          scope: "Fit-out planning\nFinishing supervision\nSite coordination\nHandover notes"
        },
        {
          id: "furnishing",
          title: "Furnishing and Materials",
          category: "Furnishing",
          price: "From SAR 7,500",
          status: "visible",
          image: formaImages.furnishing,
          description: "Furniture selection, fabrics, lighting, accessories, and material boards for a complete space.",
          details: "A practical service for clients who want to refine an existing design or complete a new one.",
          features: "Furniture selection\nFabric and finish palette\nLighting accessories\nProcurement direction",
          scope: "Furniture schedule\nMaterial board\nStyling direction\nFinal setup notes"
        },
        {
          id: "project-management",
          title: "Project Management",
          category: "Management",
          price: "Monthly retainer",
          status: "visible",
          image: formaImages.management,
          description: "Scope control, stage planning, deliverable tracking, decision records, and handover review.",
          details: "Focused on keeping cost, timeline, quality, and documentation visible.",
          features: "Stage planning\nDecision records\nBudget visibility\nHandover review",
          scope: "Scope control\nTimeline tracking\nTeam coordination\nQuality reporting"
        },
        {
          id: "exterior-design",
          title: "Exterior Design",
          category: "Exterior",
          price: "From SAR 120 / m2",
          status: "visible",
          image: formaImages.exterior,
          description: "Facade studies, entry experience, outdoor materials, lighting mood, and proportion direction.",
          details: "Useful for villas, commercial facades, and projects that need a coherent exterior identity.",
          features: "Facade proportions\nExterior materials\nEntry experience\nNight lighting direction",
          scope: "Exterior concept\nMaterial direction\nLighting references\nFacade notes"
        },
        {
          id: "design-consultation",
          title: "Design Consultation",
          category: "Consultation",
          price: "SAR 750",
          status: "visible",
          image: formaImages.consultation,
          description: "A focused session to review the brief, site condition, style direction, budget, and next steps.",
          details: "Designed for early decisions before committing to a full design, fit-out, or furnishing package.",
          features: "Brief review\nBudget discussion\nStyle direction\nNext-step plan",
          scope: "Consultation session\nInitial recommendations\nService matching\nProject intake notes"
        },
        {
          id: "turnkey-delivery",
          title: "Execution and Handover",
          category: "Delivery",
          price: "Quoted by scope",
          status: "visible",
          image: formaImages.materials,
          description: "Execution staging, documentation, supplier coordination, progress records, and handover review.",
          details: "Supports projects that need controlled delivery from approved concept to final photographed result.",
          features: "Execution staging\nSupplier alignment\nProgress records\nFinal handover",
          scope: "Execution plan\nProcurement coordination\nSite updates\nDelivery documentation"
        }
      ],
      designs: [
        {
          id: "majlis-modern",
          title: "Modern Majlis Concept",
          category: "Majlis",
          style: "Modern",
          price: "SAR 12,000",
          status: "visible",
          image: formaImages.majlis,
          description: "A calm majlis design with warm lighting, balanced seating, and refined material contrast."
        },
        {
          id: "villa-living",
          title: "Villa Living Room",
          category: "Villa",
          style: "Luxury",
          price: "SAR 18,500",
          status: "visible",
          image: formaImages.villa,
          description: "Open-plan living concept with furniture layout, lighting scenes, and a premium material palette."
        },
        {
          id: "kitchen-stone",
          title: "Stone Kitchen Direction",
          category: "Kitchen",
          style: "Minimal",
          price: "SAR 9,800",
          status: "visible",
          image: formaImages.apartment,
          description: "Functional kitchen direction combining stone surfaces, hidden storage, and soft task lighting."
        },
        {
          id: "facade-bronze",
          title: "Bronze Facade Study",
          category: "Facade",
          style: "Neo Classic",
          price: "SAR 14,000",
          status: "visible",
          image: formaImages.exterior,
          description: "Exterior facade concept with proportion studies, warm metals, and nighttime lighting direction."
        },
        {
          id: "retail-boutique",
          title: "Retail Boutique Interior",
          category: "Commercial",
          style: "Contemporary",
          price: "SAR 22,000",
          status: "visible",
          image: formaImages.showroom,
          description: "Commercial interior concept designed for product display, circulation, and brand atmosphere."
        }
      ],
      projects: [
        {
          id: "riyadh-villa",
          title: "Riyadh Private Villa",
          category: "Residential / Interior Design",
          city: "Riyadh",
          status: "Delivered",
          image: formaImages.villa,
          description: "Complete interior direction for reception, dining, family living, and bedrooms.",
          details: "The project focused on warmer material choices, clearer circulation, concealed lighting, and a delivery file that made procurement and execution easier.",
          area: "420 m2",
          duration: "14 weeks",
          completedAt: "2026-03-12",
          clientType: "Private residential client",
          images: `${formaImages.villa}, ${formaImages.majlis}, ${formaImages.materials}`,
          scope: "Space planning\nLighting direction\nMaterial and furniture schedule\nExecution follow-up",
          materials: "Natural wood\nWarm stone\nConcealed lighting\nNeutral fabrics\nBronze metal",
          challenges: "Unifying large open reception zones while keeping each area practical and private.",
          results: "Delivered a warmer, clearer, execution-ready interior with controlled procurement decisions.",
          videoUrl: ""
        },
        {
          id: "executive-office",
          title: "Executive Office Suite",
          category: "Commercial / Fit-out",
          city: "Riyadh",
          status: "In Progress",
          image: formaImages.office,
          description: "A quiet work-focused interior with meeting, lounge, and private office zones.",
          details: "Scope includes layout review, furniture planning, finishes, lighting, and staged execution follow-up.",
          area: "185 m2",
          duration: "8 weeks",
          completedAt: "",
          clientType: "Commercial client",
          images: `${formaImages.office}, ${formaImages.management}, ${formaImages.fitout}`,
          scope: "Layout review\nFurniture planning\nFinishes and lighting\nMilestone documentation",
          materials: "Leather seating\nAcoustic panels\nWood veneer\nTask lighting",
          challenges: "Balancing executive privacy with easy circulation for meetings and daily team use.",
          results: "Clearer zoning, calmer material palette, and a staged delivery file for execution.",
          videoUrl: ""
        },
        {
          id: "boutique-showroom",
          title: "Boutique Showroom",
          category: "Commercial",
          city: "Jeddah",
          status: "Delivered",
          image: formaImages.showroom,
          description: "Retail showroom direction built around product visibility and a premium customer route.",
          details: "The final space uses controlled lighting, soft finishes, and branded focal zones.",
          area: "260 m2",
          duration: "10 weeks",
          completedAt: "2026-01-28",
          clientType: "Retail brand",
          images: `${formaImages.showroom}, ${formaImages.furnishing}, ${formaImages.materials}`,
          scope: "Customer route planning\nDisplay wall design\nLighting scenes\nBrand focal zones",
          materials: "Stone display bases\nMatte paint\nWarm metals\nTrack lighting",
          challenges: "Keeping product displays visible without making the showroom feel crowded.",
          results: "A clearer retail path, better focal displays, and a premium photographed result.",
          videoUrl: ""
        },
        {
          id: "jeddah-facade",
          title: "Jeddah Villa Facade",
          category: "Residential / Exterior Design",
          city: "Jeddah",
          status: "Concept",
          image: formaImages.exterior,
          description: "Exterior identity study for a private villa with facade proportions, entry experience, and night lighting.",
          details: "FORMA developed a calmer facade language, material contrast, and lighting references that connect the outdoor approach with the interior character.",
          area: "640 m2 plot",
          duration: "5 weeks",
          completedAt: "",
          clientType: "Private residential client",
          images: `${formaImages.exterior}, ${formaImages.heroExterior}, ${formaImages.materials}`,
          scope: "Facade concept\nExterior material palette\nEntry sequence\nLighting direction",
          materials: "Light stone\nTextured plaster\nBronze metal\nWarm exterior lighting",
          challenges: "Creating a refined exterior identity without overloading the facade with decorative details.",
          results: "A clearer villa arrival experience with balanced proportions and a practical material direction.",
          videoUrl: ""
        },
        {
          id: "apartment-furnishing",
          title: "Apartment Furnishing Package",
          category: "Residential / Furnishing",
          city: "Khobar",
          status: "Delivered",
          image: formaImages.furnishing,
          description: "Furniture, fabrics, lighting, and styling package for a modern apartment living and dining area.",
          details: "The package refined an existing layout with furniture scale, fabric direction, accessories, and a procurement-ready material board.",
          area: "125 m2",
          duration: "6 weeks",
          completedAt: "2026-02-18",
          clientType: "Residential client",
          images: `${formaImages.furnishing}, ${formaImages.apartment}, ${formaImages.consultation}`,
          scope: "Furniture selection\nFabric palette\nLighting and accessories\nFinal styling direction",
          materials: "Neutral linen\nOak wood\nSoft stone tops\nLayered warm lighting",
          challenges: "Improving comfort and storage while keeping the apartment visually light.",
          results: "A cohesive furnished space with better seating scale, softer lighting, and clearer purchasing decisions.",
          videoUrl: ""
        }
      ],
      pricing: [
        {
          id: "consultation",
          title: "Design Consultation",
          label: "Starting point",
          price: "SAR 650",
          duration: "60-90 minutes",
          status: "visible",
          description: "A focused review session for the space, goals, budget range, style direction, and the best next step.",
          idealFor: "Before choosing the right package.",
          includes: "Brief review\nStyle and budget direction\nService recommendation\nNext-step summary"
        },
        {
          id: "concept",
          title: "Concept Package",
          label: "Visual direction",
          price: "From SAR 2,900",
          duration: "5-7 working days",
          status: "visible",
          description: "A compact visual direction for one room or focused zone before committing to a full design file.",
          idealFor: "One room or focused design zone.",
          includes: "Moodboard\nPreliminary layout direction\nColor palette\nMaterial and furniture references"
        },
        {
          id: "full",
          title: "Full Project File",
          label: "Complete design file",
          price: "From SAR 9,500",
          duration: "2-4 weeks",
          status: "visible",
          description: "A fuller design package with clear layouts, visual direction, material choices, and execution references.",
          idealFor: "A project ready for a full design file.",
          includes: "Space planning\nMaterial and lighting direction\nFurniture and finish references\nExecution notes and handover file"
        }
      ],
      contentBlocks: [
        { id: "home-intro", key: "home-intro", title: "Design and execution managed from one place", status: "visible", page: "Home", description: "FORMA presents services, designs, project stories, pricing, and consultation requests through a public site while the dashboard controls every editable item." },
        { id: "policy", key: "policy", title: "Operating policy", status: "visible", page: "About", description: "Public visitors can browse the catalog and request consultation. Admin users manage content, images, prices, customer requests, and visibility states." },
        { id: "consultation-note", key: "consultation-note", title: "Consultation review", status: "visible", page: "Consultation", description: "Appointments are reviewed by service type, location, space size, timeline, and available delivery slots." }
      ],
      orders: [
        { id: "request-1001", title: "Villa consultation request", name: "Sample Client", email: "client@example.com", phone: "+966 55 000 0000", projectType: "Villa", area: "420 m2", city: "Riyadh", service: "Full Interior Design", budget: "Custom quote", status: "new", fileName: "", image: "", description: "Private villa brief with reception, living, and bedroom scope." }
      ],
      customers: [
        { id: "sample-client", title: "Sample Client", email: "client@example.com", phone: "+966 55 000 0000", city: "Riyadh", status: "active", description: "Residential client interested in staged interior design and execution follow-up." }
      ],
      files: [
        { id: "material-board", title: "Material board reference", category: "Design File", status: "visible", image: formaImages.materials, url: formaImages.materials, description: "Admin-managed reference file for materials or project documentation." }
      ]
    };

    function cloneData(data) {
      return JSON.parse(JSON.stringify(data));
    }

    const legacyPricingDefaults = {
      consultation: {
        price: "SAR 750",
        description: "One focused session to review space, goals, style, and next steps."
      },
      concept: {
        price: "SAR 4,500",
        description: "Moodboard, layout direction, color palette, and material references."
      },
      full: {
        price: "Custom quote",
        description: "Design package, execution references, and project coordination scope."
      }
    };

    function mergePricingDefaults(savedPricing) {
      const savedItems = Array.isArray(savedPricing) ? savedPricing : [];
      const usedIds = new Set();
      const mergedItems = formaDefaults.pricing.map(function(defaultItem) {
        const savedItem = savedItems.find(function(item) {
          return item && item.id === defaultItem.id;
        });
        if (!savedItem) return cloneData(defaultItem);
        usedIds.add(savedItem.id);
        const item = Object.assign({}, defaultItem, savedItem);
        const legacy = legacyPricingDefaults[savedItem.id];
        if (legacy && savedItem.price === legacy.price) item.price = defaultItem.price;
        if (legacy && savedItem.description === legacy.description) item.description = defaultItem.description;
        ["label", "duration", "idealFor", "includes"].forEach(function(field) {
          if (!savedItem[field]) item[field] = defaultItem[field];
        });
        return item;
      });
      return mergedItems.concat(savedItems.filter(function(item) {
        return item && !usedIds.has(item.id);
      }));
    }

    function getFormaData() {
      try {
        const saved = JSON.parse(window.FormaStoreAdapter.read(FORMA_STORAGE_KEY) || "null");
        if (saved && saved.settings) {
          const data = Object.assign(cloneData(formaDefaults), saved);
          data.pricing = mergePricingDefaults(saved.pricing);
          return data;
        }
      } catch (error) {
        console.warn("Unable to read FORMA data", error);
      }
      window.FormaStoreAdapter.write(FORMA_STORAGE_KEY, JSON.stringify(formaDefaults));
      return cloneData(formaDefaults);
    }

    function saveFormaData(data) {
      window.FormaStoreAdapter.write(FORMA_STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent("forma:data-updated", { detail: data }));
    }

    window.FormaStoreAdapter = window.FormaStoreAdapter || {
      name: "localStorage",
      read: function(key) {
        return localStorage.getItem(key);
      },
      write: function(key, value) {
        localStorage.setItem(key, value);
      }
    };

    window.FormaStore = {
      key: FORMA_STORAGE_KEY,
      adapter: window.FormaStoreAdapter.name,
      defaults: formaDefaults,
      get: getFormaData,
      save: saveFormaData,
      reset: function() {
        saveFormaData(cloneData(formaDefaults));
      }
    };

    const FORMA_LANGUAGE_KEY = "forma.language";

    const translations = {
      en: {
        siteTitle: "FORMA - Interior Design and Fit-out",
        aboutTitle: "About - FORMA",
        servicesTitle: "Services - FORMA",
        designsTitle: "Designs - FORMA",
        serviceDetailsTitle: "Service Details - FORMA",
        projectsTitle: "Projects - FORMA",
        projectStoryTitle: "Project Story - FORMA",
        requestTitle: "Project Request - FORMA",
        consultationTitle: "Book Consultation - FORMA",
        accountTitle: "Account and Admin - FORMA",
        contactTitle: "Contact - FORMA",
        home: "Home",
        about: "About",
        services: "Services",
        designs: "Designs",
        serviceDetails: "Service Details",
        projects: "Projects",
        projectStory: "Project Story",
        contact: "Contact",
        admin: "Admin",
        request: "Request",
        requestNow: "Request",
        consultation: "Consultation",
        explore: "Explore",
        searchPlaceholder: "Search designs, projects, services...",
        searchDesigns: "Search designs and services",
        projectBrief: "Project Brief",
        prepareRequest: "Prepare request",
        bookConsultation: "Book consultation",
        newsletterTitle: "Stay Updated With<br>FORMA",
        newsletterText: "Receive design updates, project notes, and material direction from our studio.",
        emailPlaceholder: "Your email address",
        subscribe: "Subscribe",
        quickLinks: "Quick Links",
        contactInfo: "Contact Info",
        studioUpdates: "Studio Updates",
        copyright: "&copy; Copyright 2026 FORMA. Programmed by <b>Nawaf Ahmed Al-Olayan</b>",
        breadcrumbHome: "Home",
        homeAboutEyebrow: "About FORMA",
        homeAboutTitle: "A design and execution platform for interiors, facades, furnishing, and project direction.",
        homeAboutText: "FORMA presents design options clearly, organizes project scope, documents materials and decisions, and keeps the client able to review services, projects, pricing, and updates from one place.",
        coreServices: "Best Selling Items",
        viewAllServices: "View All Services",
        howWorks: "How FORMA Works",
        discover: "Discover",
        decide: "Decide",
        deliver: "Deliver",
        operationalPolicy: "Operational Policy",
        bookNow: "Book now",
        interiorDesign: "Interior Design",
        executedProjects: "Executed Projects",
        categories: "Categories",
        styles: "Styles",
        pricing: "Pricing",
        serviceCategories: "Service Categories",
        designCatalog: "Design Catalog",
        showingDesigns: "Showing managed visible designs from the FORMA dashboard",
        showingServices: "Showing managed visible services from the FORMA dashboard",
        defaultOrder: "Default order",
        sortCategory: "Sort by category",
        sortPrice: "Sort by price",
        publishedProjects: "Published Projects",
        delivered: "Delivered",
        inProgress: "In Progress",
        projectScope: "Project Scope",
        latestWork: "Latest Work",
        requestConsultation: "Request consultation",
        viewProject: "View project",
        area: "Area",
        duration: "Duration",
        client: "Client",
        byScope: "By scope",
        phased: "Phased",
        privateClient: "Private client",
        projectType: "Project Type",
        cityLocation: "City / Location",
        completion: "Completion",
        accordingSchedule: "According to schedule",
        projectGallery: "Project Gallery",
        scopeOfWork: "Scope of Work",
        materialsUsed: "Materials Used",
        challengesSolutions: "Challenges and Solutions",
        deliveryResults: "Delivery Results",
        startWithForma: "Start with FORMA",
        needSimilar: "Need a similar design, fit-out, furnishing, or project direction?",
        backProjects: "Back to projects",
        backDesigns: "Back to designs",
        serviceFeatures: "Service Features",
        howManaged: "How It Is Managed",
        contactForma: "Contact FORMA",
        contactLead: "Tell us about the space, timeline, budget range, and the service you need.",
        studio: "Studio",
        sendBrief: "Send brief",
        consultationDirection: "Consultation and Project Direction",
        availablePackages: "Available Packages",
        packagesIntro: "Choose the closest starting point. Final scope can still be adjusted after the studio reviews your brief.",
        packageBestFor: "Best for",
        packageIncludes: "Includes",
        packageDuration: "Timeline",
        choosePackage: "Select this package",
        sendProjectBrief: "Send Project Brief",
        name: "Name",
        email: "Email",
        phone: "Mobile number",
        projectArea: "Project area",
        city: "City",
        requiredService: "Required service",
        budgetRange: "Budget range",
        projectDetails: "Project details",
        attachFile: "Attach file or image",
        submitRequest: "Submit request",
        accountAdmin: "Account and Admin",
        adminAccess: "Admin Access",
        clientAccount: "Client Account",
        password: "Password",
        login: "Login",
        openDashboard: "Open dashboard",
        createClientAccount: "Create client account",
        rememberMe: "Remember me",
        forgotPassword: "Forgot password",
        languageLabel: "AR / EN",
        switchLanguage: "Switch language",
        requestSaved: "Your request was saved. The studio team can review it from the dashboard."
      },
      ar: {
        siteTitle: "فورما - التصميم الداخلي والتنفيذ",
        aboutTitle: "من نحن - فورما",
        servicesTitle: "الخدمات - فورما",
        designsTitle: "التصاميم - فورما",
        serviceDetailsTitle: "تفاصيل الخدمة - فورما",
        projectsTitle: "المشاريع - فورما",
        projectStoryTitle: "قصة المشروع - فورما",
        requestTitle: "طلب مشروع - فورما",
        consultationTitle: "حجز استشارة - فورما",
        accountTitle: "الحساب والإدارة - فورما",
        contactTitle: "تواصل معنا - فورما",
        home: "الرئيسية",
        about: "من نحن",
        services: "الخدمات",
        designs: "التصاميم",
        serviceDetails: "تفاصيل الخدمة",
        projects: "المشاريع",
        projectStory: "قصة المشروع",
        contact: "تواصل معنا",
        admin: "الإدارة",
        request: "طلب",
        requestNow: "اطلب الآن",
        consultation: "استشارة",
        explore: "استكشف",
        searchPlaceholder: "ابحث عن التصاميم أو المشاريع أو الخدمات...",
        searchDesigns: "ابحث في التصاميم والخدمات",
        projectBrief: "ملخص المشروع",
        prepareRequest: "جهّز الطلب",
        bookConsultation: "احجز استشارة",
        newsletterTitle: "ابقَ قريبًا من<br>فورما",
        newsletterText: "تصلك تحديثات التصميم، ملاحظات المشاريع، واتجاهات الخامات من الاستوديو.",
        emailPlaceholder: "بريدك الإلكتروني",
        subscribe: "اشترك",
        quickLinks: "روابط سريعة",
        contactInfo: "بيانات التواصل",
        studioUpdates: "تحديثات الاستوديو",
        copyright: "&copy; حقوق النشر 2026 فورما. البرمجة بواسطة <b>نواف أحمد العليان</b>",
        breadcrumbHome: "الرئيسية",
        homeAboutEyebrow: "عن فورما",
        homeAboutTitle: "منصة تصميم وتنفيذ للمساحات الداخلية والواجهات والتأثيث وإدارة المشاريع.",
        homeAboutText: "تقدّم فورما خيارات التصميم بوضوح، وتنظّم نطاق المشروع والخامات والقرارات، ليتمكن العميل من مراجعة الخدمات والمشاريع والأسعار والتحديثات من مكان واحد.",
        coreServices: "أبرز الخدمات",
        viewAllServices: "عرض كل الخدمات",
        howWorks: "كيف تعمل فورما",
        discover: "نكتشف",
        decide: "نقرر",
        deliver: "نسلّم",
        operationalPolicy: "السياسة التشغيلية",
        bookNow: "احجز الآن",
        interiorDesign: "تصميم داخلي",
        executedProjects: "مشاريع منفذة",
        categories: "التصنيفات",
        styles: "الأنماط",
        pricing: "الأسعار",
        serviceCategories: "تصنيفات الخدمات",
        designCatalog: "كتالوج التصاميم",
        showingDesigns: "عرض التصاميم الظاهرة والمدارة من لوحة فورما",
        showingServices: "عرض الخدمات الظاهرة والمدارة من لوحة فورما",
        defaultOrder: "الترتيب الافتراضي",
        sortCategory: "الترتيب حسب التصنيف",
        sortPrice: "الترتيب حسب السعر",
        publishedProjects: "مشاريع منشورة",
        delivered: "تم التسليم",
        inProgress: "قيد التنفيذ",
        projectScope: "نطاق المشروع",
        latestWork: "أحدث الأعمال",
        requestConsultation: "اطلب استشارة",
        viewProject: "عرض المشروع",
        area: "المساحة",
        duration: "المدة",
        client: "العميل",
        byScope: "حسب النطاق",
        phased: "على مراحل",
        privateClient: "عميل خاص",
        projectType: "نوع المشروع",
        cityLocation: "المدينة / الموقع",
        completion: "تاريخ التسليم",
        accordingSchedule: "حسب الجدول",
        projectGallery: "معرض المشروع",
        scopeOfWork: "نطاق العمل",
        materialsUsed: "الخامات المستخدمة",
        challengesSolutions: "التحديات والحلول",
        deliveryResults: "نتائج التسليم",
        startWithForma: "ابدأ مع فورما",
        needSimilar: "تحتاج تصميمًا أو تنفيذًا أو تأثيثًا أو إدارة مشروع مشابه؟",
        backProjects: "العودة للمشاريع",
        backDesigns: "العودة للتصاميم",
        serviceFeatures: "مميزات الخدمة",
        howManaged: "كيف تُدار",
        contactForma: "تواصل مع فورما",
        contactLead: "أخبرنا عن المساحة، الجدول الزمني، نطاق الميزانية، والخدمة التي تحتاجها.",
        studio: "الاستوديو",
        sendBrief: "إرسال الملخص",
        consultationDirection: "الاستشارات وتوجيه المشاريع",
        availablePackages: "الباقات المتاحة",
        packagesIntro: "اختر نقطة البداية الأقرب لاحتياجك، ويمكن تعديل النطاق النهائي بعد مراجعة فريق الاستوديو للملخص.",
        packageBestFor: "مناسب لـ",
        packageIncludes: "تشمل الباقة",
        packageDuration: "المدة",
        choosePackage: "اختيار الباقة",
        sendProjectBrief: "إرسال ملخص المشروع",
        name: "الاسم",
        email: "البريد الإلكتروني",
        phone: "رقم الجوال",
        projectArea: "مساحة المشروع",
        city: "المدينة",
        requiredService: "الخدمة المطلوبة",
        budgetRange: "نطاق الميزانية",
        projectDetails: "تفاصيل المشروع",
        attachFile: "إرفاق ملف أو صورة",
        submitRequest: "إرسال الطلب",
        accountAdmin: "الحساب والإدارة",
        adminAccess: "دخول الإدارة",
        clientAccount: "حساب العميل",
        password: "كلمة المرور",
        login: "تسجيل الدخول",
        openDashboard: "فتح لوحة الإدارة",
        createClientAccount: "إنشاء حساب عميل",
        rememberMe: "تذكرني",
        forgotPassword: "نسيت كلمة المرور",
        languageLabel: "AR / EN",
        switchLanguage: "تغيير اللغة",
        requestSaved: "تم حفظ طلبك، ويمكن لفريق الاستوديو مراجعته من لوحة الإدارة."
      }
    };

    const extraTranslations = {
      en: {
        adminDashboardTitle: "Dashboard - FORMA",
        search: "Search",
        all: "All",
        projectStoriesEyebrow: "مشاريع فورما",
        projectsIntroTitle: "Project stories shaped around design, execution, and delivery.",
        projectsIntroText: "Explore residential and commercial work across interiors, exteriors, fit-out, furnishing, project management, and final handover.",
        projectScopeText: "Each project can include a main image, gallery, city, area, duration, client type, materials, scope, challenges, results, and video from the dashboard.",
        singleServiceManaged: "Managed from the FORMA dashboard with image, category, price, description, and visibility controls.",
        customQuote: "Custom quote",
        clearScope: "Clear scope",
        visualDirection: "Visual direction",
        managedContent: "Managed image and content",
        visibilityControl: "Dashboard visibility control",
        briefReview: "Brief review",
        designDirection: "Design direction",
        materialReferences: "Material references",
        deliveryNotes: "Delivery notes",
        dashboardControls: "The dashboard controls the title, category, price, image, details, status, and public visibility.",
        imageControls: "Images can be saved as URLs or temporary uploaded Base64 previews in localStorage.",
        formaProject: "FORMA Project",
        visible: "Visible",
        projectTypeLabel: "Project Type",
        cityLocationLabel: "City / Location",
        startWithFormaText: "This project is controlled from the dashboard: title, category, city, image, gallery, status, area, duration, client type, materials, scope, results, video, summary, details, and visibility.",
        bookConsultationTitle: "Book Consultation",
        consultationCrumb: "Consultation",
        projectRequest: "Project Request",
        yourName: "Your name",
        yourEmail: "Your email",
        mobileNumber: "Mobile number",
        approxArea: "Approximate area in m2",
        projectCity: "Project city",
        budgetPlaceholder: "Budget range or custom quote",
        detailsPlaceholder: "Space type, location, size, timeline, and expected scope",
        villa: "Villa",
        apartment: "Apartment",
        majlis: "Majlis",
        office: "Office",
        commercial: "Commercial",
        facade: "Facade",
        emailAddressRequired: "Email address *",
        clientEmailRequired: "Client email *",
        nameRequired: "Name *",
        emailRequired: "Email *",
        phoneRequired: "Mobile number *"
      },
      ar: {
        adminDashboardTitle: "لوحة الإدارة - فورما",
        search: "بحث",
        all: "الكل",
        projectStoriesEyebrow: "مشاريع فورما",
        projectsIntroTitle: "قصص مشاريع تتشكل حول التصميم والتنفيذ والتسليم.",
        projectsIntroText: "استكشف أعمالاً سكنية وتجارية في التصميم الداخلي والخارجي، التنفيذ، التأثيث، إدارة المشاريع، والتسليم النهائي.",
        projectScopeText: "يمكن لكل مشروع أن يحتوي على صورة رئيسية، معرض صور، مدينة، مساحة، مدة، نوع العميل، خامات، نطاق عمل، تحديات، نتائج، وفيديو من لوحة الإدارة.",
        singleServiceManaged: "يُدار هذا العنصر من لوحة فورما مع التحكم بالصورة والتصنيف والسعر والوصف وحالة الظهور.",
        customQuote: "تسعير خاص",
        clearScope: "نطاق واضح",
        visualDirection: "اتجاه بصري",
        managedContent: "صور ومحتوى قابل للإدارة",
        visibilityControl: "تحكم بحالة الظهور",
        briefReview: "مراجعة الملخص",
        designDirection: "توجيه التصميم",
        materialReferences: "مراجع الخامات",
        deliveryNotes: "ملاحظات التسليم",
        dashboardControls: "تتحكم لوحة الإدارة في العنوان والتصنيف والسعر والصورة والتفاصيل والحالة والظهور العام.",
        imageControls: "يمكن حفظ الصور كرابط مباشر أو كصور Base64 مؤقتة داخل localStorage.",
        formaProject: "مشروع فورما",
        visible: "ظاهر",
        projectTypeLabel: "نوع المشروع",
        cityLocationLabel: "المدينة / الموقع",
        startWithFormaText: "هذا المشروع قابل للإدارة من لوحة التحكم: العنوان، التصنيف، المدينة، الصورة، المعرض، الحالة، المساحة، المدة، نوع العميل، الخامات، النطاق، النتائج، الفيديو، الملخص، التفاصيل، والظهور.",
        bookConsultationTitle: "حجز استشارة",
        consultationCrumb: "استشارة",
        projectRequest: "طلب مشروع",
        yourName: "اسمك",
        yourEmail: "بريدك الإلكتروني",
        mobileNumber: "رقم الجوال",
        approxArea: "المساحة التقريبية بالمتر",
        projectCity: "مدينة المشروع",
        budgetPlaceholder: "نطاق الميزانية أو تسعير خاص",
        detailsPlaceholder: "نوع المساحة، الموقع، المساحة، الجدول الزمني، والنطاق المتوقع",
        villa: "فيلا",
        apartment: "شقة",
        majlis: "مجلس",
        office: "مكتب",
        commercial: "تجاري",
        facade: "واجهة",
        emailAddressRequired: "البريد الإلكتروني *",
        clientEmailRequired: "بريد العميل *",
        nameRequired: "الاسم *",
        emailRequired: "البريد الإلكتروني *",
        phoneRequired: "رقم الجوال *"
      }
    };

    const localizedDefaults = {
      ar: {
        settings: {
          tagline: "منصة إدارة وعرض للتصميم الداخلي والخارجي، التنفيذ، التأثيث، قصص المشاريع، طلبات الاستشارة، والمحتوى التشغيلي.",
          policy: "محتوى الكتالوج متاح للزوار، بينما تُدار الخدمات والتصاميم والمشاريع والأسعار والصور والملفات والطلبات والعملاء وكتل المحتوى من لوحة الإدارة."
        },
        slides: [
          { title: "تصاميم داخلية بثقة وأناقة.", text: "نحوّل الفكرة إلى مخططات واضحة، اتجاه بصري متوازن، لوحات خامات، وقرارات جاهزة للتنفيذ.", cta: "استكشف الخدمات" },
          { title: "من التصور إلى التنفيذ.", text: "تنظّم فورما نطاق العمل والموردين ومراحل التشطيب ومراجعة الجودة حتى تبقى النتيجة تحت السيطرة.", cta: "عرض المشاريع" },
          { title: "تأثيث وخامات بتفاصيل هادئة.", text: "الأثاث والإضاءة والأقمشة والمعادن والإكسسوارات تُختار كقصة داخلية واحدة متكاملة.", cta: "احجز استشارة" }
        ],
        services: {
          "interior-design": { title: "تصميم داخلي متكامل", category: "داخلي", price: "ابتداءً من 180 ر.س / م2", description: "تخطيط المساحات، لوحات المزاج، الخامات، الإضاءة، التصور ثلاثي الأبعاد، وملف تسليم واضح.", details: "مناسب للفلل والشقق والمجالس والمكاتب والمساحات الفندقية.", features: "تخطيط المساحة\nلوحات مزاج\nاتجاه بصري ثلاثي الأبعاد\nلوحة إضاءة وخامات", scope: "تصميم مفهومي\nتوزيع الأثاث\nاختيار الخامات\nملف جاهز للتنفيذ" },
          "fit-out": { title: "التنفيذ والتشطيبات", category: "تنفيذ", price: "تسعير حسب النطاق", description: "تنسيق التنفيذ، مراجعة المخططات، مواءمة الموردين، متابعة المراحل، وضبط الجودة.", details: "يعتمد على مخططات معتمدة وجداول خامات ومتابعة حسب مراحل واضحة.", features: "مراجعة المخططات\nتنسيق الموردين\nنقاط فحص الجودة\nتوثيق التقدم", scope: "تخطيط التنفيذ\nإشراف التشطيبات\nتنسيق الموقع\nملاحظات التسليم" },
          "furnishing": { title: "التأثيث والخامات", category: "تأثيث", price: "ابتداءً من 7,500 ر.س", description: "اختيار الأثاث والأقمشة والإضاءة والإكسسوارات ولوحات الخامات لمساحة مكتملة.", details: "خدمة عملية لمن يريد تحسين تصميم قائم أو إكمال مساحة جديدة.", features: "اختيار الأثاث\nلوحة أقمشة وتشطيبات\nإضاءة وإكسسوارات\nتوجيه الشراء", scope: "جدول أثاث\nلوحة خامات\nاتجاه تنسيق\nملاحظات الإعداد النهائي" },
          "project-management": { title: "إدارة المشاريع", category: "إدارة", price: "اشتراك شهري", description: "ضبط النطاق، تخطيط المراحل، متابعة المخرجات، توثيق القرارات، ومراجعة التسليم.", details: "تركّز على وضوح التكلفة والوقت والجودة والتوثيق.", features: "تخطيط المراحل\nتوثيق القرارات\nوضوح الميزانية\nمراجعة التسليم", scope: "ضبط النطاق\nمتابعة الجدول\nتنسيق الفريق\nتقارير الجودة" },
          "exterior-design": { title: "تصميم خارجي", category: "خارجي", price: "ابتداءً من 120 ر.س / م2", description: "دراسات واجهات، تجربة الدخول، خامات خارجية، مزاج إضاءة، وتوجيه للنِسب.", details: "مناسب للفلل والواجهات التجارية والمشاريع التي تحتاج هوية خارجية متماسكة.", features: "نِسب الواجهة\nخامات خارجية\nتجربة الدخول\nاتجاه إضاءة ليلية", scope: "تصور خارجي\nتوجيه خامات\nمراجع إضاءة\nملاحظات واجهة" },
          "design-consultation": { title: "استشارة تصميم", category: "استشارة", price: "750 ر.س", description: "جلسة مركزة لمراجعة الملخص وحالة الموقع واتجاه الستايل والميزانية والخطوة التالية.", details: "مناسبة للقرارات المبكرة قبل بدء تصميم كامل أو تنفيذ أو تأثيث.", features: "مراجعة الملخص\nنقاش الميزانية\nتوجيه الستايل\nخطة خطوة تالية", scope: "جلسة استشارية\nتوصيات أولية\nمطابقة الخدمة\nملاحظات استقبال المشروع" },
          "turnkey-delivery": { title: "التنفيذ والتسليم", category: "تسليم", price: "تسعير حسب النطاق", description: "تنظيم مراحل التنفيذ، التوثيق، تنسيق الموردين، سجلات التقدم، ومراجعة التسليم.", details: "يدعم المشاريع التي تحتاج تسليماً مضبوطاً من التصور المعتمد إلى النتيجة النهائية.", features: "مراحل تنفيذ\nتنسيق موردين\nسجلات تقدم\nتسليم نهائي", scope: "خطة تنفيذ\nتنسيق شراء\nتحديثات موقع\nتوثيق التسليم" }
        },
        designs: {
          "majlis-modern": { title: "تصور مجلس عصري", category: "مجلس", style: "عصري", price: "12,000 ر.س", description: "تصميم مجلس هادئ بإضاءة دافئة، جلسات متوازنة، وتباين خامات راقٍ." },
          "villa-living": { title: "صالة فيلا فاخرة", category: "فيلا", style: "فاخر", price: "18,500 ر.س", description: "تصور صالة مفتوحة بتوزيع أثاث واضح، مشاهد إضاءة، ولوحة خامات راقية." },
          "kitchen-stone": { title: "اتجاه مطبخ حجري", category: "مطبخ", style: "هادئ", price: "9,800 ر.س", description: "اتجاه عملي للمطبخ يجمع الأسطح الحجرية والتخزين المخفي وإضاءة العمل الهادئة." },
          "facade-bronze": { title: "دراسة واجهة برونزية", category: "واجهة", style: "نيو كلاسيك", price: "14,000 ر.س", description: "تصور واجهة خارجية بدراسة نسب، معادن دافئة، واتجاه إضاءة ليلية." },
          "retail-boutique": { title: "تصميم بوتيك تجاري", category: "تجاري", style: "معاصر", price: "22,000 ر.س", description: "تصميم داخلي تجاري يوازن بين عرض المنتجات، حركة العميل، وأجواء العلامة." }
        },
        projects: {
          "riyadh-villa": { title: "فيلا خاصة في الرياض", category: "سكني / تصميم داخلي", city: "الرياض", status: "تم التسليم", description: "اتجاه داخلي متكامل للاستقبال والطعام والمعيشة العائلية وغرف النوم.", details: "ركز المشروع على خامات أكثر دفئًا، حركة أوضح، إضاءة مخفية، وملف تسليم سهّل الشراء والتنفيذ.", clientType: "عميل سكني خاص", scope: "تخطيط المساحة\nاتجاه الإضاءة\nجدول خامات وأثاث\nمتابعة التنفيذ", materials: "خشب طبيعي\nحجر دافئ\nإضاءة مخفية\nأقمشة محايدة\nمعدن برونزي", challenges: "توحيد مناطق استقبال واسعة مع الحفاظ على عملية وخصوصية كل منطقة.", results: "تسليم داخلية أكثر دفئًا ووضوحًا وجاهزية للتنفيذ مع قرارات شراء مضبوطة." },
          "executive-office": { title: "جناح مكتب تنفيذي", category: "تجاري / تنفيذ", city: "الرياض", status: "قيد التنفيذ", description: "داخلية عملية وهادئة بمناطق اجتماع واستراحة ومكتب خاص.", details: "يشمل النطاق مراجعة المخطط، تخطيط الأثاث، التشطيبات، الإضاءة، ومتابعة التنفيذ المرحلية.", clientType: "عميل تجاري", scope: "مراجعة المخطط\nتخطيط الأثاث\nتشطيبات وإضاءة\nتوثيق المراحل", materials: "جلد\nألواح صوتية\nقشرة خشب\nإضاءة عمل", challenges: "تحقيق خصوصية تنفيذية مع سهولة حركة للاجتماعات والاستخدام اليومي.", results: "تقسيم أوضح، لوحة خامات أهدأ، وملف تسليم مرحلي للتنفيذ." },
          "boutique-showroom": { title: "معرض بوتيك", category: "تجاري", city: "جدة", status: "تم التسليم", description: "اتجاه معرض تجاري مبني حول وضوح عرض المنتجات ومسار عميل راقٍ.", details: "المساحة النهائية تستخدم إضاءة مضبوطة، تشطيبات هادئة، ونقاط تركيز مرتبطة بالعلامة.", clientType: "علامة تجارية", scope: "تخطيط مسار العميل\nتصميم جدار العرض\nمشاهد إضاءة\nنقاط تركيز للعلامة", materials: "قواعد عرض حجرية\nدهان مطفي\nمعادن دافئة\nإضاءة مسارية", challenges: "إظهار المنتجات بوضوح دون جعل المعرض مزدحمًا بصريًا.", results: "مسار تجاري أوضح، نقاط عرض أفضل، ونتيجة نهائية قابلة للتصوير." }
        },
        pricing: {
          consultation: {
            title: "استشارة تصميم",
            label: "نقطة البداية",
            price: "650 ر.س",
            duration: "60-90 دقيقة",
            description: "جلسة مركزة لفهم المساحة، الهدف، الميزانية، الستايل المناسب، وتحديد أفضل خطوة تالية.",
            idealFor: "قبل اختيار الباقة المناسبة.",
            includes: "مراجعة الملخص\nتوجيه الستايل والميزانية\nاقتراح الخدمة المناسبة\nملخص خطوات تالية"
          },
          concept: {
            title: "باقة التصور",
            label: "اتجاه بصري أولي",
            price: "ابتداءً من 2,900 ر.س",
            duration: "5-7 أيام عمل",
            description: "تصور بصري مختصر لمساحة واحدة يوضح المزاج، الألوان، التوزيع المبدئي، والخامات قبل الدخول في تصميم كامل.",
            idealFor: "مساحة واحدة تحتاج اتجاهًا واضحًا.",
            includes: "لوحة مزاج\nاتجاه توزيع مبدئي\nلوحة ألوان\nمراجع خامات وأثاث"
          },
          full: {
            title: "ملف مشروع كامل",
            label: "ملف تصميم متكامل",
            price: "ابتداءً من 9,500 ر.س",
            duration: "2-4 أسابيع",
            description: "باقة تصميم أوسع تشمل توزيع المساحات، الاتجاه البصري، الخامات، الإضاءة، ومراجع تساعد على التنفيذ.",
            idealFor: "مشروع جاهز لملف تصميم كامل.",
            includes: "تخطيط المساحة\nتوجيه الخامات والإضاءة\nمراجع الأثاث والتشطيبات\nملاحظات تنفيذ وملف تسليم"
          }
        },
        contentBlocks: {
          "home-intro": { title: "التصميم والتنفيذ من مكان واحد", description: "تعرض فورما الخدمات والتصاميم وقصص المشاريع والأسعار وطلبات الاستشارة عبر موقع عام، بينما تتحكم لوحة الإدارة في كل عنصر قابل للتعديل." },
          policy: { title: "السياسة التشغيلية", description: "يمكن للزوار تصفح الكتالوج وطلب الاستشارة، بينما يدير فريق الإدارة المحتوى والصور والأسعار وطلبات العملاء وحالات الظهور." },
          "consultation-note": { title: "مراجعة الاستشارة", description: "تُراجع المواعيد حسب نوع الخدمة، الموقع، مساحة المشروع، الجدول الزمني، وتوفر فترات التنفيذ." }
        }
      }
    };

    function getLanguage() {
      const saved = localStorage.getItem(FORMA_LANGUAGE_KEY);
      return saved === "en" ? "en" : "ar";
    }

    function setLanguage(lang) {
      localStorage.setItem(FORMA_LANGUAGE_KEY, lang === "en" ? "en" : "ar");
      applyFormaSite();
      document.querySelectorAll(".main-swiper, .product-swiper, .testimonial-swiper").forEach(function(el) {
        if (el.swiper) el.swiper.update();
      });
      window.dispatchEvent(new CustomEvent("forma:language-changed", { detail: getLanguage() }));
    }

    function isArabic() {
      return getLanguage() === "ar";
    }

    function tr(key) {
      const lang = getLanguage();
      return (translations[lang] && translations[lang][key]) || (extraTranslations[lang] && extraTranslations[lang][key]) || translations.en[key] || extraTranslations.en[key] || key;
    }

    function applyDocumentLanguage() {
      const lang = getLanguage();
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.body.classList.toggle("is-rtl", lang === "ar");
      document.body.classList.toggle("is-ltr", lang !== "ar");
    }

    function localizeItem(collection, item, index) {
      const lang = getLanguage();
      if (lang === "en" || !item) return item;
      const group = localizedDefaults.ar[collection];
      let patch = null;
      if (Array.isArray(group)) patch = group[index];
      else if (group) patch = group[item.id] || group[item.key];
      return patch ? Object.assign({}, item, patch) : item;
    }

    function localizedData(data) {
      if (!isArabic()) return data;
      const result = cloneData(data);
      result.settings = Object.assign({}, result.settings, localizedDefaults.ar.settings || {});
      ["slides", "services", "designs", "projects", "pricing", "contentBlocks"].forEach(function(collection) {
        result[collection] = (result[collection] || []).map(function(item, index) {
          return localizeItem(collection, item, index);
        });
      });
      return result;
    }

    function addLanguageToggle() {
      document.querySelectorAll(".forma-language-item").forEach(function(item) { item.remove(); });
      const targetLists = document.querySelectorAll(".navbar-nav > ul:last-child");
      targetLists.forEach(function(list) {
        const item = document.createElement("li");
        item.className = "nav-item forma-language-item";
        item.innerHTML = `<button type="button" class="forma-language-toggle" aria-label="${tr("switchLanguage")}"><span class="forma-language-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="17" height="17"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"></circle><path d="M3.6 9h16.8M3.6 15h16.8M12 3c2.4 2.3 3.5 5.2 3.5 9s-1.1 6.7-3.5 9M12 3C9.6 5.3 8.5 8.2 8.5 12s1.1 6.7 3.5 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg></span><b>${getLanguage() === "ar" ? "EN" : "AR"}</b></button>`;
        list.appendChild(item);
      });
      document.querySelectorAll(".forma-language-toggle").forEach(function(button) {
        button.addEventListener("click", function() {
          setLanguage(getLanguage() === "ar" ? "en" : "ar");
        });
      });
    }

    window.FormaI18n = {
      lang: getLanguage,
      set: setLanguage,
      t: tr,
      isArabic: isArabic
    };

    function visibleItems(items) {
      return (items || []).filter(function(item) {
        return item.status !== "hidden";
      });
    }

    function setText(selector, text, root) {
      const element = (root || document).querySelector(selector);
      if (element) element.textContent = text;
    }

    function setHtml(selector, html, root) {
      const element = (root || document).querySelector(selector);
      if (element) element.innerHTML = html;
    }

    function escapeHtml(value) {
      return String(value || "").replace(/[&<>"']/g, function(char) {
        return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char];
      });
    }

    function listItems(value, fallback) {
      const source = Array.isArray(value) ? value : String(value || "").split(/\n|,/);
      const items = source.map(function(item) { return String(item).trim(); }).filter(Boolean);
      return items.length ? items : (fallback || []);
    }

    function contentBlock(data, key, fallback) {
      const item = visibleItems(data.contentBlocks).find(function(blockItem) {
        return blockItem.key === key || blockItem.id === key;
      });
      return item ? item.description : fallback;
    }

    function pageName() {
      const file = window.location.pathname.split("/").pop() || "index.html";
      return file.toLowerCase();
    }

    function safeImage(src) {
      const value = String(src || "");
      if (!value || value.indexOf("banner-img.3.avif") !== -1) return formaImages.apartment;
      return value;
    }

    function serviceCard(item) {
      const image = safeImage(item.image);
      return `
        <div class="product-card position-relative">
          <div class="image-holder zoom-effect">
            <img src="${escapeHtml(image)}" alt="${escapeHtml(item.title)}" class="img-fluid zoom-in" loading="lazy" onerror="this.onerror=null;this.src='${escapeHtml(formaImages.apartment)}';">
            <div class="cart-concern position-absolute">
              <div class="cart-button"><a href="${CANONICAL_REQUEST_URL}" class="btn">${tr("requestNow")}</a></div>
            </div>
          </div>
          <div class="card-detail text-center pt-3 pb-2">
            <h5 class="card-title fs-3 text-capitalize"><a href="single-product.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.title)}</a></h5>
            <span class="item-price text-primary fs-3 fw-light">${escapeHtml(item.price || item.category)}</span>
          </div>
        </div>`;
    }

    function designCard(item) {
      return `
        <div class="col-sm-6 col-lg-4">
          ${serviceCard(item)}
        </div>`;
    }

    function normalizeSearchTerm(value) {
      return String(value || "")
        .toLowerCase()
        .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
        .replace(/[إأآا]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ة/g, "ه")
        .trim();
    }

    function currentSearchQuery() {
      return new URLSearchParams(window.location.search).get("q") || "";
    }

    function catalogSearchText(item) {
      return normalizeSearchTerm([
        item.title,
        item.category,
        item.style,
        item.price,
        item.description,
        item.details,
        item.features,
        item.scope
      ].join(" "));
    }

    function filterCatalogItems(items, query) {
      const needle = normalizeSearchTerm(query);
      if (!needle) return items;
      return items.filter(function(item) {
        return catalogSearchText(item).indexOf(needle) !== -1;
      });
    }

    function submitGlobalSearch(input) {
      if (!input) return;
      const query = String(input.value || "").trim();
      if (!query) {
        input.focus();
        return;
      }
      window.location.href = CANONICAL_CATALOG_URL + "?q=" + encodeURIComponent(query);
    }

    function projectSearchText(item) {
      return [
        item.title,
        item.category,
        item.city,
        item.status,
        item.area,
        item.duration,
        item.clientType,
        item.description,
        item.scope,
        item.materials
      ].join(" ").toLowerCase();
    }

    function projectCard(item) {
      const href = `single-post.html?id=${encodeURIComponent(item.id)}`;
      return `
        <article class="project-card project-card--forma" data-project-card data-project-search="${escapeHtml(projectSearchText(item))}">
          <a class="project-card__media" href="${href}" aria-label="${escapeHtml(item.title || tr("projectStory"))}">
            <img src="${escapeHtml(safeImage(item.image || formaImages.heroInterior))}" alt="${escapeHtml(item.title || "FORMA")}" onerror="this.onerror=null;this.src='${escapeHtml(formaImages.apartment)}';">
            <span>${escapeHtml(item.status || tr("delivered"))}</span>
          </a>
          <div class="project-card__content">
            <p class="project-card__eyebrow">${escapeHtml(item.category || "Interior Design")} / ${escapeHtml(item.city || "Riyadh")}</p>
            <h2><a href="${href}">${escapeHtml(item.title || "FORMA Project")}</a></h2>
            <p>${escapeHtml(item.description || tr("projectScope"))}</p>
            <div class="project-card__specs">
              <span><b>${tr("area")}</b>${escapeHtml(item.area || tr("byScope"))}</span>
              <span><b>${tr("duration")}</b>${escapeHtml(item.duration || tr("phased"))}</span>
              <span><b>${tr("client")}</b>${escapeHtml(item.clientType || tr("privateClient"))}</span>
            </div>
            <a class="btn btn-dark" href="${href}">${tr("viewProject")}</a>
          </div>
        </article>`;
    }

    function normalizeDuplicatePublicLinks(root) {
      const scope = root || document;
      scope.querySelectorAll(`a[href='${LEGACY_CATALOG_URL}']`).forEach(function(link) {
        link.setAttribute("href", CANONICAL_CATALOG_URL);
        if (link.closest(".navbar, footer, .dropdown-menu")) link.textContent = tr("services");
      });
      scope.querySelectorAll(`a[href='${LEGACY_REQUEST_URL}']`).forEach(function(link) {
        link.setAttribute("href", CANONICAL_REQUEST_URL);
        if (link.closest(".navbar, footer, .dropdown-menu")) link.textContent = tr("request");
      });
      scope.querySelectorAll(".navbar ul, footer ul, .dropdown-menu").forEach(function(list) {
        const seen = new Set();
        Array.from(list.children).forEach(function(child) {
          if (!child || child.tagName !== "LI") return;
          const link = child.querySelector("a[href]");
          if (!link) return;
          const href = link.getAttribute("href");
          if (href !== CANONICAL_CATALOG_URL && href !== CANONICAL_REQUEST_URL) return;
          if (seen.has(href)) child.remove();
          else seen.add(href);
        });
      });
    }

    function redirectLegacyDuplicatePage(file) {
      const target = file === LEGACY_CATALOG_URL ? CANONICAL_CATALOG_URL : file === LEGACY_REQUEST_URL ? CANONICAL_REQUEST_URL : "";
      if (!target) return false;
      window.location.replace(target + window.location.search + window.location.hash);
      return true;
    }

    function applyCommonContent(data) {
      document.body.classList.add("forma-site");
      const titles = {
        "index.html": tr("siteTitle"),
        "about.html": tr("aboutTitle"),
        "services.html": tr("servicesTitle"),
        "shop.html": tr("servicesTitle"),
        "single-product.html": tr("serviceDetailsTitle"),
        "blog.html": tr("projectsTitle"),
        "single-post.html": tr("projectStoryTitle"),
        "cart.html": tr("requestTitle"),
        "checkout.html": tr("requestTitle"),
        "login.html": tr("accountTitle"),
        "contact.html": tr("contactTitle"),
        "admin.html": tr("adminDashboardTitle")
      };
      document.title = titles[pageName()] || tr("siteTitle");

      document.querySelectorAll(".navbar-brand").forEach(function(brand) {
        brand.innerHTML = `<span class="forma-wordmark">${escapeHtml(data.settings.brand)}</span>`;
      });

      const navLabels = {
        "index.html": tr("home"),
        "about.html": tr("about"),
        "services.html": tr("services"),
        "shop.html": tr("services"),
        "single-product.html": tr("serviceDetails"),
        "blog.html": tr("projects"),
        "single-post.html": tr("projectStory"),
        "contact.html": tr("contact"),
        "login.html": tr("admin"),
        "admin.html": tr("admin"),
        "cart.html": tr("request"),
        "checkout.html": tr("request")
      };
      document.querySelectorAll("a[href]").forEach(function(link) {
        if (link.classList.contains("navbar-brand")) return;
        const href = link.getAttribute("href");
        if (navLabels[href] && link.closest(".navbar, footer, .dropdown-menu")) {
          link.textContent = navLabels[href];
        }
      });
      normalizeDuplicatePublicLinks(document);
      document.querySelectorAll(".navbar-nav > ul:first-child").forEach(function(list) {
        if (!list.querySelector("a[href='services.html']")) {
          const aboutItem = list.querySelector("a[href='about.html']")?.closest("li");
          const item = document.createElement("li");
          item.className = "nav-item";
          item.innerHTML = `<a class="nav-link ms-0" href="services.html">${tr("services")}</a>`;
          if (aboutItem && aboutItem.nextSibling) list.insertBefore(item, aboutItem.nextSibling);
          else list.insertBefore(item, list.firstChild);
        }
      });
      document.querySelectorAll(".dropdown-menu").forEach(function(menu) {
        if (!menu.querySelector("a[href='services.html']")) {
          const li = document.createElement("li");
          li.innerHTML = `<a href="services.html" class="dropdown-item fs-5 fw-medium">${tr("services")}</a>`;
          const designs = menu.querySelector("a[href='shop.html']")?.closest("li");
          if (designs) menu.insertBefore(li, designs);
          else menu.appendChild(li);
        }
      });
      document.querySelectorAll("footer ul").forEach(function(list) {
        if (list.querySelector("a[href='shop.html']") && !list.querySelector("a[href='services.html']")) {
          const li = document.createElement("li");
          li.className = "menu-item pb-2";
          li.innerHTML = `<a href="services.html">${tr("services")}</a>`;
          const designs = list.querySelector("a[href='shop.html']")?.closest("li");
          if (designs) list.insertBefore(li, designs);
          else list.appendChild(li);
        }
      });
      document.querySelectorAll(".dropdown-toggle").forEach(function(link) {
        if (link.textContent.indexOf("Pages") !== -1 || link.textContent.indexOf("Explore") !== -1 || link.textContent.indexOf("استكشف") !== -1) {
          if (link.childNodes[0]) link.childNodes[0].textContent = tr("explore") + " ";
        }
      });
      document.querySelectorAll("#search").forEach(function(input) {
        input.placeholder = tr("searchPlaceholder");
        if (pageName() === CANONICAL_CATALOG_URL && currentSearchQuery()) input.value = currentSearchQuery();
      });
      document.querySelectorAll("#search-bar a").forEach(function(link) {
        link.textContent = tr("search");
      });
      document.querySelectorAll(".widget-search-bar input[type='search']").forEach(function(input) {
        input.placeholder = tr("searchDesigns");
        input.setAttribute("aria-label", tr("searchDesigns"));
      });
      document.querySelectorAll(".cart-dropdown").forEach(function(item) {
        item.classList.remove("dropdown", "cart-dropdown");
        item.querySelectorAll(".dropdown-menu").forEach(function(menu) { menu.remove(); });
        const link = item.querySelector("a");
        if (!link) return;
        link.classList.remove("dropdown-toggle");
        link.setAttribute("href", CANONICAL_REQUEST_URL);
        link.textContent = tr("request");
        link.removeAttribute("data-bs-toggle");
        link.removeAttribute("role");
        link.removeAttribute("aria-expanded");
      });
      document.querySelectorAll("a[href='cart.html']").forEach(function(link) {
        if (link.closest(".navbar")) link.textContent = tr("request");
      });

      document.querySelectorAll("#newsletter h2").forEach(function(el) {
        el.innerHTML = tr("newsletterTitle");
      });
      document.querySelectorAll("#newsletter p").forEach(function(el) {
        el.textContent = tr("newsletterText");
      });
      document.querySelectorAll("#newsletter input").forEach(function(input) {
        input.placeholder = tr("emailPlaceholder");
      });
      document.querySelectorAll("#newsletter button").forEach(function(button) {
        button.textContent = tr("subscribe");
      });

      document.querySelectorAll("footer#footer").forEach(function(footer) {
        footer.classList.add("forma-footer");
        footer.innerHTML = `
          <div class="container">
            <div class="footer-cta" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="900" data-aos-once="true">
              <div>
                <span>${isArabic() ? "ابدأ مع فورما" : "Start with FORMA"}</span>
                <h3>${isArabic() ? "حوّل فكرة المساحة إلى قرار تصميم واضح." : "Turn your space idea into a clear design decision."}</h3>
                <p>${isArabic() ? "أرسل ملخص المشروع، وسنراجع الخدمة الأنسب والنطاق والسعر المبدئي." : "Send your brief and we will review the right service, scope, and initial budget direction."}</p>
              </div>
              <a class="btn btn-dark footer-cta-button" href="${CANONICAL_REQUEST_URL}">${tr("request")}</a>
            </div>
            <div class="footer-top-area pb-5">
              <div class="row d-flex flex-wrap justify-content-between g-4">
                <div class="col-lg-3 col-sm-6 pb-3" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="1000" data-aos-once="true">
                  <div class="footer-menu">
                    <span class="forma-wordmark footer-wordmark">${escapeHtml(data.settings.brand)}</span>
                    <p>${escapeHtml(data.settings.tagline)}</p>
                  </div>
                </div>
                <div class="col-lg-2 col-sm-6 pb-3" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="1200" data-aos-once="true">
                  <div class="footer-menu">
                    <h4 class="widget-title pb-2">${tr("quickLinks")}</h4>
                    <ul class="menu-list list-unstyled">
                      <li class="menu-item pb-2"><a href="about.html">${tr("about")}</a></li>
                      <li class="menu-item pb-2"><a href="${CANONICAL_CATALOG_URL}">${tr("services")}</a></li>
                      <li class="menu-item pb-2"><a href="contact.html">${tr("contact")}</a></li>
                      <li class="menu-item pb-2"><a href="login.html">${tr("admin")}</a></li>
                    </ul>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6 pb-3" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="1400" data-aos-once="true">
                  <div class="footer-menu contact-item">
                    <h4 class="widget-title pb-2">${tr("contactInfo")}</h4>
                    <p>${escapeHtml(data.settings.address)}</p>
                    <p>${escapeHtml(data.settings.phone)}</p>
                    <p>${escapeHtml(data.settings.email)}</p>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6 pb-3" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="1600" data-aos-once="true">
                  <div class="footer-menu">
                    <h4 class="widget-title pb-2">${tr("studioUpdates")}</h4>
                    <p>${isArabic() ? "تابع تحديثات الاستوديو وملاحظات التصميم والمشاريع الجديدة عبر منصاتنا." : "Follow our studio updates, design notes, and new projects on our social platforms."}</p>
                    <div class="social-links">
                      <ul class="d-flex list-unstyled">
                        <li><a href="#" aria-label="Facebook"><svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z"/></svg></a></li>
                        <li><a href="#" aria-label="Instagram"><svg aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M128 80a48 48 0 1 0 48 48a48.05 48.05 0 0 0-48-48Zm0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32Zm48-136H80a56.06 56.06 0 0 0-56 56v96a56.06 56.06 0 0 0 56 56h96a56.06 56.06 0 0 0 56-56V80a56.06 56.06 0 0 0-56-56Zm40 152a40 40 0 0 1-40 40H80a40 40 0 0 1-40-40V80a40 40 0 0 1 40-40h96a40 40 0 0 1 40 40ZM192 76a12 12 0 1 1-12-12a12 12 0 0 1 12 12Z"/></svg></a></li>
                        <li><a href="#" aria-label="X"><svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M17.53 3h3.31l-7.23 8.26L22.11 21h-6.65l-5.2-6.8L4.3 21H.99l7.73-8.84L.57 3h6.82l4.71 6.23L17.53 3Zm-1.16 16.28h1.84L6.39 4.63H4.42l11.95 14.65Z"/></svg></a></li>
                        <li><a href="#" aria-label="LinkedIn"><svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z"/></svg></a></li>
                        <li><a href="#" aria-label="YouTube"><svg aria-hidden="true" viewBox="0 0 32 32"><path fill="currentColor" d="M29.41 9.26a3.5 3.5 0 0 0-2.47-2.47C24.76 6.2 16 6.2 16 6.2s-8.76 0-10.94.59a3.5 3.5 0 0 0-2.47 2.47A36.13 36.13 0 0 0 2 16a36.13 36.13 0 0 0 .59 6.74a3.5 3.5 0 0 0 2.47 2.47c2.18.59 10.94.59 10.94.59s8.76 0 10.94-.59a3.5 3.5 0 0 0 2.47-2.47A36.13 36.13 0 0 0 30 16a36.13 36.13 0 0 0-.59-6.74ZM13.2 20.2v-8.4l7.27 4.2Z"/></svg></a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr>
          </div>`;
      });
      const bottom = document.querySelector("#footer-bottom p, #footer-bottom .copyright p");
      if (bottom) bottom.innerHTML = tr("copyright");
      addLanguageToggle();
    }

    function applyPageTitle(title, crumb) {
      document.querySelectorAll(".page-title").forEach(function(section) {
        const container = section.querySelector(".container");
        section.classList.add("forma-page-title");
        if (container && !container.querySelector(".page-title-logo")) {
          container.insertAdjacentHTML(
            "afterbegin",
            `<img class="page-title-logo" src="images/Logo only 1.png" alt="FORMA">`
          );
        }
      });
      setText(".page-title h1", title);
      document.querySelectorAll(".page-title p").forEach(function(item) {
        item.remove();
      });
    }

    function renderHome(data) {
      data.slides.forEach(function(slide, index) {
        const item = document.querySelectorAll(".main-swiper .swiper-slide")[index];
        if (!item) return;
        item.style.backgroundImage = `url(${slide.image})`;
        setText("h2", slide.title, item);
        setText("p", slide.text, item);
        const btn = item.querySelector(".btn");
        if (btn) {
          btn.textContent = slide.cta;
          btn.href = slide.href;
        }
      });
      setText("#about .title-accent", tr("homeAboutEyebrow"));
      setText("#about h3", tr("homeAboutTitle"));
      setText("#about p", contentBlock(data, "home-intro", tr("homeAboutText")));
      setText("#products h3", tr("coreServices"));
      const productLink = document.querySelector("#products .btn-right a.btn");
      if (productLink) {
        productLink.textContent = tr("viewAllServices");
        productLink.href = "services.html";
      }
      const wrapper = document.querySelector(".product-swiper .swiper-wrapper");
      if (wrapper) {
        wrapper.innerHTML = visibleItems(data.services).slice(0, 5).map(function(item) {
          return `<div class="swiper-slide">${serviceCard(item)}</div>`;
        }).join("");
      }
      setText("#testimonials h3", tr("howWorks"));
      document.querySelectorAll("#testimonials blockquote").forEach(function(item, index) {
        const texts = isArabic() ? [
          "نبدأ بالمساحة ونمط الاستخدام والميزانية ومعايير النجاح قبل اقتراح أي اتجاه بصري.",
          "نحوّل كل تصور إلى خامات وإضاءة وأثاث وملاحظات تنفيذ قابلة للمراجعة والاعتماد.",
          "توثق المشاريع على مراحل حتى تبقى الصور والأسعار والحالة والتحديثات قابلة للإدارة من لوحة التحكم."
        ] : [
          "We begin with the space, lifestyle, budget, and success criteria before proposing any visual direction.",
          "Every concept is translated into materials, lighting, furniture, and execution notes that can be reviewed and approved.",
          "Projects are documented through stages so updates, images, pricing, and status remain manageable from the dashboard."
        ];
        item.textContent = texts[index] || texts[0];
      });
      document.querySelectorAll("#testimonials .name").forEach(function(item, index) {
        item.textContent = [tr("discover"), tr("decide"), tr("deliver")][index] || "FORMA";
      });
      setText("#faqs h3", tr("operationalPolicy"));
      const faqs = isArabic() ? [
        ["كيف تبدأ فورما المشروع؟", "نراجع الملخص ونوع المساحة ونطاق الميزانية والجدول الزمني والستايل المفضل قبل تحديد نطاق الخدمة."],
        ["هل يمكن تحديث التصاميم والمشاريع من لوحة الإدارة؟", "نعم. الخدمات والتصاميم والمشاريع والأسعار والصور والأوصاف والتصنيفات وحالة الظهور تُدار من لوحة الإدارة."],
        ["هل الأسعار ثابتة؟", "الاستشارات والباقات الأولية يمكن أن تعرض أسعاراً ثابتة. أما نطاقات التصميم والتنفيذ الأكبر فتُسعّر بعد المراجعة."],
        ["هل تبقى العناصر المخفية داخل النظام؟", "نعم. تدعم لوحة الإدارة حالات الظهور والإخفاء حتى تبقى العناصر غير المنشورة قابلة للتعديل دون عرضها للزوار."],
        ["ماذا تتضمن صفحة المشروع؟", "يمكن أن تتضمن المدينة، التصنيف، الحالة، معرض الصور، ملخص النطاق، وخطوات التسليم."]
      ] : [
        ["How does FORMA start a project?", "We review the brief, space type, budget range, timeline, and preferred style before defining the service scope."],
        ["Can designs and projects be updated from the dashboard?", "Yes. Services, designs, projects, prices, images, descriptions, categories, and visibility are managed from the admin dashboard."],
        ["Are prices fixed?", "Consultation and starter packages can show fixed prices. Larger design and fit-out scopes are quoted after review."],
        ["Can hidden items stay in the system?", "Yes. The dashboard supports visible and hidden states so unpublished items remain editable without showing on the public site."],
        ["What does a project page include?", "A project page can include city, category, status, gallery image, scope summary, and delivery notes."]
      ];
      document.querySelectorAll("#faqs .accordion-item").forEach(function(item, index) {
        const faq = faqs[index];
        if (!faq) return;
        setText(".accordion-button", faq[0], item);
        setText(".accordion-body p", faq[1], item);
      });
      document.querySelectorAll("#banner .banner-content-text").forEach(function(card, index) {
        const labels = [tr("interiorDesign"), tr("executedProjects"), tr("consultation")];
        const links = [CANONICAL_CATALOG_URL, "blog.html", CANONICAL_REQUEST_URL];
        setText("h2", labels[index], card);
        const btn = card.querySelector(".btn");
        if (btn) {
          btn.textContent = index === 2 ? tr("bookNow") : tr("explore");
          btn.href = links[index];
        }
      });
    }

    function renderDesigns(data) {
      applyPageTitle(tr("designs"), tr("designs"));
      setText(".shop-toolbar p, .Designs-toolbar p", tr("showingDesigns"));
      const select = document.querySelector(".shop-toolbar select, .Designs-toolbar select");
      if (select) select.innerHTML = `<option>${tr("defaultOrder")}</option><option>${tr("sortCategory")}</option><option>${tr("sortPrice")}</option>`;
      const grid = document.querySelector(".product-grid");
      if (grid) grid.innerHTML = visibleItems(data.designs).map(designCard).join("");
      const categories = Array.from(new Set(data.designs.map(function(item) { return item.category; })));
      const styles = Array.from(new Set(data.designs.map(function(item) { return item.style; })));
      const widgets = document.querySelectorAll(".sidebar .widget");
      if (widgets[0]) {
        widgets[0].innerHTML = `<h5 class="widget-title text-uppercase">${tr("categories")}</h5><ul class="list-unstyled lh-lg">${[tr("all")].concat(categories).map(function(label) { return `<li><a href="#">${escapeHtml(label)}</a></li>`; }).join("")}</ul>`;
      }
      if (widgets[1]) {
        widgets[1].innerHTML = `<h5 class="widget-title text-uppercase">${tr("styles")}</h5><ul class="list-unstyled lh-lg">${styles.map(function(label) { return `<li><a href="#">${escapeHtml(label)}</a></li>`; }).join("")}</ul>`;
      }
      if (widgets[2]) {
        widgets[2].innerHTML = `<h5 class="widget-title text-uppercase">${tr("services")}</h5><ul class="list-unstyled lh-lg">${visibleItems(data.services).map(function(item) { return `<li><a href="single-product.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.title)}</a></li>`; }).join("")}</ul>`;
      }
      if (widgets[3]) {
        widgets[3].innerHTML = `<h5 class="widget-title text-uppercase">${tr("pricing")}</h5><ul class="list-unstyled lh-lg">${visibleItems(data.pricing).map(function(item) { return `<li><a href="${CANONICAL_REQUEST_URL}">${escapeHtml(item.title)} - ${escapeHtml(item.price)}</a></li>`; }).join("")}</ul>`;
      }
    }

    function renderServices(data) {
      applyPageTitle(tr("services"), tr("services"));
      const query = currentSearchQuery();
      const allCatalogItems = visibleItems(data.services).concat(visibleItems(data.designs));
      const catalogItems = filterCatalogItems(allCatalogItems, query);
      setText(".shop-toolbar p, .Designs-toolbar p", query ? (isArabic() ? `نتائج البحث عن "${query}"` : `Search results for "${query}"`) : tr("showingServices"));
      const select = document.querySelector(".shop-toolbar select, .Designs-toolbar select");
      if (select) select.innerHTML = `<option>${tr("defaultOrder")}</option><option>${tr("sortCategory")}</option><option>${tr("sortPrice")}</option>`;
      const grid = document.querySelector(".product-grid");
      if (grid) {
        grid.innerHTML = catalogItems.length ? catalogItems.map(function(item) {
          return `<div class="col-sm-6 col-lg-4">${serviceCard(item)}</div>`;
        }).join("") : `<div class="col-12"><div class="forma-search-empty"><h3>${isArabic() ? "لا توجد نتائج مطابقة" : "No matching results"}</h3><p>${isArabic() ? "جرّب كلمة أبسط مثل: تصميم، مجلس، واجهة، تأثيث." : "Try a simpler keyword such as interior, majlis, facade, or furnishing."}</p></div></div>`;
      }
      const widgets = document.querySelectorAll(".sidebar .widget");
      if (widgets[0]) {
        widgets[0].innerHTML = `<h5 class="widget-title text-uppercase">${tr("serviceCategories")}</h5><ul class="list-unstyled lh-lg">${Array.from(new Set(data.services.map(function(item) { return item.category; }))).map(function(label) { return `<li><a href="#">${escapeHtml(label)}</a></li>`; }).join("")}</ul>`;
      }
      if (widgets[1]) {
        widgets[1].innerHTML = `<h5 class="widget-title text-uppercase">${tr("designCatalog")}</h5><ul class="list-unstyled lh-lg">${visibleItems(data.designs).slice(0, 5).map(function(item) { return `<li><a href="single-product.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.title)}</a></li>`; }).join("")}</ul>`;
      }
      if (widgets[2]) {
        widgets[2].innerHTML = `<h5 class="widget-title text-uppercase">${tr("projects")}</h5><ul class="list-unstyled lh-lg">${visibleItems(data.projects).slice(0, 5).map(function(item) { return `<li><a href="single-post.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.title)}</a></li>`; }).join("")}</ul>`;
      }
      if (widgets[3]) {
        widgets[3].innerHTML = `<h5 class="widget-title text-uppercase">${tr("pricing")}</h5><ul class="list-unstyled lh-lg">${visibleItems(data.pricing).map(function(item) { return `<li><a href="${CANONICAL_REQUEST_URL}">${escapeHtml(item.title)} - ${escapeHtml(item.price)}</a></li>`; }).join("")}</ul>`;
      }
    }

    function renderProjects(data) {
      applyPageTitle(tr("projects"), tr("projects"));
      const main = document.querySelector("main");
      const projects = visibleItems(data.projects);
      const delivered = projects.filter(function(item) { return /delivered|تم/.test(String(item.status || "").toLowerCase()); }).length;
      const inProgress = projects.filter(function(item) { return /in progress|قيد/.test(String(item.status || "").toLowerCase()); }).length;
      const filters = isArabic() ? [
        ["all", tr("all")],
        ["داخلي", "داخلي"],
        ["خارجي", "خارجي"],
        ["تنفيذ", "تنفيذ"],
        ["تأثيث", "تأثيث"],
        ["سكني", "سكني"],
        ["تجاري", "تجاري"],
        ["تم", tr("delivered")]
      ] : [
        ["all", "All"],
        ["interior", "Interior"],
        ["exterior", "Exterior"],
        ["fit-out", "Fit-out"],
        ["furnishing", "Furnishing"],
        ["residential", "Residential"],
        ["commercial", "Commercial"],
        ["delivered", "Delivered"]
      ];
      if (!main) return;
      main.className = "page-content projects-page padding-large";
      main.innerHTML = `
        <div class="container narrow-container">
          <section class="projects-head">
            <span class="title-accent fs-6 text-uppercase">${tr("projectStoriesEyebrow")}</span>
            <div class="projects-head__grid">
              <div>
                <h2>${tr("projectsIntroTitle")}</h2>
                <p>${tr("projectsIntroText")}</p>
              </div>
              <div class="projects-stats">
                <article><strong>${projects.length}</strong><span>${tr("publishedProjects")}</span></article>
                <article><strong>${delivered}</strong><span>${tr("delivered")}</span></article>
                <article><strong>${inProgress}</strong><span>${tr("inProgress")}</span></article>
              </div>
            </div>
            <div class="projects-filter-bar">
              ${filters.map(function(filter, index) {
                return `<button type="button" class="${index === 0 ? "active" : ""}" data-project-filter="${escapeHtml(filter[0].toLowerCase())}">${escapeHtml(filter[1])}</button>`;
              }).join("")}
            </div>
          </section>
          <section class="projects-layout">
            <div class="projects-grid" data-projects-grid>
              ${projects.map(projectCard).join("")}
            </div>
            <aside class="projects-aside">
              <div class="projects-aside__block">
                <h3>${tr("projectScope")}</h3>
                <p>${tr("projectScopeText")}</p>
              </div>
              <div class="projects-aside__block">
                <h3>${tr("latestWork")}</h3>
                <div class="projects-mini-list">
                  ${projects.slice(0, 4).map(function(item) {
                    return `<a href="single-post.html?id=${encodeURIComponent(item.id)}"><img src="${escapeHtml(safeImage(item.image || formaImages.heroInterior))}" alt="" onerror="this.onerror=null;this.src='${escapeHtml(formaImages.apartment)}';"><span>${escapeHtml(item.title || tr("formaProject"))}</span></a>`;
                  }).join("")}
                </div>
              </div>
              <a class="btn btn-dark w-100 text-center" href="${CANONICAL_REQUEST_URL}">${tr("requestConsultation")}</a>
            </aside>
          </section>
        </div>`;
      bindProjectFilters();
    }

    function bindProjectFilters() {
      document.querySelectorAll("[data-project-filter]").forEach(function(button) {
        button.addEventListener("click", function() {
          const filter = button.dataset.projectFilter;
          document.querySelectorAll("[data-project-filter]").forEach(function(btn) { btn.classList.toggle("active", btn === button); });
          document.querySelectorAll("[data-project-card]").forEach(function(card) {
            const haystack = (card.dataset.projectSearch || "").toLowerCase();
            card.hidden = filter !== "all" && haystack.indexOf(filter) === -1;
          });
        });
      });
    }

    function currentItem(items, fallbackId) {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id") || fallbackId;
      return items.find(function(item) { return item.id === id; }) || items[0];
    }

    function renderServiceDetail(data) {
      const item = currentItem(visibleItems(data.services).concat(visibleItems(data.designs)));
      if (!item) return;
      applyPageTitle(item.title, tr("services"));
      const main = document.querySelector("main");
      const features = listItems(item.features, [tr("clearScope"), tr("visualDirection"), tr("managedContent"), tr("visibilityControl")]);
      const scope = listItems(item.scope, [tr("briefReview"), tr("designDirection"), tr("materialReferences"), tr("deliveryNotes")]);
      if (main) {
        main.innerHTML = `
          <section class="single-product padding-large">
            <div class="container">
              <div class="row g-5 align-items-start">
                <div class="col-lg-6"><div class="product-main-image"><img src="${escapeHtml(safeImage(item.image))}" alt="${escapeHtml(item.title)}" onerror="this.onerror=null;this.src='${escapeHtml(formaImages.apartment)}';"></div></div>
                <div class="col-lg-6 product-info">
                  <span class="title-accent fs-6 text-uppercase">${escapeHtml(item.category || item.style || "FORMA")}</span>
                  <h1>${escapeHtml(item.title)}</h1>
                  <p class="fs-4">${escapeHtml(item.description)}</p>
                  <p>${escapeHtml(item.details || tr("singleServiceManaged"))}</p>
                  <p class="item-price text-primary fs-3 fw-light">${escapeHtml(item.price || tr("customQuote"))}</p>
                  <div class="d-flex flex-wrap gap-3 mt-4"><a class="btn btn-dark" href="${CANONICAL_REQUEST_URL}">${tr("bookConsultation")}</a><a class="btn" href="${CANONICAL_CATALOG_URL}">${tr("viewAllServices")}</a></div>
                </div>
              </div>
              <div class="service-detail-grid mt-5">
                <section>
                  <h3>${tr("serviceFeatures")}</h3>
                  ${features.map(function(entry) { return `<p>${escapeHtml(entry)}</p>`; }).join("")}
                </section>
                <section>
                  <h3>${tr("scopeOfWork")}</h3>
                  ${scope.map(function(entry) { return `<p>${escapeHtml(entry)}</p>`; }).join("")}
                </section>
                <section>
                  <h3>${tr("howManaged")}</h3>
                  <p>${tr("dashboardControls")}</p>
                  <p>${tr("imageControls")}</p>
                </section>
              </div>
            </div>
          </section>`;
      }
    }

    function renderProjectDetail(data) {
      const item = currentItem(visibleItems(data.projects));
      if (!item) return;
      applyPageTitle(item.title, tr("projects"));
      const main = document.querySelector("main");
      const gallery = listItems(item.images, [item.image]);
      const scope = listItems(item.scope, isArabic() ? ["تعريف النطاق", "توجيه الخامات", "ملاحظات التنفيذ", "مراجعة التسليم"] : ["Scope definition", "Material direction", "Execution notes", "Handover review"]);
      const materials = listItems(item.materials, isArabic() ? ["خشب", "حجر", "إضاءة", "أقمشة"] : ["Wood", "Stone", "Lighting", "Textiles"]);
      const challenges = listItems(item.challenges, [isArabic() ? "نُظمت قرارات المشروع مبكراً لتقليل تغييرات التنفيذ." : "Project decisions were organized early to reduce execution changes."]);
      const results = listItems(item.results, [isArabic() ? "وُثق المشروع بالحالة والصور والملخص وملاحظات التسليم." : "The project was documented with visible status, images, summary, and delivery notes."]);
      if (main) {
        main.innerHTML = `
          <article class="single-post-page padding-large">
            <div class="container narrow-container">
              <div class="project-detail-hero mb-5">
                <img src="${escapeHtml(safeImage(item.image || gallery[0]))}" class="w-100" alt="${escapeHtml(item.title || tr("formaProject"))}" onerror="this.onerror=null;this.src='${escapeHtml(formaImages.apartment)}';">
                <div>
                  <p class="title-accent fs-6 text-uppercase">${escapeHtml(item.city || (isArabic() ? "الرياض" : "Riyadh"))} / ${escapeHtml(item.category || tr("interiorDesign"))} / ${escapeHtml(item.status || tr("visible"))}</p>
                  <h1>${escapeHtml(item.title || tr("formaProject"))}</h1>
                  <p class="fs-4">${escapeHtml(item.description || (isArabic() ? "قصة مشروع من فورما تشمل التصميم والخامات والتنفيذ وتفاصيل التسليم." : "FORMA project story with design, materials, execution, and delivery details."))}</p>
                  <p>${escapeHtml(item.details || (isArabic() ? "يُدار سجل المشروع من لوحة الإدارة ويمكن تحديثه بالصور والنطاق والخامات والتحديات والنتائج والفيديو." : "This project record is managed from the dashboard and can be updated with images, scope, materials, challenges, results, and video."))}</p>
                  <a class="btn btn-dark mt-3" href="${CANONICAL_REQUEST_URL}">${tr("requestConsultation")}</a>
                </div>
              </div>
              <div class="project-meta-grid my-5">
                <article><span>${tr("projectTypeLabel")}</span><strong>${escapeHtml(item.category || tr("interiorDesign"))}</strong></article>
                <article><span>${tr("cityLocationLabel")}</span><strong>${escapeHtml(item.city || (isArabic() ? "الرياض" : "Riyadh"))}</strong></article>
                <article><span>${tr("area")}</span><strong>${escapeHtml(item.area || tr("byScope"))}</strong></article>
                <article><span>${tr("duration")}</span><strong>${escapeHtml(item.duration || tr("phased"))}</strong></article>
                <article><span>${tr("client")}</span><strong>${escapeHtml(item.clientType || tr("privateClient"))}</strong></article>
                <article><span>${tr("completion")}</span><strong>${escapeHtml(item.completedAt || tr("accordingSchedule"))}</strong></article>
              </div>
              <h2 class="mb-3">${tr("projectGallery")}</h2>
              <div class="project-gallery-grid mb-5">
                ${gallery.map(function(src) { return `<img src="${escapeHtml(safeImage(src))}" alt="${escapeHtml(item.title)}" onerror="this.onerror=null;this.src='${escapeHtml(formaImages.apartment)}';">`; }).join("")}
              </div>
              <div class="project-detail-grid">
                <section><h3>${tr("scopeOfWork")}</h3>${scope.map(function(entry) { return `<p>${escapeHtml(entry)}</p>`; }).join("")}</section>
                <section><h3>${tr("materialsUsed")}</h3>${materials.map(function(entry) { return `<p>${escapeHtml(entry)}</p>`; }).join("")}</section>
                <section><h3>${tr("challengesSolutions")}</h3>${challenges.map(function(entry) { return `<p>${escapeHtml(entry)}</p>`; }).join("")}</section>
                <section><h3>${tr("deliveryResults")}</h3>${results.map(function(entry) { return `<p>${escapeHtml(entry)}</p>`; }).join("")}</section>
              </div>
              ${item.videoUrl ? `<div class="ratio ratio-16x9 mt-5"><iframe src="${escapeHtml(item.videoUrl)}" title="${escapeHtml(item.title)}" allowfullscreen></iframe></div>` : ""}
              <hr>
              <section class="project-cta-strip">
                <div>
                  <span class="title-accent fs-6 text-uppercase">${tr("startWithForma")}</span>
                  <h3>${tr("needSimilar")}</h3>
                  <p>${tr("startWithFormaText")}</p>
                </div>
                <div class="d-flex gap-2 flex-wrap">
                  <a class="btn btn-dark" href="${CANONICAL_REQUEST_URL}">${tr("bookConsultation")}</a>
                  <a class="btn" href="blog.html">${tr("backProjects")}</a>
                </div>
              </section>
            </div>
          </article>`;
      }
    }

    function renderAbout(data) {
      applyPageTitle(isArabic() ? "من نحن" : "About FORMA", tr("about"));
      const serviceTitles = isArabic() ? ["نطاق التصميم", "مراجعة الجودة", "ضبط الأسعار", "محتوى منظم"] : ["Design Scope", "Quality Review", "Pricing Control", "Secure Content"];
      const serviceTexts = isArabic() ? [
        "كل تصميم يبدأ بفهم المساحة والاستخدام والميزانية وأهداف التسليم.",
        "تُراجع الخامات والإضاءة وملاحظات التنفيذ قبل التسليم.",
        "يمكن تحديث الأسعار ووصف الباقات من لوحة الإدارة.",
        "يفصل الموقع بين المحتوى المنشور والعناصر المخفية كمسودات."
      ] : [
        "Every design starts with space, use, budget, and delivery goals.",
        "Materials, lighting, and execution notes are reviewed before handover.",
        "Prices and package descriptions can be updated from the dashboard.",
        "Public content is separated from hidden draft items."
      ];
      document.querySelectorAll(".about-services .service-item").forEach(function(card, index) {
        setText("h4", serviceTitles[index] || "FORMA", card);
        setText("p", serviceTexts[index] || data.settings.tagline, card);
      });
      setText(".about-content-card .title-accent", tr("homeAboutEyebrow"));
      setText(".about-content-card h2", isArabic() ? "منصة استوديو تصميم مبنية حول قرارات واضحة ومحتوى قابل للإدارة." : "A design studio platform built around clear decisions and manageable content.");
      setText(".about-content-card p", isArabic() ? "تجمع فورما بين عرض التصميم، توثيق المشاريع، الأسعار، طلبات الاستشارة، وإدارة المحتوى. يبقى الموقع العام أنيقاً بينما تتحكم لوحة الإدارة في البيانات التشغيلية خلفه." : "FORMA combines design presentation, project documentation, pricing, consultation requests, and content management. The public site stays elegant while the dashboard controls the operational data behind it.");
      setText(".about-testimonials h2", isArabic() ? "سياستنا التشغيلية" : "Our Operating Policy");
      setText(".about-testimonials blockquote", contentBlock(data, "policy", isArabic() ? "عرض الخدمة بوضوح، توثيق المشروع بصدق، إبقاء كل عنصر ظاهر قابلاً للتعديل، والسماح للفريق بإخفاء أو تحديث المحتوى دون تعديل الكود." : "Present the service clearly, document the project honestly, keep every visible item editable, and allow the team to hide or update content without touching code."));
      setText(".about-testimonials .name", isArabic() ? "استوديو فورما" : "FORMA Studio");
    }

    function renderContact(data) {
      applyPageTitle(tr("contact"), tr("contact"));
      setText(".contact-page h2", tr("contactForma"));
      const firstPara = document.querySelector(".contact-page .col-lg-6 p");
      if (firstPara) firstPara.textContent = tr("contactLead");
      document.querySelectorAll(".contact-block").forEach(function(block) {
        block.innerHTML = `<h4>${tr("studio")}</h4><p>${escapeHtml(data.settings.address)}</p><p>${escapeHtml(data.settings.phone)}</p><p>${escapeHtml(data.settings.email)}</p>`;
      });
      setText(".line-form button", tr("sendBrief"));
      const storeSection = document.querySelector(".stores-section h2");
      if (storeSection) storeSection.textContent = tr("consultationDirection");
      const storeText = document.querySelector(".stores-section .col-lg-6 > p");
      if (storeText) storeText.textContent = contentBlock(data, "consultation-note", isArabic() ? "تراجع المواعيد حسب نوع الخدمة والنطاق والفترات المتاحة للمشاريع." : "Appointments are reviewed according to service type, scope, and available project slots.");
    }

    function packageCard(item, index) {
      const fallback = (formaDefaults.pricing || []).find(function(packageItem) {
        return packageItem.id === item.id;
      }) || {};
      const packageItem = Object.assign({}, fallback, item);
      const includes = listItems(packageItem.includes, []);
      const label = packageItem.label || (index === 0 ? tr("consultation") : tr("pricing"));
      return `
        <article class="forma-package-card${index === 1 ? " is-featured" : ""}">
          <div class="forma-package-card__head">
            <span class="forma-package-card__number">${String(index + 1).padStart(2, "0")}</span>
            <span class="forma-package-card__label">${escapeHtml(label)}</span>
          </div>
          <h4>${escapeHtml(packageItem.title)}</h4>
          <p class="forma-package-card__description">${escapeHtml(packageItem.description)}</p>
          <div class="forma-package-card__meta">
            <span>${tr("packageBestFor")}</span>
            <strong>${escapeHtml(packageItem.idealFor || packageItem.title)}</strong>
          </div>
          ${includes.length ? `<div class="forma-package-card__includes"><span>${tr("packageIncludes")}</span><ul>${includes.map(function(entry) { return `<li>${escapeHtml(entry)}</li>`; }).join("")}</ul></div>` : ""}
          <div class="forma-package-card__footer">
            <div>
              <span>${tr("packageDuration")}</span>
              <em>${escapeHtml(packageItem.duration || tr("byScope"))}</em>
            </div>
            <strong>${escapeHtml(packageItem.price)}</strong>
          </div>
          <a class="forma-package-card__link" href="#forma-request-form" data-package-choice data-package-title="${escapeHtml(packageItem.title)}" data-package-price="${escapeHtml(packageItem.price)}">${tr("choosePackage")}</a>
        </article>`;
    }

    function renderRequestPage(data, mode) {
      applyPageTitle(mode === "checkout" ? tr("bookConsultationTitle") : tr("projectRequest"), mode === "checkout" ? tr("consultationCrumb") : tr("request"));
      const main = document.querySelector("main");
      if (!main) return;
      main.innerHTML = `
        <section class="padding-large">
          <div class="container narrow-container">
            <div class="row g-5">
              <div class="col-lg-5">
                <div class="request-packages-head">
                  <span class="title-accent fs-6 text-uppercase">${tr("pricing")}</span>
                  <h2>${tr("availablePackages")}</h2>
                  <p>${tr("packagesIntro")}</p>
                </div>
                <div class="forma-price-list">
                  ${visibleItems(data.pricing).map(function(item, index) {
                    return packageCard(item, index);
                  }).join("")}
                </div>
              </div>
              <div class="col-lg-7">
                <h2>${tr("sendProjectBrief")}</h2>
                <p>${escapeHtml(contentBlock(data, "consultation-note", isArabic() ? "تراجع المواعيد حسب نوع الخدمة والنطاق والفترات المتاحة للمشاريع." : "Appointments are reviewed according to service type, scope, and available project slots."))}</p>
                <form class="line-form mt-4" id="forma-request-form" data-forma-request>
                  <div class="mb-4"><label>${tr("nameRequired")}</label><input class="form-control" name="name" type="text" placeholder="${tr("yourName")}"></div>
                  <div class="mb-4"><label>${tr("emailRequired")}</label><input class="form-control" name="email" type="email" placeholder="${tr("yourEmail")}"></div>
                  <div class="mb-4"><label>${tr("phoneRequired")}</label><input class="form-control" name="phone" type="tel" placeholder="${tr("mobileNumber")}"></div>
                  <div class="mb-4"><label>${tr("projectType")}</label><select class="form-control" name="projectType"><option>${tr("villa")}</option><option>${tr("apartment")}</option><option>${tr("majlis")}</option><option>${tr("office")}</option><option>${tr("commercial")}</option><option>${tr("facade")}</option></select></div>
                  <div class="mb-4"><label>${tr("projectArea")}</label><input class="form-control" name="area" type="text" placeholder="${tr("approxArea")}"></div>
                  <div class="mb-4"><label>${tr("city")}</label><input class="form-control" name="city" type="text" placeholder="${tr("projectCity")}"></div>
                  <div class="mb-4"><label>${tr("requiredService")}</label><select class="form-control" name="service">${visibleItems(data.services).map(function(item) { return `<option>${escapeHtml(item.title)}</option>`; }).join("")}</select></div>
                  <div class="mb-4"><label>${tr("budgetRange")}</label><input class="form-control" name="budget" type="text" placeholder="${tr("budgetPlaceholder")}"></div>
                  <div class="mb-4"><label>${tr("projectDetails")} *</label><textarea class="form-control" name="description" rows="5" placeholder="${tr("detailsPlaceholder")}"></textarea></div>
                  <div class="mb-4"><label>${tr("attachFile")}</label><input class="form-control" name="image" type="file" accept="image/*,.pdf"></div>
                  <button class="btn btn-dark w-100" type="submit">${tr("submitRequest")}</button>
                  <p class="forma-form-message mt-3" hidden></p>
                </form>
              </div>
            </div>
          </div>
        </section>`;
      main.querySelectorAll("[data-package-choice]").forEach(function(link) {
        link.addEventListener("click", function() {
          main.querySelectorAll(".forma-package-card").forEach(function(card) {
            card.classList.remove("is-selected");
          });
          const card = link.closest(".forma-package-card");
          if (card) card.classList.add("is-selected");
          const budget = main.querySelector("[name='budget']");
          if (budget) budget.value = `${link.dataset.packageTitle || ""} - ${link.dataset.packagePrice || ""}`.trim();
        });
      });
    }

    function renderLogin(data) {
      applyPageTitle(tr("accountAdmin"), tr("admin"));
      setText(".account-tabs #signin-tab", tr("adminAccess"));
      setText(".account-tabs #register-tab", tr("clientAccount"));
      setText("#signin label[for='username']", tr("emailAddressRequired"));
      setText("#signin label[for='password']", tr("password") + " *");
      setText("#signin .account-remember span", tr("rememberMe"));
      setText("#signin .account-forgot-link", tr("forgotPassword"));
      setText("#signin button", tr("login"));
      const form = document.querySelector("#signin .account-form");
      if (form && !form.querySelector(".admin-direct-link")) {
        form.insertAdjacentHTML("beforeend", `<a class="btn w-100 admin-direct-link mt-3" href="admin.html">${tr("openDashboard")}</a>`);
      } else if (form) {
        const link = form.querySelector(".admin-direct-link");
        if (link) link.textContent = tr("openDashboard");
      }
      setText("#register label[for='reg-email']", tr("clientEmailRequired"));
      setText("#register label[for='reg-password']", tr("password") + " *");
      setText("#register button", tr("createClientAccount"));
    }

    function applyFormaSite() {
      applyDocumentLanguage();
      const data = localizedData(getFormaData());
      applyCommonContent(data);
      const file = pageName();
      if (redirectLegacyDuplicatePage(file)) return;
      if (file === "index.html") renderHome(data);
      if (file === "about.html") renderAbout(data);
      if (file === "services.html") renderServices(data);
      if (file === "shop.html") renderServices(data);
      if (file === "single-product.html") renderServiceDetail(data);
      if (file === "blog.html") renderProjects(data);
      if (file === "single-post.html") renderProjectDetail(data);
      if (file === "contact.html") renderContact(data);
      if (file === "cart.html") renderRequestPage(data, "cart");
      if (file === "checkout.html") renderRequestPage(data, "cart");
      if (file === "login.html") renderLogin(data);
      if (window.AOS && typeof window.AOS.refreshHard === "function") {
        window.setTimeout(function() { window.AOS.refreshHard(); }, 0);
      }
    }

    function bindSearchForms() {
      document.addEventListener("submit", function(event) {
        const form = event.target.closest("#search-bar form, .widget-search-bar form");
        if (!form) return;
        event.preventDefault();
        submitGlobalSearch(form.querySelector("input[type='text'], input[type='search']"));
      });
      document.addEventListener("click", function(event) {
        const link = event.target.closest("#search-bar a");
        if (!link) return;
        event.preventDefault();
        const form = link.closest("form");
        submitGlobalSearch(form ? form.querySelector("input[type='text'], input[type='search']") : document.querySelector("#search"));
      });
    }

    function bindManagedForms() {
      document.addEventListener("submit", function(event) {
        const form = event.target.closest("[data-forma-request]");
        if (!form) return;
        event.preventDefault();
        const data = getFormaData();
        const payload = {
          id: "request-" + Date.now(),
          title: (form.elements.name.value || "New request").trim(),
          name: (form.elements.name.value || "").trim(),
          email: (form.elements.email.value || "").trim(),
          phone: (form.elements.phone.value || "").trim(),
          projectType: (form.elements.projectType.value || "").trim(),
          area: (form.elements.area.value || "").trim(),
          city: (form.elements.city.value || "").trim(),
          service: (form.elements.service.value || "").trim(),
          budget: (form.elements.budget.value || "").trim(),
          status: "new",
          description: (form.elements.description.value || "").trim()
        };
        const persist = function() {
          data.orders = data.orders || [];
          data.orders.unshift(payload);
          if (payload.email || payload.phone) {
            data.customers = data.customers || [];
            data.customers.unshift({
              id: "customer-" + Date.now(),
              title: payload.name || payload.email || payload.phone,
              email: payload.email,
              phone: payload.phone,
              city: payload.city,
              status: "lead",
              description: payload.description
            });
          }
          saveFormaData(data);
          form.reset();
          const message = form.querySelector(".forma-form-message");
          if (message) {
            message.textContent = tr("requestSaved");
            message.hidden = false;
          }
        };
        const fileInput = form.elements.image;
        if (fileInput && fileInput.files && fileInput.files[0]) {
          const reader = new FileReader();
          reader.onload = function() {
            payload.image = reader.result;
            payload.fileName = fileInput.files[0].name;
            persist();
          };
          reader.readAsDataURL(fileInput.files[0]);
        } else {
          persist();
        }
      });
    }

    $(document).ready(function() {
      applyFormaSite();
      bindSearchForms();
      bindManagedForms();
      
      /* Video */
      var $videoSrc;
      var videoElement = document.getElementById("video");
      var videoSource = document.getElementById("videoSource");

      $('.play-btn').click(function() {
        $videoSrc = $(this).data("src");
      });

      $('#myModal').on('shown.bs.modal', function () {
        if (!videoElement || !videoSource || !$videoSrc) return;
        videoSource.setAttribute("src", $videoSrc);
        videoElement.load();
        videoElement.play();
      });

      $('#myModal').on('hide.bs.modal', function () {
        if (!videoElement || !videoSource) return;
        videoElement.pause();
        videoElement.currentTime = 0;
        videoSource.setAttribute("src", "");
        videoElement.load();
      });

      var swiper = new Swiper(".main-swiper", {
        loop: true,
        speed: 800,
        autoplay: {
          delay: 6000,
        },
        effect: "creative",
        creativeEffect: {
          prev: {
            shadow: true,
            translate: ["-20%", 0, -1],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        },
        pagination: {
          el: ".main-slider-pagination",
          clickable: true,
        },
      });
      
      var swiper = new Swiper(".product-swiper", {
        speed: 1000,
        spaceBetween: 20,
        navigation: {
          nextEl: ".product-carousel-next",
          prevEl: ".product-carousel-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          480: {
            slidesPerView: 2,
          },
          900: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 20,
          }
        },
      }); 

      var swiper = new Swiper(".testimonial-swiper", {
        speed: 1000,
        navigation: {
          nextEl: ".testimonial-arrow-next",
          prevEl: ".testimonial-arrow-prev",
        },
      });

      var thumb_slider = new Swiper(".thumb-swiper", {
        slidesPerView: 1,
      });
      var large_slider = new Swiper(".large-swiper", {
        spaceBetween: 10,
        effect: 'fade',
        thumbs: {
          swiper: thumb_slider,
        },
      });

      headerSticky();
      initJarallax();
      initProductQty();
      AOS.init();
      if (window.AOS && typeof window.AOS.refreshHard === "function") {
        window.setTimeout(function() { window.AOS.refreshHard(); }, 120);
        window.setTimeout(function() { window.AOS.refreshHard(); }, 500);
      }
      
    }); // End of a document ready

    window.addEventListener("load", function () {
      const preloader = document.getElementById("preloader");
      preloader.classList.add("hide-preloader");      
    });

})(jQuery);
