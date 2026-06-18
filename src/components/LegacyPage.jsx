import { useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { legacyPages } from "../data/legacyPages";

function initQuantityControls(root) {
  root.querySelectorAll(".product-qty").forEach((group) => {
    const input = group.querySelector(".input-number, #quantity");
    const plus = group.querySelector(".quantity-right-plus");
    const minus = group.querySelector(".quantity-left-minus");
    if (!input) return;
    plus?.addEventListener("click", (event) => {
      event.preventDefault();
      input.value = String((parseInt(input.value || "0", 10) || 0) + 1);
    });
    minus?.addEventListener("click", (event) => {
      event.preventDefault();
      const value = parseInt(input.value || "0", 10) || 0;
      input.value = String(Math.max(0, value - 1));
    });
  });
}

function initVideoModal(root) {
  const modal = document.getElementById("myModal");
  const video = document.getElementById("video");
  const source = document.getElementById("videoSource");
  if (!modal || !video || !source || !window.bootstrap) return;

  root.querySelectorAll(".play-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const src = button.getAttribute("data-src");
      if (src) source.setAttribute("src", src);
    });
  });

  modal.addEventListener("shown.bs.modal", () => {
    video.load();
    video.play?.();
  });

  modal.addEventListener("hide.bs.modal", () => {
    video.pause?.();
    video.currentTime = 0;
    source.setAttribute("src", "");
    video.load();
  });
}

function initAosFallback() {
  const revealVisibleElements = () => {
    const triggerLine = window.innerHeight * 0.88;

    document.querySelectorAll("[data-aos]").forEach((element) => {
      const rect = element.getBoundingClientRect();
      const once = element.getAttribute("data-aos-once") !== "false";
      const isVisible = rect.top <= triggerLine && rect.bottom >= 0;

      if (isVisible) {
        element.classList.add("aos-animate");
        return;
      }

      if (!once) {
        element.classList.remove("aos-animate");
      }
    });
  };

  const onScroll = () => window.requestAnimationFrame(revealVisibleElements);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  const cleanups = [
    () => window.removeEventListener("scroll", onScroll),
    () => window.removeEventListener("resize", onScroll),
  ];

  revealVisibleElements();
  const interval = window.setInterval(revealVisibleElements, 250);
  cleanups.push(() => window.clearInterval(interval));

  [80, 250, 600, 1200, 2000].forEach((delay) => {
    const timer = window.setTimeout(revealVisibleElements, delay);
    cleanups.push(() => window.clearTimeout(timer));
  });

  if (!("IntersectionObserver" in window)) {
    return () => cleanups.forEach((cleanup) => cleanup());
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const once = entry.target.getAttribute("data-aos-once") !== "false";

        if (entry.isIntersecting) {
          entry.target.classList.add("aos-animate");
          if (once) observer.unobserve(entry.target);
          return;
        }

        if (!once) {
          entry.target.classList.remove("aos-animate");
        }
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.01,
    },
  );

  document.querySelectorAll("[data-aos]").forEach((element) => observer.observe(element));
  cleanups.push(() => observer.disconnect());
  return () => cleanups.forEach((cleanup) => cleanup());
}

function initLegacyPlugins(root) {
  const cleanups = [];

  if (window.AOS) {
    window.AOS.init({
      duration: 1000,
      once: true,
    });
    window.AOS.refreshHard?.();

    [120, 450, 1000].forEach((delay) => {
      const timer = window.setTimeout(() => {
        window.AOS.refreshHard?.();
        window.AOS.refresh?.();
      }, delay);
      cleanups.push(() => window.clearTimeout(timer));
    });
  }

  const cleanupAosFallback = initAosFallback();
  if (cleanupAosFallback) cleanups.push(cleanupAosFallback);

  if (window.jarallax) {
    window.jarallax(root.querySelectorAll(".jarallax"));
    window.jarallax(root.querySelectorAll(".jarallax-img"), { keepImg: true });
  }

  if (window.Swiper) {
    root.querySelectorAll(".main-swiper").forEach((el) => {
      new window.Swiper(el, {
        loop: true,
        speed: 800,
        autoplay: { delay: 6000 },
        pagination: {
          el: ".main-slider-pagination",
          clickable: true,
        },
      });
    });

    root.querySelectorAll(".product-swiper").forEach((el) => {
      new window.Swiper(el, {
        slidesPerView: 4,
        spaceBetween: 20,
        speed: 800,
        navigation: {
          nextEl: ".product-carousel-next",
          prevEl: ".product-carousel-prev",
        },
        breakpoints: {
          0: { slidesPerView: 1 },
          576: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        },
      });
    });

    root.querySelectorAll(".testimonial-swiper").forEach((el) => {
      new window.Swiper(el, {
        loop: true,
        slidesPerView: 1,
        speed: 800,
        navigation: {
          nextEl: ".testimonial-arrow-next",
          prevEl: ".testimonial-arrow-prev",
        },
      });
    });
  }

  return () => cleanups.forEach((cleanup) => cleanup());
}

function addPageTitleLogo(html) {
  if (html.includes("page-title-logo")) {
    return html;
  }

  return html.replace(
    /(<section class="page-title[^"]*">\s*<div class="container">)/,
    '$1<a class="page-title-logo" href="/" aria-label="FORMA home"><img src="/images/logo heder 1.png" alt="FORMA"></a>',
  );
}

function removePageTitleBreadcrumbs(html) {
  return html.replace(/<section class="page-title[^"]*">[\s\S]*?<\/section>/g, (section) =>
    section.replace(/\s*<p>[\s\S]*?<\/p>/g, ""),
  );
}

export default function LegacyPage({ page, html: customHtml }) {
  const { t, language } = useLanguage();
  const sourceHtml = customHtml || t.pages[page] || legacyPages[page] || t.pages.index || legacyPages.index;
  const html = addPageTitleLogo(removePageTitleBreadcrumbs(sourceHtml));

  useEffect(() => {
    const root = document.querySelector("[data-legacy-page]");
    if (!root) return undefined;
    let cleanupPlugins;
    const timer = window.setTimeout(() => {
      cleanupPlugins = initLegacyPlugins(root);
      initQuantityControls(root);
      initVideoModal(root);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      cleanupPlugins?.();
    };
  }, [page, language, html]);

  return <div data-legacy-page={page} dangerouslySetInnerHTML={{ __html: html }} />;
}
