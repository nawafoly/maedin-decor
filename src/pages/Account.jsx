import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";

function timestamp(value) {
  const date = value?.toDate?.() || (value?.seconds ? new Date(value.seconds * 1000) : null);
  return date ? new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium", timeStyle: "short" }).format(date) : "-";
}

export default function Account() {
  const { user, profile, logout, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!user?.uid) return undefined;
    const subscriptions = [
      onSnapshot(query(collection(db, "orders"), where("userId", "==", user.uid)), (snapshot) => {
        setOrders(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      }),
      onSnapshot(query(collection(db, "invoices"), where("customerId", "==", user.uid)), (snapshot) => {
        setInvoices(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      }),
      onSnapshot(query(collection(db, "paymentTransactions"), where("userId", "==", user.uid)), (snapshot) => {
        setPayments(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      }),
    ];
    return () => subscriptions.forEach((unsubscribe) => unsubscribe());
  }, [user?.uid]);

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)),
    [orders],
  );

  return (
    <>
      <PageTitle title="حسابي" subtitle="FORMA Account" />
      <main className="forma-account-page" dir="rtl">
      <section className="forma-account-head">
        <div>
          <span>FORMA Account</span>
          <h1>مرحباً، {profile?.displayName || user?.email}</h1>
          <p>تابع طلبات الخدمات والمدفوعات والفواتير من مكان واحد.</p>
        </div>
        <div>
          <Link className="btn btn-dark" to="/cart.html">طلب خدمة جديدة</Link>
          {isAdmin ? <Link className="btn" to="/admin.html">لوحة الإدارة</Link> : null}
          <button className="btn" type="button" onClick={logout}>تسجيل الخروج</button>
        </div>
      </section>

      <section className="forma-account-stats">
        <article><span>الطلبات</span><strong>{orders.length}</strong></article>
        <article><span>قيد المتابعة</span><strong>{orders.filter((item) => !["مكتمل", "ملغي"].includes(item.status)).length}</strong></article>
        <article><span>المدفوعات الناجحة</span><strong>{payments.filter((item) => item.status === "paid").length}</strong></article>
        <article><span>الفواتير</span><strong>{invoices.length}</strong></article>
      </section>

      <section className="forma-account-grid">
        <div className="forma-account-panel">
          <div className="forma-account-panel__head"><span>Requests</span><h2>طلباتي</h2></div>
          <div className="forma-account-list">
            {sortedOrders.map((order) => (
              <article key={order.id}>
                <div>
                  <span>{order.packageName || order.serviceType || "طلب خدمة"}</span>
                  <h3>{order.city || order.projectType || "مشروع جديد"}</h3>
                  <p>{order.packagePrice || order.budget || "يحدد بعد مراجعة النطاق"}</p>
                </div>
                <div className="forma-account-order-meta">
                  <b>{order.status}</b>
                  <small>{timestamp(order.createdAt)}</small>
                  <code>{order.id}</code>
                </div>
              </article>
            ))}
            {!sortedOrders.length ? <p className="forma-account-empty">لا توجد طلبات بعد. ابدأ باختيار إحدى خدمات FORMA.</p> : null}
          </div>
        </div>

        <aside className="forma-account-panel">
          <div className="forma-account-panel__head"><span>Billing</span><h2>المدفوعات والفواتير</h2></div>
          <div className="forma-account-mini-list">
            {payments.map((payment) => (
              <article key={payment.id}>
                <div><b>{payment.reference || payment.id}</b><span>{payment.status}</span></div>
                <strong>{Number(payment.amount || 0).toLocaleString("ar-SA")} {payment.currency || "SAR"}</strong>
              </article>
            ))}
            {invoices.map((invoice) => (
              <article key={invoice.id}>
                <div><b>{invoice.invoiceNumber || invoice.id}</b><span>{invoice.status}</span></div>
                {invoice.pdf?.[0]?.url ? <a href={invoice.pdf[0].url} target="_blank" rel="noreferrer">عرض الفاتورة</a> : <strong>{invoice.amount || "-"} ر.س</strong>}
              </article>
            ))}
            {!payments.length && !invoices.length ? <p className="forma-account-empty">لا توجد عمليات مالية بعد.</p> : null}
          </div>
        </aside>
      </section>
      </main>
    </>
  );
}
