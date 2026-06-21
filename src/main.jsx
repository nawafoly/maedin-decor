import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import { AdminProtectedRoute, CustomerProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import About from "./pages/About";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Designs from "./pages/Designs";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProjectStory from "./pages/ProjectStory";
import Projects from "./pages/Projects";
import Register from "./pages/Register";
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
      { path: "checkout.html", element: <CustomerProtectedRoute><Checkout /></CustomerProtectedRoute> },
      { path: "login.html", element: <Login /> },
      { path: "register.html", element: <Register /> },
      { path: "account.html", element: <CustomerProtectedRoute><Account /></CustomerProtectedRoute> },
      { path: "admin.html", element: <AdminProtectedRoute><Admin /></AdminProtectedRoute> },
      { path: "contact", element: <Navigate to="/contact.html" replace /> },
      { path: "contact.html", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>,
);
