import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Link, useSearchParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";

const checkoutEndpoint = import.meta.env.VITE_PAYMENT_ENDPOINT
  || "https://maedin-decor.nawafoly0.workers.dev/api/payments/checkout";

function statusEndpoint(transactionId) {
  return checkoutEndpoint.replace(/\/checkout\/?$/, `/status/${transactionId}`);
}

async function parsePaymentResponse(response) {
  const text = await response.text().catch(() => "");
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json") && text.trim()) {
    try {
      return JSON.parse(text);
    } catch {
      // Fall through to the operational error below.
    }
  }

  const isHtml = /^\s*(?:<!doctype|<html)/i.test(text);
  return {
    error: isHtml
      ? "مسار الدفع يعيد صفحة الموقع بدلاً من خدمة الدفع. يجب نشر Cloudflare Worker المحدث."
      : text.trim() || `خدمة الدفع أعادت استجابة فارغة (HTTP ${response.status}).`,
  };
}

export default function Checkout() {
  const { user, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("transaction_id") || "";
  const orderId = searchParams.get("order_id") || "";
  const returnedState = searchParams.get("payment") || "";
  const [form, setForm] = useState({
    customerName: profile?.displayName || user?.displayName || "",
    phone: profile?.phone || "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [payment, setPayment] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId || !user) return;
    getDoc(doc(db, "orders", orderId))
      .then((snapshot) => {
        if (!snapshot.exists() || snapshot.data().userId !== user.uid) throw new Error("الطلب غير موجود في حسابك.");
        setOrder({ id: snapshot.id, ...snapshot.data() });
      })
      .catch((error) => setMessage(error.message));
  }, [orderId, user]);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      customerName: current.customerName || profile?.displayName || user?.displayName || "",
      phone: current.phone || profile?.phone || order?.contactPhone || "",
    }));
  }, [order?.contactPhone, profile?.displayName, profile?.phone, user?.displayName]);

  useEffect(() => {
    if (!transactionId || returnedState !== "success" || !user) return;
    let active = true;
    user.getIdToken()
      .then((token) => fetch(statusEndpoint(transactionId), { headers: { Authorization: `Bearer ${token}` } }))
      .then(async (response) => {
        const result = await parsePaymentResponse(response);
        if (!response.ok) throw new Error(result.error || "تعذر التحقق من عملية الدفع.");
        if (active) setPayment(result);
      })
      .catch((error) => { if (active) setMessage(error.message); });
    return () => { active = false; };
  }, [returnedState, transactionId, user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = await user.getIdToken();
      const response = await fetch(checkoutEndpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, orderId }),
      });
      const result = await parsePaymentResponse(response);
      if (!response.ok) throw new Error(result.error || "تعذر إنشاء رابط الدفع.");
      window.location.assign(result.url);
    } catch (error) {
      setMessage(error.message || "تعذر بدء عملية الدفع.");
      setLoading(false);
    }
  }

  if (returnedState === "success") {
    const isPaid = payment?.status === "paid";
    return (
      <>
        <PageTitle title={isPaid ? "تم الدفع" : "التحقق من الدفع"} />
        <main className="forma-checkout-page" dir="rtl">
        <section className={`forma-payment-result ${isPaid ? "is-success" : ""}`}>
          <span>{isPaid ? "تم الدفع" : "جاري التحقق"}</span>
          <h1>{isPaid ? "تم استلام دفعتك بنجاح" : "نتحقق من حالة العملية"}</h1>
          <p>{isPaid ? `المرجع: ${payment.reference}` : message || "لن نعتمد العملية حتى يؤكدها مزود الدفع."}</p>
          {isPaid ? <strong>{Number(payment.amount).toLocaleString("ar-SA")} {payment.currency}</strong> : null}
          <Link className="btn btn-dark" to="/account.html">العودة إلى حسابي</Link>
        </section>
        </main>
      </>
    );
  }

  if (!orderId) {
    return (
      <>
        <PageTitle title="الدفع" subtitle="Consultation" />
        <main className="forma-checkout-page" dir="rtl">
        <section className="forma-payment-result">
          <span>لا يوجد طلب</span>
          <h1>ابدأ باختيار الخدمة</h1>
          <p>الدفع مرتبط بطلب خدمة موثق داخل حسابك.</p>
          <Link className="btn btn-dark" to="/cart.html">الانتقال إلى صفحة الطلب</Link>
        </section>
        </main>
      </>
    );
  }

  return (
    <>
      <PageTitle title="الدفع" subtitle="Secure Payment" />
      <main className="forma-checkout-page" dir="rtl">
      <section className="forma-checkout-heading">
        <span>دفع آمن</span>
        <h1>حجز استشارة التصميم</h1>
        <p>تُحفظ تفاصيل العملية ووقتها ومرجعها في حسابك ولوحة الإدارة للرجوع إليها لاحقاً.</p>
      </section>
      <div className="forma-checkout-grid">
        <form className="forma-checkout-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="payment-name">اسم العميل</label>
            <input
              id="payment-name"
              required
              value={form.customerName}
              onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="payment-email">البريد الإلكتروني</label>
            <input id="payment-email" type="email" value={user?.email || ""} disabled />
          </div>
          <div>
            <label htmlFor="payment-phone">رقم الجوال</label>
            <input
              id="payment-phone"
              type="tel"
              required
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="payment-notes">ملاحظات الاستشارة</label>
            <textarea
              id="payment-notes"
              rows="4"
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            />
          </div>
          <button className="btn btn-dark" type="submit" disabled={loading || !order}>
            {loading ? "جاري تجهيز بوابة الدفع..." : !order ? "جاري تحميل الطلب..." : "الانتقال للدفع الآمن"}
          </button>
          {message ? <p className="forma-payment-error">{message}</p> : null}
        </form>
        <aside className="forma-payment-summary">
          <span>ملخص الطلب</span>
          <h2>{order?.packageName || "الخدمة المختارة"}</h2>
          <p>{order?.notes || "سيتم ربط الدفع بالطلب وحفظ المرجع داخل حسابك."}</p>
          <dl>
            <div><dt>المدة</dt><dd>60-90 دقيقة</dd></div>
            <div><dt>العملة</dt><dd>SAR</dd></div>
            <div><dt>الإجمالي</dt><dd>{Number(order?.packagePriceAmount || 0).toLocaleString("ar-SA")} ر.س</dd></div>
          </dl>
          <small>يتم إدخال بيانات البطاقة داخل صفحة Moyasar المستضافة، ولا يحفظ FORMA رقم البطاقة الكامل.</small>
        </aside>
      </div>
      </main>
    </>
  );
}
