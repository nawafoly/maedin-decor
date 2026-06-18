import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { uploadFiles } from "../lib/uploads";

const blankOrder = {
  orderType: "طلب عرض سعر",
  serviceType: "",
  projectType: "",
  city: "",
  budget: "",
  area: "",
  paymentMethod: "تحويل لاحق",
  notes: "",
};

export default function Account() {
  const { user, profile, logout, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState(blankOrder);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.uid) return undefined;
    const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.uid));
    const invoicesQuery = query(collection(db, "invoices"), where("customerId", "==", user.uid));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      setOrders(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
    const unsubscribeInvoices = onSnapshot(invoicesQuery, (snapshot) => {
      setInvoices(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });

    return () => {
      unsubscribeOrders();
      unsubscribeInvoices();
    };
  }, [user?.uid]);

  const stats = useMemo(
    () => [
      ["طلباتي", orders.length],
      ["الفواتير", invoices.length],
      ["قيد التنفيذ", orders.filter((order) => order.status === "قيد التنفيذ").length],
    ],
    [invoices, orders],
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const attachments = await uploadFiles(files, { folder: `customers/${user.uid}/orders`, scope: "customer" });
      await addDoc(collection(db, "orders"), {
        ...form,
        attachments,
        userId: user.uid,
        customerName: profile?.displayName || user.displayName || "",
        customerEmail: user.email,
        status: "جديد",
        updates: [{ label: "تم إنشاء الطلب", at: new Date().toISOString() }],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setForm(blankOrder);
      setFiles([]);
      setMessage("تم إرسال الطلب بنجاح.");
    } catch (error) {
      setMessage(error.message || "تعذر إرسال الطلب.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="page-title jarallax">
        <div className="container">
          <h1>حساب العميل</h1>
          <p>الرئيسية &gt; حساب العميل</p>
        </div>
      </section>
      <main className="admin-shell">
        <div className="container">
          <div className="admin-toolbar">
            <div>
              <span className="title-accent fs-6 text-uppercase">FORMA Account</span>
              <h1>{profile?.displayName || user?.email}</h1>
              <p className="admin-muted mb-0">تابع طلباتك وفواتيرك وارفع بيانات مشروعك.</p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {isAdmin ? <Link className="btn" to="/admin.html">لوحة الإدارة</Link> : null}
              <button className="btn btn-dark" type="button" onClick={logout}>تسجيل الخروج</button>
            </div>
          </div>

          <div className="admin-list account-stats">
            {stats.map(([label, value]) => (
              <article className="admin-panel account-stat" key={label}>
                <span className="admin-muted">{label}</span>
                <h2>{value}</h2>
              </article>
            ))}
          </div>

          <div className="admin-layout mt-5">
            <section className="admin-panel">
              <div className="admin-panel__head">
                <div>
                  <h2>طلب خدمة</h2>
                  <p className="admin-muted mb-0">أدخل بيانات المشروع وسيظهر الطلب للأدمن مباشرة.</p>
                </div>
              </div>
              <form className="admin-grid" onSubmit={handleSubmit}>
                <div className="admin-field">
                  <label>نوع الطلب</label>
                  <select value={form.orderType} onChange={(event) => setForm({ ...form, orderType: event.target.value })}>
                    <option>طلب عرض سعر</option>
                    <option>شراء مباشر</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>نوع الخدمة</label>
                  <input value={form.serviceType} onChange={(event) => setForm({ ...form, serviceType: event.target.value })} required />
                </div>
                <div className="admin-field">
                  <label>نوع المشروع</label>
                  <input value={form.projectType} onChange={(event) => setForm({ ...form, projectType: event.target.value })} />
                </div>
                <div className="admin-field">
                  <label>المدينة</label>
                  <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
                </div>
                <div className="admin-field">
                  <label>الميزانية</label>
                  <input value={form.budget} onChange={(event) => setForm({ ...form, budget: event.target.value })} />
                </div>
                <div className="admin-field">
                  <label>المساحة التقريبية</label>
                  <input value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} />
                </div>
                <div className="admin-field">
                  <label>طريقة الدفع</label>
                  <select value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}>
                    <option>أونلاين</option>
                    <option>كاش في المكتب</option>
                    <option>تحويل لاحق</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>مرفقات المشروع</label>
                  <input type="file" multiple onChange={(event) => setFiles(event.target.files)} />
                </div>
                <div className="admin-field admin-field--wide">
                  <label>الملاحظات</label>
                  <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
                </div>
                <div className="admin-field admin-field--wide">
                  <button className="btn btn-dark" type="submit" disabled={submitting}>
                    {submitting ? "جاري الإرسال..." : "إرسال الطلب"}
                  </button>
                  {message ? <div className="admin-alert">{message}</div> : null}
                </div>
              </form>
            </section>

            <section className="admin-panel">
              <div className="admin-panel__head">
                <div>
                  <h2>طلباتي وفواتيري</h2>
                  <p className="admin-muted mb-0">لا تظهر هنا إلا بيانات حسابك الحالي.</p>
                </div>
              </div>
              <div className="admin-list">
                {orders.map((order) => (
                  <article className="admin-item admin-item--flat" key={order.id}>
                    <div>
                      <h4>{order.serviceType || order.orderType}</h4>
                      <p>{order.city} / {order.budget} / {order.status}</p>
                      <p>{order.notes}</p>
                    </div>
                  </article>
                ))}
                {!orders.length ? <div className="admin-alert">لا توجد طلبات بعد.</div> : null}
              </div>
              <div className="admin-list mt-4">
                {invoices.map((invoice) => (
                  <article className="admin-item admin-item--flat" key={invoice.id}>
                    <div>
                      <h4>{invoice.invoiceNumber || invoice.id}</h4>
                      <p>{invoice.amount} / {invoice.status}</p>
                      {invoice.pdf?.[0]?.url ? <a href={invoice.pdf[0].url} target="_blank" rel="noreferrer">عرض الفاتورة</a> : null}
                    </div>
                  </article>
                ))}
                {!invoices.length ? <div className="admin-alert">لا توجد فواتير بعد.</div> : null}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
