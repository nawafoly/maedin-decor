import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { legacySvg } from "../data/legacyPages";
import Footer from "./Footer";
import Header from "./Header";
import LegacyVideoModal from "./LegacyVideoModal";

const internalPaths = new Set([
  "/",
  "/index.html",
  "/about.html",
  "/services.html",
  "/shop.html",
  "/single-product.html",
  "/blog.html",
  "/single-post.html",
  "/cart.html",
  "/checkout.html",
  "/login.html",
  "/admin.html",
  "/contact.html",
]);

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleLanguage } = useLanguage();

  useEffect(() => {
    const header = document.querySelector("#header");
    const onScroll = () => {
      if (!header) return;
      header.classList.toggle("sticky", window.scrollY > 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const currentHash = location.hash || window.location.hash;

    if (!currentHash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const id = decodeURIComponent(currentHash.slice(1));
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search, location.hash]);

  const runSearch = (form) => {
    const input = form?.querySelector?.('input[name="search"], input[type="text"]');
    const searchItem = form?.closest?.(".search-item");
    const query = input?.value.trim() || "";

    if (!query) {
      searchItem?.classList.add("is-searching");
      input?.focus();
      return;
    }

    navigate(`/shop.html?search=${encodeURIComponent(query)}`);
  };

  const handleClick = (event) => {
    const languageButton = event.target.closest?.("[data-language-toggle]");
    if (languageButton) {
      event.preventDefault();
      toggleLanguage();
      return;
    }

    const link = event.target.closest?.("a[href]");
    if (!event.target.closest?.("#search-bar")) {
      document.querySelectorAll(".search-item.is-searching").forEach((item) => {
        item.classList.remove("is-searching");
      });
    }
    if (!link) return;
    const href = link.getAttribute("href");

    const searchForm = link.closest?.("#search-bar form");
    if (searchForm) {
      event.preventDefault();
      runSearch(searchForm);
      return;
    }

    if (!href || href === "#" || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin || !internalPaths.has(url.pathname)) return;
    event.preventDefault();
    const offcanvas = document.querySelector(".offcanvas.show");
    if (offcanvas && window.bootstrap) {
      window.bootstrap.Offcanvas.getInstance(offcanvas)?.hide();
    }
    navigate(`${url.pathname === "/index.html" ? "/" : url.pathname}${url.search}${url.hash}`);
  };

  const handleSubmit = (event) => {
    const form = event.target.closest?.("#search-bar form");
    if (!form) return;
    event.preventDefault();
    runSearch(form);
  };

  return (
    <div onClick={handleClick} onSubmit={handleSubmit}>
      <div dangerouslySetInnerHTML={{ __html: legacySvg }} />
      <Header />
      <Outlet />
      <Footer />
      <LegacyVideoModal />
    </div>
  );
}
