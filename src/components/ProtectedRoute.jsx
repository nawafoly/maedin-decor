import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function LoadingGate() {
  return (
    <main className="page-content account-page padding-large">
      <div className="container narrow-container text-center">
        <span className="title-accent fs-6 text-uppercase">FORMA</span>
        <h1>جاري التحقق من الحساب</h1>
      </div>
    </main>
  );
}

export function AdminProtectedRoute({ children }) {
  const { user, loading, isAdmin, profile } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingGate />;
  if (!user) return <Navigate to="/login.html" replace state={{ from: location }} />;
  if (profile?.accountDisabled) return <Navigate to="/login.html" replace />;
  if (!isAdmin) return <Navigate to="/account.html" replace />;

  return children;
}

export function CustomerProtectedRoute({ children }) {
  const { user, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingGate />;
  if (!user) return <Navigate to="/login.html" replace state={{ from: location }} />;
  if (profile?.accountDisabled) return <Navigate to="/login.html" replace />;

  return children;
}
