import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function messageFromError(error) {
  if (!error?.code) return error?.message || "تعذر تسجيل الدخول.";
  if (error.code.includes("invalid-credential")) return "بيانات الدخول غير صحيحة.";
  if (error.code.includes("too-many-requests")) return "تم إيقاف المحاولة مؤقتاً. حاول لاحقاً.";
  return "تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور.";
}

export default function Login() {
  const { login, user, isAdmin, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!loading && user) {
    return <Navigate to={isAdmin ? "/admin.html" : "/account.html"} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await login(form.email, form.password);
      const role = result.profile?.role || result.role;
      const isAdminRole = role === "admin" || role === "owner";
      const destination = isAdminRole ? "/admin.html" : "/account.html";
      navigate(destination, { replace: true });
    } catch (nextError) {
      if (import.meta.env.DEV) {
        console.error("Firebase login error:", nextError);
      }
      setError(messageFromError(nextError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="page-title jarallax">
        <div className="container">
          <h1>تسجيل الدخول</h1>
          <p>الرئيسية &gt; تسجيل الدخول</p>
        </div>
      </section>
      <main className="page-content account-page padding-large">
        <div className="container narrow-container">
          <ul className="nav nav-tabs account-tabs justify-content-center" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" type="button">دخول</button>
            </li>
            <li className="nav-item" role="presentation">
              <Link className="nav-link" to="/register.html">حساب جديد</Link>
            </li>
          </ul>
          <div className="account-tab-content">
            <form className="account-form" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="login-email">البريد الإلكتروني *</label>
                <input
                  id="login-email"
                  className="form-control"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="login-password">كلمة المرور *</label>
                <input
                  id="login-password"
                  className="form-control"
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  required
                />
              </div>
              {error ? <div className="admin-alert mb-3">{error}</div> : null}
              <button className="btn btn-dark w-100" type="submit" disabled={submitting}>
                {submitting ? "جاري الدخول..." : "تسجيل الدخول"}
              </button>
              <Link className="btn admin-direct-link w-100 mt-3" to="/register.html">
                إنشاء حساب عميل
              </Link>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
