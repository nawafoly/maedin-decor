import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import { LanguageProvider } from "./contexts/LanguageContext";
import About from "./pages/About";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Designs from "./pages/Designs";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProjectStory from "./pages/ProjectStory";
import Projects from "./pages/Projects";
import Request from "./pages/Request";
import ServiceDetails from "./pages/ServiceDetails";
import Services from "./pages/Services";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "index.html", element: <Navigate to="/" replace /> },
      { path: "about", element: <Navigate to="/about.html" replace /> },
      { path: "about.html", element: <About /> },
      { path: "services", element: <Navigate to="/services.html" replace /> },
      { path: "services.html", element: <Services /> },
      { path: "designs", element: <Navigate to="/shop.html" replace /> },
      { path: "shop.html", element: <Designs /> },
      { path: "single-product.html", element: <ServiceDetails /> },
      { path: "projects", element: <Navigate to="/blog.html" replace /> },
      { path: "blog.html", element: <Projects /> },
      { path: "single-post.html", element: <ProjectStory /> },
      { path: "cart.html", element: <Request /> },
      { path: "checkout.html", element: <Checkout /> },
      { path: "login.html", element: <Account /> },
      { path: "admin.html", element: <Admin /> },
      { path: "contact", element: <Navigate to="/contact.html" replace /> },
      { path: "contact.html", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  </StrictMode>,
);
