import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function messageFromError(error) {
  if (!error?.code) return error?.message || "تعذر إنشاء الحساب.";
  if (error.code.includes("email-already-in-use")) return "هذا البريد مسجل مسبقاً.";
  if (error.code.includes("weak-password")) return "كلمة المرور يجب أن تكون 6 أحرف على الأقل.";
  return "تعذر إنشاء الحساب. تحقق من البيانات وحاول مرة أخرى.";
}

export default function Register() {
  const { register, user, isAdmin, loading } = useAuth();
  const [form, setForm] = useState({ displayName: "", phone: "", email: "", password: "" });
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
      await register(form);
      navigate("/account.html", { replace: true });
    } catch (nextError) {
      setError(messageFromError(nextError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="page-title jarallax">
        <div className="container">
          <h1>إنشاء حساب</h1>
          <p>الرئيسية &gt; حساب جديد</p>
        </div>
      </section>
      <main className="page-content account-page padding-large">
        <div className="container narrow-container">
          <ul className="nav nav-tabs account-tabs justify-content-center" role="tablist">
            <li className="nav-item" role="presentation">
              <Link className="nav-link" to="/login.html">دخول</Link>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link active" type="button">حساب جديد</button>
            </li>
          </ul>
          <div className="account-tab-content">
            <form className="account-form" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="register-name">الاسم *</label>
                <input
                  id="register-name"
                  className="form-control"
                  value={form.displayName}
                  onChange={(event) => setForm({ ...form, displayName: event.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="register-phone">الجوال</label>
                <input
                  id="register-phone"
                  className="form-control"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="register-email">البريد الإلكتروني *</label>
                <input
                  id="register-email"
                  className="form-control"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="register-password">كلمة المرور *</label>
                <input
                  id="register-password"
                  className="form-control"
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  required
                />
              </div>
              {error ? <div className="admin-alert mb-3">{error}</div> : null}
              <button className="btn btn-dark w-100" type="submit" disabled={submitting}>
                {submitting ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
