import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  adminSections,
  importExistingSiteData,
  invoiceStatuses,
  orderStatuses,
  removeAdminDocument,
  saveAdminDocument,
  saveUserProfile,
  subscribeCollection,
} from "../lib/firestoreAdmin";
import { uploadFiles } from "../lib/uploads";

const sectionMap = Object.fromEntries(adminSections.map((section) => [section.key, section]));
const primarySections = ["projects", "designs", "services", "packages"];
const operationsSections = ["orders", "users", "invoices", "uploadsMetadata"];
const contentSections = ["siteSettings", "settings"];

const sectionIcons = {
  projects: "مش",
  designs: "تص",
  services: "خد",
  packages: "با",
  orders: "طل",
  users: "عم",
  invoices: "فو",
  uploadsMetadata: "مل",
  siteSettings: "مح",
  settings: "إع",
};

function emptyForm(section) {
  return Object.fromEntries(
    section.fields.map(([name, , type, options]) => {
      if (type === "checkbox") return [name, false];
      if (type === "files") return [name, []];
      if (type === "select") return [name, options?.[0] || ""];
      return [name, ""];
    }),
  );
}

function fieldLabel(section, key) {
  return section.fields.find(([name]) => name === key)?.[1] || key;
}

function formatDate(value) {
  const date = value?.toDate?.() || (value?.seconds ? new Date(value.seconds * 1000) : null);
  if (!date) return "غير محدد";
  return new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function numericAmount(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function money(value) {
  return `${numericAmount(value).toLocaleString("en-US")} ر.س`;
}

function primaryTitle(item) {
  return (
    item.titleAr ||
    item.nameAr ||
    item.displayName ||
    item.customerName ||
    item.invoiceNumber ||
    item.key ||
    item.name ||
    item.email ||
    item.id
  );
}

function secondaryText(item) {
  return (
    item.descriptionAr ||
    item.description ||
    item.notes ||
    item.customerEmail ||
    item.email ||
    item.url ||
    ""
  );
}

function imageFromItem(item) {
  const image = item.images?.[0]?.url || item.attachments?.[0]?.url || item.pdf?.[0]?.url || item.heroImage;
  return image || "/images/product-item1.avif";
}

function statusOf(item) {
  if (item.accountDisabled) return "معطل";
  return item.status || item.role || item.paymentStatus || "نشط";
}

function statusTone(status) {
  if (["منشور", "مدفوع", "مدفوعة", "مكتمل", "admin", "owner", "نشط"].includes(status)) return "good";
  if (["جديد", "مرسلة", "بانتظار المراجعة", "بانتظار الدفع"].includes(status)) return "warn";
  if (["مخفي", "ملغي", "ملغية", "غير مدفوعة", "معطل"].includes(status)) return "danger";
  return "neutral";
}

function searchableText(item) {
  return Object.values(item)
    .flatMap((value) => (Array.isArray(value) ? value.map((entry) => JSON.stringify(entry)) : [value]))
    .join(" ")
    .toLowerCase();
}

function tableColumns(section) {
  const map = {
    projects: ["projectType", "city"],
    designs: ["designType", "price"],
    services: ["price", "priceFrom"],
    packages: ["price", "bestFor"],
    orders: ["serviceType", "city"],
    users: ["email", "role"],
    invoices: ["customerEmail", "amount"],
    uploadsMetadata: ["scope", "type"],
    siteSettings: ["key", "heroTitle"],
    settings: ["brand", "currency"],
  };
  return map[section.key] || section.fields.slice(0, 6).map(([name]) => name);
}

function displayValue(value) {
  if (typeof value === "boolean") return value ? "نعم" : "لا";
  if (Array.isArray(value)) return value.length ? `${value.length} عنصر` : "-";
  if (value === undefined || value === null || value === "") return "-";
  return String(value);
}

function parseFieldValue(type, value) {
  if (type === "number") return value === "" ? "" : Number(value);
  if (type === "textarea" && typeof value === "string") return value.trim();
  return value;
}

function Field({ field, value, onChange, onFiles }) {
  const [name, label, type, options] = field;

  if (type === "textarea") {
    return (
      <div className="forma-admin-field forma-admin-field--wide">
        <label htmlFor={name}>{label}</label>
        <textarea id={name} value={value || ""} onChange={(event) => onChange(name, event.target.value)} />
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className="forma-admin-field">
        <label htmlFor={name}>{label}</label>
        <select id={name} value={value || options?.[0] || ""} onChange={(event) => onChange(name, event.target.value)}>
          {(options || []).map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
    );
  }

  if (type === "checkbox") {
    return (
      <label className="forma-admin-toggle">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(name, event.target.checked)} />
        <span>{label}</span>
      </label>
    );
  }

  if (type === "files") {
    return (
      <div className="forma-admin-field forma-admin-field--wide">
        <label htmlFor={name}>{label}</label>
        <input id={name} type="file" multiple onChange={(event) => onFiles(name, event.target.files)} />
        {Array.isArray(value) && value.length ? (
          <div className="forma-admin-files">
            {value.map((file) => (
              <a href={file.url} target="_blank" rel="noreferrer" key={file.key || file.url}>
                {file.name || file.key || file.url}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="forma-admin-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(name, event.target.value)}
      />
    </div>
  );
}

function SidebarGroup({ title, keys, active, onChange, counts }) {
  return (
    <div className="forma-sidebar-group">
      <span>{title}</span>
      {keys.map((key) => {
        const section = sectionMap[key];
        if (!section) return null;
        return (
          <button
            type="button"
            className={active === key ? "is-active" : ""}
            onClick={() => onChange(key)}
            key={key}
          >
            <b>{sectionIcons[key]}</b>
            <em>{section.title}</em>
            <small>{counts[key] ?? 0}</small>
          </button>
        );
      })}
    </div>
  );
}

function MetricCard({ label, value, detail, tone = "neutral" }) {
  return (
    <article className={`forma-metric-card is-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function MiniStat({ label, value, detail, tone = "neutral" }) {
  return (
    <article className={`forma-mini-stat is-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function DashboardOverview({ data, onSeed, seedState }) {
  const users = data.users || [];
  const orders = data.orders || [];
  const invoices = data.invoices || [];
  const uploads = data.uploadsMetadata || [];
  const revenue = invoices
    .filter((invoice) => ["مدفوعة", "مدفوع"].includes(invoice.status))
    .reduce((sum, invoice) => sum + numericAmount(invoice.amount), 0);
  const invoiceTotal = invoices.reduce((sum, invoice) => sum + numericAmount(invoice.amount), 0);
  const publicItems = ["projects", "designs", "services", "packages"].reduce(
    (sum, key) => sum + (data[key] || []).filter((item) => item.status === "منشور").length,
    0,
  );

  const metrics = [
    ["العملاء", users.filter((item) => item.role === "customer").length, "حسابات العملاء النشطة", "good"],
    ["الطلبات", orders.length, "كل الطلبات المسجلة", "neutral"],
    ["طلبات جديدة", orders.filter((item) => item.status === "جديد").length, "تحتاج مراجعة", "warn"],
    ["قيد التنفيذ", orders.filter((item) => item.status === "قيد التنفيذ").length, "مشاريع فعالة", "neutral"],
    ["مكتملة", orders.filter((item) => item.status === "مكتمل").length, "طلبات منتهية", "good"],
    ["إجمالي الفواتير", money(invoiceTotal), "قيمة كل الفواتير", "neutral"],
    ["الإيرادات", money(revenue), "فواتير مدفوعة", "good"],
    ["ملفات R2", uploads.length, "صور ومستندات", "neutral"],
  ];

  const activities = [...orders, ...invoices, ...uploads]
    .sort((a, b) => (b.updatedAt?.seconds || b.createdAt?.seconds || 0) - (a.updatedAt?.seconds || a.createdAt?.seconds || 0))
    .slice(0, 8);

  return (
    <div className="forma-dashboard-stack">
      <section className="forma-hero-panel">
        <div>
          <span>FORMA Decor Admin</span>
          <h1>مركز تشغيل الشركة</h1>
          <p>متابعة العملاء والطلبات والفواتير والمحتوى المنشور من مكان واحد.</p>
        </div>
        <div className="forma-hero-actions">
          <button className="forma-admin-primary" type="button" onClick={onSeed} disabled={seedState.loading}>
            {seedState.loading ? "جاري الاستيراد..." : "استيراد البيانات الحالية"}
          </button>
          <small>{seedState.message || `${publicItems} عنصر منشور في Firestore`}</small>
        </div>
      </section>

      <section className="forma-metrics-grid">
        {metrics.map(([label, value, detail, tone]) => (
          <MetricCard label={label} value={value} detail={detail} tone={tone} key={label} />
        ))}
      </section>

      <section className="forma-dashboard-grid">
        <div className="forma-admin-card">
          <div className="forma-card-head">
            <div>
              <span>Pipeline</span>
              <h2>حالة الطلبات</h2>
            </div>
          </div>
          <div className="forma-status-bars">
            {orderStatuses.map((status) => {
              const count = orders.filter((order) => order.status === status).length;
              const width = orders.length ? Math.max(8, Math.round((count / orders.length) * 100)) : 0;
              return (
                <div className="forma-status-row" key={status}>
                  <span>{status}</span>
                  <div><i style={{ width: `${width}%` }} /></div>
                  <b>{count}</b>
                </div>
              );
            })}
          </div>
        </div>

        <div className="forma-admin-card">
          <div className="forma-card-head">
            <div>
              <span>Activity</span>
              <h2>آخر النشاطات</h2>
            </div>
          </div>
          <div className="forma-activity-list">
            {activities.map((item) => (
              <article key={`${item.id}-${item.updatedAt?.seconds || item.createdAt?.seconds || ""}`}>
                <b>{primaryTitle(item)}</b>
                <span>{statusOf(item)} / {formatDate(item.updatedAt || item.createdAt)}</span>
              </article>
            ))}
            {!activities.length ? <p className="forma-empty">لا توجد نشاطات بعد.</p> : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function DetailsPanel({ item, section, data, onClose }) {
  if (!item) return null;
  const orders = (data.orders || []).filter((order) => order.userId === item.id || order.customerEmail === item.email);
  const invoices = (data.invoices || []).filter((invoice) => invoice.customerId === item.id || invoice.customerEmail === item.email);
  const files = (data.uploadsMetadata || []).filter((file) => file.userId === item.id || file.userEmail === item.email);

  return (
    <aside className="forma-details-panel">
      <div className="forma-card-head">
        <div>
          <span>{section.title}</span>
          <h2>{primaryTitle(item)}</h2>
        </div>
        <button type="button" onClick={onClose}>إغلاق</button>
      </div>
      <img src={imageFromItem(item)} alt="" />
      <dl>
        {Object.entries(item).slice(0, 18).map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{displayValue(value)}</dd>
          </div>
        ))}
      </dl>
      {section.collectionName === "users" ? (
        <div className="forma-related-blocks">
          <article><strong>{orders.length}</strong><span>طلبات العميل</span></article>
          <article><strong>{invoices.length}</strong><span>فواتير العميل</span></article>
          <article><strong>{files.length}</strong><span>ملفات العميل</span></article>
        </div>
      ) : null}
    </aside>
  );
}

function SectionPanel({ section, items, data, user, draft, onDraftUsed, onCreateInvoice }) {
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(() => emptyForm(section));
  const [pendingFiles, setPendingFiles] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("updated");
  const [details, setDetails] = useState(null);

  useEffect(() => {
    setEditingId("");
    setForm(emptyForm(section));
    setPendingFiles({});
    setMessage("");
    setQuery("");
    setFilter("all");
    setDetails(null);
  }, [section]);

  useEffect(() => {
    if (!draft || draft.sectionKey !== section.key) return;
    setEditingId("");
    setForm({ ...emptyForm(section), ...draft.payload });
    setPendingFiles({});
    onDraftUsed();
  }, [draft, onDraftUsed, section]);

  const columns = tableColumns(section);
  const statuses = useMemo(() => {
    const values = new Set(items.map((item) => statusOf(item)).filter(Boolean));
    return ["all", ...values];
  }, [items]);

  const filteredItems = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    return items
      .filter((item) => (filter === "all" ? true : statusOf(item) === filter))
      .filter((item) => (lowerQuery ? searchableText(item).includes(lowerQuery) : true))
      .sort((a, b) => {
        if (sort === "sortOrder") return numericAmount(a.sortOrder) - numericAmount(b.sortOrder);
        if (sort === "title") return primaryTitle(a).localeCompare(primaryTitle(b), "ar");
        return (b.updatedAt?.seconds || b.createdAt?.seconds || 0) - (a.updatedAt?.seconds || a.createdAt?.seconds || 0);
      });
  }, [filter, items, query, sort]);

  const sectionStats = useMemo(() => {
    const published = items.filter((item) => ["منشور", "نشط", "مدفوعة", "مدفوع", "مكتمل"].includes(statusOf(item))).length;
    const needsReview = items.filter((item) => ["جديد", "مرسلة", "بانتظار المراجعة", "بانتظار الدفع", "غير مدفوعة"].includes(statusOf(item))).length;
    const hidden = items.filter((item) => ["مخفي", "معطل", "ملغي", "ملغية"].includes(statusOf(item))).length;
    const files = items.reduce((sum, item) => {
      const itemFiles = ["images", "attachments", "pdf"].reduce((count, key) => count + (Array.isArray(item[key]) ? item[key].length : 0), 0);
      return sum + itemFiles;
    }, 0);

    return [
      ["إجمالي السجلات", items.length, "داخل هذا القسم", "neutral"],
      ["المعروض الآن", filteredItems.length, query || filter !== "all" ? "بعد البحث والفلترة" : "بدون فلترة", "good"],
      ["جاهز/نشط", published, "منشور أو مكتمل", "good"],
      [
        needsReview ? "بحاجة متابعة" : hidden ? "مخفية/متوقفة" : "ملفات مرتبطة",
        needsReview || hidden || files,
        needsReview ? "طلبات أو فواتير مفتوحة" : hidden ? "عناصر غير ظاهرة" : "صور ومستندات",
        needsReview ? "warn" : hidden ? "danger" : "neutral",
      ],
    ];
  }, [filter, filteredItems.length, items, query]);

  function editItem(item) {
    setEditingId(item.id);
    setForm({ ...emptyForm(section), ...item });
    setPendingFiles({});
    setDetails(null);
  }

  async function togglePublish(item) {
    if (!["projects", "designs", "services", "packages"].includes(section.key)) return;
    const nextStatus = item.status === "منشور" ? "مخفي" : "منشور";
    await saveAdminDocument(section, { status: nextStatus }, item.id, user);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (section.readOnly) return;
    setSaving(true);
    setMessage("");

    try {
      const payload = {};
      for (const [name, , type] of section.fields) {
        if (type === "files") {
          const uploaded = await uploadFiles(pendingFiles[name], {
            folder: `admin/${section.collectionName}`,
            scope: "admin",
          });
          payload[name] = [...(Array.isArray(form[name]) ? form[name] : []), ...uploaded];
        } else if (name === "featuresText") {
          payload.features = String(form[name] || "").split(/\r?\n/).map((entry) => entry.trim()).filter(Boolean);
          payload[name] = form[name] || "";
        } else {
          payload[name] = parseFieldValue(type, form[name]);
        }
      }

      if (section.collectionName === "users" && editingId) {
        await saveUserProfile(editingId, payload);
      } else {
        await saveAdminDocument(section, payload, editingId, user);
      }

      setEditingId("");
      setForm(emptyForm(section));
      setPendingFiles({});
      setMessage("تم الحفظ بنجاح.");
    } catch (error) {
      console.error("Admin save error:", error);
      setMessage(error.message || "تعذر الحفظ.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm("هل تريد حذف هذا العنصر؟")) return;
    try {
      await removeAdminDocument(section.collectionName, item.id);
      setMessage("تم الحذف.");
    } catch (error) {
      console.error("Admin delete error:", error);
      setMessage(error.message || "تعذر الحذف.");
    }
  }

  return (
    <div className="forma-section-grid">
      <section className="forma-admin-card forma-section-main">
        <div className="forma-section-head">
          <div>
            <span>{section.description}</span>
            <h1>{section.title}</h1>
          </div>
          <div className="forma-section-actions">
            <button className="forma-admin-secondary" type="button" onClick={() => { setEditingId(""); setForm(emptyForm(section)); }}>
              إضافة
            </button>
          </div>
        </div>

        <div className="forma-section-stats">
          {sectionStats.map(([label, value, detail, tone]) => (
            <MiniStat label={label} value={value} detail={detail} tone={tone} key={label} />
          ))}
        </div>

        <div className="forma-table-toolbar">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="بحث سريع..." />
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            {statuses.map((status) => <option value={status} key={status}>{status === "all" ? "كل الحالات" : status}</option>)}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="updated">الأحدث</option>
            <option value="title">الاسم</option>
            <option value="sortOrder">ترتيب الظهور</option>
          </select>
        </div>

        <div className="forma-record-list">
          {filteredItems.map((item) => (
            <article className="forma-record-card" key={item.id}>
              <button className="forma-row-title" type="button" onClick={() => setDetails(item)}>
                <img src={imageFromItem(item)} alt="" />
                <span>
                  <b>{primaryTitle(item)}</b>
                  <small>{secondaryText(item)}</small>
                </span>
              </button>

              <div className="forma-record-meta">
                {columns.map((column) => (
                  <div key={column}>
                    <span>{fieldLabel(section, column)}</span>
                    <b>{displayValue(item[column])}</b>
                  </div>
                ))}
              </div>

              <div className="forma-record-status">
                <span className={`forma-status is-${statusTone(statusOf(item))}`}>{statusOf(item)}</span>
              </div>

              <div className="forma-row-actions">
                <button type="button" onClick={() => editItem(item)}>تعديل</button>
                {["projects", "designs", "services", "packages"].includes(section.key) ? (
                  <button type="button" onClick={() => togglePublish(item)}>
                    {item.status === "منشور" ? "إخفاء" : "نشر"}
                  </button>
                ) : null}
                {section.key === "orders" ? (
                  <button type="button" onClick={() => onCreateInvoice(item)}>فاتورة</button>
                ) : null}
                {section.collectionName !== "users" && !section.readOnly ? (
                  <button className="is-danger" type="button" onClick={() => handleDelete(item)}>حذف</button>
                ) : null}
              </div>
            </article>
          ))}
          {!filteredItems.length ? <p className="forma-empty">لا توجد بيانات مطابقة.</p> : null}
        </div>
      </section>

      <aside className="forma-admin-card forma-editor-card">
        <div className="forma-card-head">
          <div>
            <span>{editingId ? "Edit" : "Create"}</span>
            <h2>{editingId ? "تعديل العنصر" : "إضافة عنصر"}</h2>
            <p>{section.readOnly ? "سجل للمتابعة والمراجعة فقط." : "حدّث البيانات ثم احفظها مباشرة في Firestore."}</p>
          </div>
        </div>
        {!section.readOnly ? (
          <form className="forma-admin-form" onSubmit={handleSubmit}>
            {section.fields.map((field) => (
              <Field
                key={field[0]}
                field={field}
                value={form[field[0]]}
                onChange={(name, value) => setForm((current) => ({ ...current, [name]: value }))}
                onFiles={(name, value) => setPendingFiles((current) => ({ ...current, [name]: value }))}
              />
            ))}
            <button className="forma-admin-primary" type="submit" disabled={saving}>
              {saving ? "جاري الحفظ..." : editingId ? "حفظ التعديل" : "حفظ العنصر"}
            </button>
            {message ? <div className="forma-form-message">{message}</div> : null}
          </form>
        ) : (
          <p className="forma-empty">هذا القسم للعرض فقط، ويتم تحديثه تلقائياً من عمليات الرفع إلى R2.</p>
        )}
      </aside>

      {details ? <DetailsPanel item={details} section={section} data={data} onClose={() => setDetails(null)} /> : null}
    </div>
  );
}

export default function Admin() {
  const { user, profile, logout } = useAuth();
  const [active, setActive] = useState("overview");
  const [data, setData] = useState({});
  const [quickSearch, setQuickSearch] = useState("");
  const [seedState, setSeedState] = useState({ loading: false, message: "" });
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    const uniqueCollections = [...new Set(adminSections.map((section) => section.collectionName))];
    const unsubscribers = uniqueCollections.map((collectionName) =>
      subscribeCollection(collectionName, (items) => {
        setData((current) => ({ ...current, [collectionName]: items }));
      }),
    );
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);

  const activeSection = sectionMap[active];
  const activeItems = useMemo(
    () => (activeSection ? data[activeSection.collectionName] || [] : []),
    [activeSection, data],
  );
  const sectionCounts = useMemo(
    () => Object.fromEntries(adminSections.map((section) => [section.key, (data[section.collectionName] || []).length])),
    [data],
  );
  const newOrders = (data.orders || []).filter((order) => order.status === "جديد").length;
  const unpaidInvoices = (data.invoices || []).filter((invoice) => ["غير مدفوعة", "مرسلة"].includes(invoice.status)).length;

  async function handleSeed() {
    setSeedState({ loading: true, message: "" });
    try {
      const count = await importExistingSiteData(user);
      setSeedState({ loading: false, message: `تم استيراد ${count} سجل إلى Firestore.` });
    } catch (error) {
      console.error("Seed import error:", error);
      setSeedState({ loading: false, message: error.message || "تعذر استيراد البيانات." });
    }
  }

  function handleCreateInvoice(order) {
    setActive("invoices");
    setDraft({
      sectionKey: "invoices",
      payload: {
        customerId: order.userId || "",
        customerEmail: order.customerEmail || "",
        orderId: order.id,
        amount: "",
        status: invoiceStatuses[0],
        paymentMethod: order.paymentMethod || "تحويل",
        description: `فاتورة مرتبطة بطلب ${order.serviceType || order.orderType || order.id}`,
      },
    });
  }

  return (
    <main className="forma-admin-shell" dir="rtl">
      <aside className="forma-admin-sidebar">
        <Link className="forma-admin-brand" to="/">
          <img src="/images/Logo only 1.png" alt="FORMA" />
          <span>
            <b>FORMA</b>
            <small>Decor Operations</small>
          </span>
        </Link>
        <button className={active === "overview" ? "is-active" : ""} type="button" onClick={() => setActive("overview")}>
          <b>OV</b>
          <em>نظرة عامة</em>
          <small>{newOrders + unpaidInvoices}</small>
        </button>
        <SidebarGroup title="المحتوى التجاري" keys={primarySections} active={active} onChange={setActive} counts={sectionCounts} />
        <SidebarGroup title="العمليات" keys={operationsSections} active={active} onChange={setActive} counts={sectionCounts} />
        <SidebarGroup title="الموقع" keys={contentSections} active={active} onChange={setActive} counts={sectionCounts} />
      </aside>

      <section className="forma-admin-workspace">
        <header className="forma-admin-topbar">
          <div className="forma-topbar-search">
            <span>بحث</span>
            <input
              value={quickSearch}
              onChange={(event) => setQuickSearch(event.target.value)}
              placeholder="ابحث في العملاء، الطلبات، الفواتير..."
            />
          </div>
          <div className="forma-topbar-actions">
            <div className="forma-notifications">
              <span>{newOrders + unpaidInvoices}</span>
              <small>تنبيهات</small>
            </div>
            <Link className="forma-admin-secondary" to="/">عرض الموقع</Link>
            <button className="forma-admin-secondary" type="button" onClick={logout}>تسجيل خروج</button>
            <div className="forma-admin-user">
              <b>{profile?.displayName || user?.email}</b>
              <span>{profile?.role || "admin"}</span>
            </div>
          </div>
        </header>

        {quickSearch ? (
          <div className="forma-quick-results">
            {adminSections
              .flatMap((section) => (data[section.collectionName] || []).map((item) => ({ section, item })))
              .filter(({ item }) => searchableText(item).includes(quickSearch.toLowerCase()))
              .slice(0, 8)
              .map(({ section, item }) => (
                <button type="button" key={`${section.key}-${item.id}`} onClick={() => { setActive(section.key); setQuickSearch(""); }}>
                  <span>{section.title}</span>
                  <b>{primaryTitle(item)}</b>
                </button>
              ))}
          </div>
        ) : null}

        {active === "overview" ? (
          <DashboardOverview data={data} onSeed={handleSeed} seedState={seedState} />
        ) : (
          <SectionPanel
            section={activeSection}
            items={activeItems}
            data={data}
            user={user}
            draft={draft}
            onDraftUsed={() => setDraft(null)}
            onCreateInvoice={handleCreateInvoice}
          />
        )}
      </section>
    </main>
  );
}
