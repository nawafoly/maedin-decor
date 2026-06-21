import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { db } from "../lib/firebase";
import {
  packageDescription,
  packageFeatures,
  packageName,
  subscribeRequestPackages,
} from "../lib/publicPackages";
import { uploadFiles } from "../lib/uploads";

const notificationEndpoint = import.meta.env.VITE_ORDER_NOTIFICATION_ENDPOINT
  || "https://maedin-decor.nawafoly0.workers.dev/api/notifications/order-created";

const initialForm = {
  projectType: "سكني",
  city: "",
  area: "",
  budget: "",
  preferredStart: "",
  contactPhone: "",
  notes: "",
};

async function notifyOrder(user, orderId) {
  const token = await user.getIdToken();
  const response = await fetch(notificationEndpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  });
  const text = await response.text().catch(() => "");
  const payload = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(payload.error || "تعذر إرسال إشعار الطلب.");
  return payload;
}

export default function Request() {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [selectedId, setSelectedId] = useState(searchParams.get("package") || "");
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => subscribeRequestPackages(setPackages, console.error), []);

  useEffect(() => {
    if (!selectedId && packages.length) setSelectedId(packages[0].id);
  }, [packages, selectedId]);

  useEffect(() => {
    if (profile?.phone) setForm((current) => ({ ...current, contactPhone: current.contactPhone || profile.phone }));
  }, [profile?.phone]);

  const selectedPackage = useMemo(
    () => packages.find((item) => item.id === selectedId) || packages[0],
    [packages, selectedId],
  );

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!user || !selectedPackage) return;
    setSubmitting(true);
    setMessage("");

    try {
      const attachments = await uploadFiles(files, {
        folder: `customers/${user.uid}/orders`,
        scope: "customer",
      });
      const order = await addDoc(collection(db, "orders"), {
        ...form,
        attachments,
        userId: user.uid,
        customerName: profile?.displayName || user.displayName || "",
        customerEmail: user.email || "",
        packageId: selectedPackage.id,
        packageCode: selectedPackage.code || selectedPackage.id,
        packageName: packageName(selectedPackage, "ar"),
        packagePrice: selectedPackage.price || "",
        packagePriceAmount: Number(selectedPackage.priceAmount || 0),
        requiresPayment: Boolean(selectedPackage.requiresPayment),
        orderType: selectedPackage.requiresPayment ? "شراء خدمة" : "طلب خدمة ومراجعة نطاق",
        serviceType: packageName(selectedPackage, "ar"),
        paymentMethod: selectedPackage.requiresPayment ? "أونلاين" : "بعد مراجعة النطاق",
        paymentStatus: selectedPackage.requiresPayment ? "بانتظار الدفع" : "غير مطلوب حالياً",
        status: selectedPackage.requiresPayment ? "بانتظار الدفع" : "جديد",
        updates: [{ label: "تم إنشاء الطلب", at: new Date().toISOString() }],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      let notificationWarning = "";
      try {
        const notification = await notifyOrder(user, order.id);
        if (notification.configured === false) notificationWarning = " تم حفظ الطلب، وإشعارات البريد بانتظار تفعيل Resend.";
      } catch (error) {
        notificationWarning = ` تم حفظ الطلب، لكن تعذر إرسال البريد: ${error.message}`;
      }

      if (selectedPackage.requiresPayment) {
        navigate(`/checkout.html?order_id=${order.id}`);
        return;
      }

      setMessage(`تم إرسال طلبك بنجاح. المرجع: ${order.id}.${notificationWarning}`);
      setForm({ ...initialForm, contactPhone: profile?.phone || "" });
      setFiles([]);
    } catch (error) {
      setMessage(error.message || "تعذر إرسال الطلب.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageTitle title="طلب خدمة" subtitle="Start Your Project" />
      <main className="forma-request-page" dir="rtl">
      <section className="forma-request-hero">
        <div>
          <span>خدمات FORMA</span>
          <h1>ابدأ مشروعك بخطوة واضحة</h1>
          <p>اختر مستوى الخدمة المناسب، ثم أرسل معلومات المساحة. التصاميم المعروضة في الموقع للإلهام والعرض؛ الطلب الفعلي يتم من خلال خدماتنا الثلاث.</p>
        </div>
        <ol>
          <li><b>01</b><span>اختر الخدمة</span></li>
          <li><b>02</b><span>عرّف المشروع</span></li>
          <li><b>03</b><span>أرسل وابدأ</span></li>
        </ol>
      </section>

      <section className="forma-request-section">
        <div className="forma-request-section__head">
          <span>الخطوة الأولى</span>
          <h2>اختر الباقة المناسبة</h2>
        </div>
        <div className="forma-request-packages">
          {packages.map((item, index) => {
            const selected = selectedPackage?.id === item.id;
            return (
              <button
                className={`forma-request-package ${selected ? "is-selected" : ""}`}
                type="button"
                onClick={() => setSelectedId(item.id)}
                key={item.id}
              >
                <span className="forma-request-package__number">0{index + 1}</span>
                <small>{item.label || (item.requiresPayment ? "حجز مباشر" : "حسب نطاق المشروع")}</small>
                <h3>{packageName(item, language)}</h3>
                <p>{packageDescription(item, language)}</p>
                <ul>{packageFeatures(item).slice(0, 5).map((feature) => <li key={feature}>{feature}</li>)}</ul>
                <div>
                  <strong>{item.price || "تسعير حسب النطاق"}</strong>
                  <em>{item.duration || "يحدد بعد المراجعة"}</em>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="forma-request-builder">
        <div className="forma-request-section__head">
          <span>الخطوة الثانية</span>
          <h2>عرّفنا على مشروعك</h2>
          <p>هذه المعلومات تساعدنا على تأكيد النطاق والمدة والخطوة التالية بدون مراسلات متكررة.</p>
        </div>

        {!user ? (
          <div className="forma-request-login">
            <h3>سجّل الدخول لإرسال الطلب</h3>
            <p>سيُحفظ الطلب والمرفقات والتحديثات داخل حسابك للرجوع إليها لاحقاً.</p>
            <div>
              <Link className="btn btn-dark" to="/login.html" state={{ from: { pathname: "/cart.html" } }}>تسجيل الدخول</Link>
              <Link className="btn" to="/register.html">إنشاء حساب</Link>
            </div>
          </div>
        ) : (
          <form className="forma-request-form" onSubmit={handleSubmit}>
            <div className="forma-request-form__fields">
              <label>
                <span>نوع المشروع</span>
                <select value={form.projectType} onChange={(event) => updateField("projectType", event.target.value)}>
                  <option>سكني</option><option>تجاري</option><option>ضيافة</option><option>مكتب</option><option>أخرى</option>
                </select>
              </label>
              <label>
                <span>المدينة</span>
                <input required value={form.city} onChange={(event) => updateField("city", event.target.value)} placeholder="مثال: الرياض" />
              </label>
              <label>
                <span>المساحة التقريبية</span>
                <input value={form.area} onChange={(event) => updateField("area", event.target.value)} placeholder="مثال: 250 م²" />
              </label>
              <label>
                <span>الميزانية المتوقعة</span>
                <input value={form.budget} onChange={(event) => updateField("budget", event.target.value)} placeholder="نطاق تقريبي بالريال" />
              </label>
              <label>
                <span>موعد البدء المناسب</span>
                <input type="date" value={form.preferredStart} onChange={(event) => updateField("preferredStart", event.target.value)} />
              </label>
              <label>
                <span>رقم التواصل</span>
                <input required type="tel" value={form.contactPhone} onChange={(event) => updateField("contactPhone", event.target.value)} />
              </label>
              <label className="is-wide">
                <span>تفاصيل المشروع والنتيجة التي تبحث عنها</span>
                <textarea required rows="5" value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="اشرح المساحات، الاحتياج، الأسلوب، وأي ملاحظات مهمة." />
              </label>
              <label className="is-wide forma-request-upload">
                <span>المخططات والصور المرجعية</span>
                <input type="file" multiple accept="image/*,.pdf,.dwg" onChange={(event) => setFiles(event.target.files)} />
                <small>{files.length ? `${files.length} ملف محدد` : "يمكن إرفاق صور، PDF أو مخططات."}</small>
              </label>
            </div>

            <aside className="forma-request-review">
              <span>ملخص الطلب</span>
              <h3>{selectedPackage ? packageName(selectedPackage, language) : "اختر باقة"}</h3>
              <p>{selectedPackage?.price || "تسعير حسب النطاق"}</p>
              <dl>
                <div><dt>نوع المشروع</dt><dd>{form.projectType}</dd></div>
                <div><dt>المدينة</dt><dd>{form.city || "-"}</dd></div>
                <div><dt>المسار التالي</dt><dd>{selectedPackage?.requiresPayment ? "الدفع الآمن" : "مراجعة النطاق"}</dd></div>
              </dl>
              <button className="btn btn-dark" type="submit" disabled={submitting || !selectedPackage}>
                {submitting ? "جاري حفظ الطلب..." : selectedPackage?.requiresPayment ? "إنشاء الطلب والمتابعة للدفع" : "إرسال الطلب للمراجعة"}
              </button>
              <small>بالإرسال سيتم إنشاء مرجع للطلب وإظهاره في حسابك ولوحة الإدارة.</small>
              {message ? <div className="forma-request-message">{message}</div> : null}
            </aside>
          </form>
        )}
      </section>
      </main>
    </>
  );
}
