(function() {
  "use strict";

  if (!window.FormaStore) return;

  const I18N = window.FormaI18n || {
    lang: function() { return "ar"; },
    t: function(key) { return key; },
    isArabic: function() { return true; }
  };

  function isAr() {
    return I18N.isArabic ? I18N.isArabic() : I18N.lang() === "ar";
  }

  function tx(en, ar) {
    return isAr() ? ar : en;
  }

  const adminCopy = {
    sections: {
      services: ["Services", "الخدمات", "Add, edit, delete, price, categorize, image, describe, and publish service cards.", "إضافة وتعديل وحذف وتسعير وتصنيف ورفع صور ونشر بطاقات الخدمات."],
      designs: ["Designs", "التصاميم", "Manage the public design catalog: category, style, price, image, description, and visibility.", "إدارة كتالوج التصاميم العام: التصنيف، الستايل، السعر، الصورة، الوصف، وحالة الظهور."],
      projects: ["Projects", "المشاريع", "Manage project stories with city, category, gallery, area, duration, materials, scope, video, status, and details.", "إدارة قصص المشاريع مع المدينة والتصنيف والمعرض والمساحة والمدة والخامات والنطاق والفيديو والحالة والتفاصيل."],
      pricing: ["Pricing", "الأسعار", "Manage visible consultation and package prices. Custom scopes can keep text prices.", "إدارة أسعار الاستشارات والباقات الظاهرة، مع إمكانية كتابة تسعير مخصص للنطاقات الخاصة."],
      contentBlocks: ["Content", "المحتوى", "Manage reusable public text blocks such as homepage intro, policy, and consultation notes.", "إدارة كتل النصوص العامة القابلة لإعادة الاستخدام مثل مقدمة الرئيسية والسياسة وملاحظات الاستشارة."],
      orders: ["Orders", "الطلبات", "Review and update project requests submitted from the public site.", "مراجعة وتحديث طلبات المشاريع المرسلة من الموقع العام."],
      customers: ["Customers", "العملاء", "Maintain customer and lead records created manually or from consultation requests.", "إدارة سجلات العملاء والعملاء المحتملين المنشأة يدوياً أو من طلبات الاستشارة."],
      files: ["Files", "الملفات", "Manage admin file references, images, and documentation links used for projects or content.", "إدارة مراجع الملفات والصور وروابط المستندات المستخدمة للمشاريع أو المحتوى."],
      settings: ["Settings", "الإعدادات", "Manage brand, contact details, and operating policy shown across the public site.", "إدارة العلامة وبيانات التواصل والسياسة التشغيلية الظاهرة في الموقع."]
    },
    fields: {
      title: "العنوان",
      category: "التصنيف",
      price: "السعر",
      status: "الحالة",
      image: "رابط الصورة",
      description: "الوصف",
      details: "التفاصيل",
      features: "المميزات",
      scope: "نطاق العمل",
      style: "الستايل",
      city: "المدينة",
      area: "المساحة",
      duration: "المدة",
      completedAt: "تاريخ الإنجاز",
      clientType: "نوع العميل",
      images: "روابط صور المعرض",
      videoUrl: "رابط الفيديو",
      materials: "الخامات المستخدمة",
      challenges: "التحديات والحلول",
      results: "نتائج التسليم",
      key: "مفتاح الكتلة",
      page: "الصفحة / القسم",
      name: "اسم العميل",
      email: "البريد الإلكتروني",
      phone: "رقم الجوال",
      projectType: "نوع المشروع",
      service: "الخدمة المطلوبة",
      budget: "الميزانية / ملاحظة السعر",
      fileName: "اسم الملف المرفوع",
      url: "رابط الملف",
      brand: "العلامة",
      tagline: "الوصف المختصر",
      address: "العنوان",
      policy: "السياسة التشغيلية"
    },
    statuses: {
      visible: "ظاهر",
      hidden: "مخفي",
      available: "متاح",
      unavailable: "غير متاح",
      Delivered: "تم التسليم",
      "In Progress": "قيد التنفيذ",
      Concept: "تصور",
      new: "جديد",
      reviewing: "قيد المراجعة",
      approved: "معتمد",
      lead: "عميل محتمل",
      active: "نشط",
      archived: "مؤرشف"
    }
  };

  function ui(key) {
    const copy = {
      dashboardEyebrow: ["FORMA Dashboard", "لوحة فورما"],
      dashboardTitle: ["Content Management", "إدارة المحتوى"],
      dashboardDescription: ["Manage services, designs, projects, pricing, settings, images, and visibility states.", "إدارة الخدمات والتصاميم والمشاريع والأسعار والإعدادات والصور وحالات الظهور."],
      viewSite: ["View site", "عرض الموقع"],
      resetData: ["Reset demo data", "استعادة البيانات التجريبية"],
      newItem: ["New item", "عنصر جديد"],
      saveSettings: ["Save settings", "حفظ الإعدادات"],
      saveChanges: ["Save changes", "حفظ التغييرات"],
      addItem: ["Add item", "إضافة عنصر"],
      noItems: ["No items yet. Add the first item from the form above.", "لا توجد عناصر بعد. أضف أول عنصر من النموذج أعلاه."],
      imagePlaceholder: ["Image URL or uploaded temporary Base64", "رابط صورة أو صورة Base64 مؤقتة"],
      imageHelp: ["Clear this field to remove the image, or paste a new image URL.", "امسح هذا الحقل لإزالة الصورة أو الصق رابط صورة جديد."],
      galleryHelp: ["Use image URLs separated by comma/new line, or upload temporary Base64 images. Delete any image by removing its URL from this field.", "استخدم روابط صور مفصولة بفاصلة أو سطر جديد، أو ارفع صور Base64 مؤقتة. احذف أي صورة بإزالة رابطها من هذا الحقل."],
      edit: ["Edit", "تعديل"],
      delete: ["Delete", "حذف"],
      file: ["File", "الملف"],
      resetConfirm: ["Reset all dashboard content to the FORMA demo data?", "هل تريد استعادة كل محتوى لوحة الإدارة إلى بيانات فورما التجريبية؟"],
      settingsSaved: ["Settings saved.", "تم حفظ الإعدادات."],
      contentSaved: ["Content saved.", "تم حفظ المحتوى."]
    };
    return tx(copy[key][0], copy[key][1]);
  }

  function sectionTitle(config) {
    const copy = adminCopy.sections[config.collection];
    return copy ? tx(copy[0], copy[1]) : config.title;
  }

  function sectionDescription(config) {
    const copy = adminCopy.sections[config.collection];
    return copy ? tx(copy[2], copy[3]) : config.description;
  }

  function fieldLabel(name, fallback) {
    return isAr() ? (adminCopy.fields[name] || fallback) : fallback;
  }

  function statusLabel(value, fallback) {
    return isAr() ? (adminCopy.statuses[value] || fallback) : fallback;
  }

  const sections = {
    services: {
      title: "Services",
      description: "Add, edit, delete, price, categorize, image, describe, and publish service cards.",
      collection: "services",
      fields: [
        ["title", "Title", "text"],
        ["category", "Category", "text"],
        ["price", "Price", "text"],
        ["status", "Status", "select"],
        ["image", "Image URL", "image"],
        ["description", "Short description", "textarea"],
        ["details", "Details", "textarea"],
        ["features", "Features (comma or new line)", "textarea"],
        ["scope", "Scope of work (comma or new line)", "textarea"]
      ]
    },
    designs: {
      title: "Designs",
      description: "Manage the public design catalog: category, style, price, image, description, and visibility.",
      collection: "designs",
      fields: [
        ["title", "Title", "text"],
        ["category", "Category", "text"],
        ["style", "Style", "text"],
        ["price", "Price", "text"],
        ["status", "Status", "select"],
        ["image", "Image URL", "image"],
        ["description", "Description", "textarea"],
        ["details", "Details", "textarea"]
      ]
    },
    projects: {
      title: "Projects",
      description: "Manage project stories with city, category, gallery, area, duration, materials, scope, video, status, and details.",
      collection: "projects",
      fields: [
        ["title", "Title", "text"],
        ["category", "Category", "text"],
        ["city", "City", "text"],
        ["status", "Status", "select"],
        ["area", "Area", "text"],
        ["duration", "Duration", "text"],
        ["completedAt", "Completion date", "date"],
        ["clientType", "Client type", "text"],
        ["image", "Cover image URL", "image"],
        ["images", "Gallery image URLs (comma or new line)", "textarea"],
        ["videoUrl", "Video URL", "url"],
        ["description", "Summary", "textarea"],
        ["details", "Details", "textarea"],
        ["scope", "Scope of work", "textarea"],
        ["materials", "Materials used", "textarea"],
        ["challenges", "Challenges and solutions", "textarea"],
        ["results", "Delivery results", "textarea"]
      ]
    },
    pricing: {
      title: "Pricing",
      description: "Manage visible consultation and package prices. Custom scopes can keep text prices.",
      collection: "pricing",
      fields: [
        ["title", "Title", "text"],
        ["label", "Label", "text"],
        ["price", "Price", "text"],
        ["duration", "Timeline", "text"],
        ["status", "Status", "select"],
        ["description", "Description", "textarea"],
        ["idealFor", "Best for", "textarea"],
        ["includes", "Included items", "textarea"]
      ]
    },
    contentBlocks: {
      title: "Content",
      description: "Manage reusable public text blocks such as homepage intro, policy, and consultation notes.",
      collection: "contentBlocks",
      fields: [
        ["title", "Title", "text"],
        ["key", "Block key", "text"],
        ["page", "Page/section", "text"],
        ["status", "Status", "select"],
        ["description", "Content", "textarea"]
      ]
    },
    orders: {
      title: "Orders",
      description: "Review and update project requests submitted from the public site.",
      collection: "orders",
      fields: [
        ["title", "Request title", "text"],
        ["name", "Client name", "text"],
        ["email", "Email", "email"],
        ["phone", "Phone", "text"],
        ["projectType", "Project type", "text"],
        ["area", "Project area", "text"],
        ["city", "City", "text"],
        ["service", "Requested service", "text"],
        ["budget", "Budget / price note", "text"],
        ["status", "Status", "select"],
        ["fileName", "Uploaded file name", "text"],
        ["image", "Uploaded file/image", "image"],
        ["description", "Brief details", "textarea"]
      ]
    },
    customers: {
      title: "Customers",
      description: "Maintain customer and lead records created manually or from consultation requests.",
      collection: "customers",
      fields: [
        ["title", "Name", "text"],
        ["email", "Email", "email"],
        ["phone", "Phone", "text"],
        ["city", "City", "text"],
        ["status", "Status", "select"],
        ["description", "Notes", "textarea"]
      ]
    },
    files: {
      title: "Files",
      description: "Manage admin file references, images, and documentation links used for projects or content.",
      collection: "files",
      fields: [
        ["title", "Title", "text"],
        ["category", "Category", "text"],
        ["status", "Status", "select"],
        ["image", "Preview image", "image"],
        ["url", "File URL", "url"],
        ["description", "Description", "textarea"]
      ]
    },
    settings: {
      title: "Settings",
      description: "Manage brand, contact details, and operating policy shown across the public site.",
      collection: "settings",
      fields: [
        ["brand", "Brand", "text"],
        ["tagline", "Tagline", "textarea"],
        ["email", "Email", "email"],
        ["phone", "Phone", "text"],
        ["address", "Address", "text"],
        ["policy", "Operating policy", "textarea"]
      ]
    }
  };

  let active = "services";
  let editingId = null;

  function data() {
    return window.FormaStore.get();
  }

  function save(next) {
    window.FormaStore.save(next);
  }

  function slug(value) {
    const base = String(value || "item").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return base || "item";
  }

  function uniqueId(items, title) {
    const base = slug(title);
    let id = base;
    let index = 2;
    while (items.some(function(item) { return item.id === id; })) {
      id = base + "-" + index;
      index += 1;
    }
    return id;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function(char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char];
    });
  }

  function currentItems(store, config) {
    return config.collection === "settings" ? [store.settings] : (store[config.collection] || []);
  }

  function activeItem(store, config) {
    const items = currentItems(store, config);
    if (config.collection === "settings") return store.settings;
    return items.find(function(item) { return item.id === editingId; }) || {};
  }

  function previewImage(item) {
    const image = item.image || item.url || "";
    if (/^data:image\//.test(image) || /^https?:\/\//i.test(image) || /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(image)) return image;
    return "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=84";
  }

  function itemMeta(item) {
    return [
      item.category,
      item.style,
      item.city,
      item.service,
      item.projectType,
      item.price || item.budget,
      item.status
    ].filter(Boolean).join(" / ");
  }

  function fieldHtml(field, item) {
    const name = field[0];
    const label = fieldLabel(name, field[1]);
    const type = field[2];
    const value = item[name] || "";
    const wide = type === "textarea" || type === "image" ? " admin-field--wide" : "";
    if (name === "images") {
      return `<div class="admin-field admin-field--wide"><label for="${name}">${label}</label><textarea id="${name}" name="${name}">${escapeHtml(value)}</textarea><input class="mt-2" type="file" accept="image/*" multiple data-gallery-target="${name}"><small>${ui("galleryHelp")}</small></div>`;
    }
    if (type === "textarea") {
      return `<div class="admin-field${wide}"><label for="${name}">${label}</label><textarea id="${name}" name="${name}">${escapeHtml(value)}</textarea></div>`;
    }
    if (type === "select") {
      return `<div class="admin-field"><label for="${name}">${label}</label><select id="${name}" name="${name}"><option value="visible"${value === "visible" || !value ? " selected" : ""}>${statusLabel("visible", "Visible")}</option><option value="hidden"${value === "hidden" ? " selected" : ""}>${statusLabel("hidden", "Hidden")}</option><option value="available"${value === "available" ? " selected" : ""}>${statusLabel("available", "Available")}</option><option value="unavailable"${value === "unavailable" ? " selected" : ""}>${statusLabel("unavailable", "Unavailable")}</option><option value="Delivered"${value === "Delivered" ? " selected" : ""}>${statusLabel("Delivered", "Delivered")}</option><option value="In Progress"${value === "In Progress" ? " selected" : ""}>${statusLabel("In Progress", "In Progress")}</option><option value="Concept"${value === "Concept" ? " selected" : ""}>${statusLabel("Concept", "Concept")}</option><option value="new"${value === "new" ? " selected" : ""}>${statusLabel("new", "New")}</option><option value="reviewing"${value === "reviewing" ? " selected" : ""}>${statusLabel("reviewing", "Reviewing")}</option><option value="approved"${value === "approved" ? " selected" : ""}>${statusLabel("approved", "Approved")}</option><option value="lead"${value === "lead" ? " selected" : ""}>${statusLabel("lead", "Lead")}</option><option value="active"${value === "active" ? " selected" : ""}>${statusLabel("active", "Active")}</option><option value="archived"${value === "archived" ? " selected" : ""}>${statusLabel("archived", "Archived")}</option></select></div>`;
    }
    if (type === "image") {
      return `<div class="admin-field${wide}"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="text" value="${escapeHtml(value)}" placeholder="${ui("imagePlaceholder")}"><input class="mt-2" type="file" accept="image/*" data-image-target="${name}"><small>${ui("imageHelp")}</small></div>`;
    }
    return `<div class="admin-field${wide}"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" value="${escapeHtml(value)}"></div>`;
  }

  function renderList(store, config) {
    if (config.collection === "settings") {
      return "";
    }
    const items = currentItems(store, config);
    if (!items.length) {
      return `<div class="admin-alert">${ui("noItems")}</div>`;
    }
    return `<div class="admin-list">${items.map(function(item) {
      return `
        <article class="admin-item">
          <img src="${escapeHtml(previewImage(item))}" alt="">
          <div>
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(itemMeta(item))}</p>
            <p>${escapeHtml(item.description || "")}</p>
            ${item.fileName ? `<p><strong>${ui("file")}:</strong> ${escapeHtml(item.fileName)}</p>` : ""}
          </div>
          <div class="admin-item__actions">
            <button class="btn" type="button" data-edit="${escapeHtml(item.id)}">${ui("edit")}</button>
            <button class="btn btn-dark" type="button" data-delete="${escapeHtml(item.id)}">${ui("delete")}</button>
          </div>
        </article>`;
    }).join("")}</div>`;
  }

  function translateShell() {
    const eyebrow = document.querySelector(".admin-toolbar .title-accent");
    const title = document.querySelector(".admin-toolbar h1");
    const description = document.querySelector(".admin-toolbar .admin-muted");
    const viewSite = document.querySelector(".admin-toolbar a[href='index.html']");
    const reset = document.getElementById("reset-data");
    if (eyebrow) eyebrow.textContent = ui("dashboardEyebrow");
    if (title) title.textContent = ui("dashboardTitle");
    if (description) description.textContent = ui("dashboardDescription");
    if (viewSite) viewSite.textContent = ui("viewSite");
    if (reset) reset.textContent = ui("resetData");
    document.querySelectorAll(".admin-nav button").forEach(function(button) {
      const config = sections[button.dataset.section];
      if (config) button.textContent = sectionTitle(config);
    });
  }

  function render() {
    const store = data();
    const config = sections[active];
    const item = activeItem(store, config);
    const panel = document.getElementById("admin-panel");
    if (!panel) return;
    translateShell();

    panel.innerHTML = `
      <div class="admin-panel__head">
        <div>
          <h2>${sectionTitle(config)}</h2>
          <p class="admin-muted mb-0">${sectionDescription(config)}</p>
        </div>
        ${config.collection !== "settings" ? `<button class="btn" type="button" id="new-item">${ui("newItem")}</button>` : ""}
      </div>
      <form id="admin-form" class="admin-grid">
        ${config.fields.map(function(field) { return fieldHtml(field, item); }).join("")}
        <div class="admin-field admin-field--wide">
          <button class="btn btn-dark" type="submit">${config.collection === "settings" ? ui("saveSettings") : editingId ? ui("saveChanges") : ui("addItem")}</button>
        </div>
      </form>
      <div id="admin-message" class="admin-alert" hidden></div>
      ${renderList(store, config)}
    `;

    document.querySelectorAll(".admin-nav button").forEach(function(button) {
      button.classList.toggle("active", button.dataset.section === active);
    });
  }

  function readForm(config) {
    const form = document.getElementById("admin-form");
    const result = {};
    config.fields.forEach(function(field) {
      const input = form.elements[field[0]];
      result[field[0]] = input ? input.value.trim() : "";
    });
    if (!result.status && config.collection !== "settings") result.status = "visible";
    return result;
  }

  function showMessage(text) {
    const message = document.getElementById("admin-message");
    if (!message) return;
    message.textContent = text;
    message.hidden = false;
    window.setTimeout(function() {
      message.hidden = true;
    }, 2500);
  }

  function bindEvents() {
    document.addEventListener("click", function(event) {
      const nav = event.target.closest(".admin-nav button");
      if (nav) {
        active = nav.dataset.section;
        editingId = null;
        render();
        return;
      }

      if (event.target.id === "new-item") {
        editingId = null;
        render();
        return;
      }

      if (event.target.id === "reset-data") {
        if (confirm(ui("resetConfirm"))) {
          window.FormaStore.reset();
          editingId = null;
          render();
        }
        return;
      }

      const edit = event.target.closest("[data-edit]");
      if (edit) {
        editingId = edit.dataset.edit;
        render();
        return;
      }

      const remove = event.target.closest("[data-delete]");
      if (remove) {
        const store = data();
        const config = sections[active];
        store[config.collection] = (store[config.collection] || []).filter(function(item) {
          return item.id !== remove.dataset.delete;
        });
        save(store);
        editingId = null;
        render();
      }
    });

    document.addEventListener("submit", function(event) {
      if (event.target.id !== "admin-form") return;
      event.preventDefault();
      const store = data();
      const config = sections[active];
      const payload = readForm(config);

      if (config.collection === "settings") {
        store.settings = Object.assign({}, store.settings, payload);
        save(store);
        render();
        showMessage(ui("settingsSaved"));
        return;
      }

      const items = store[config.collection] || [];
      if (editingId) {
        const index = items.findIndex(function(item) { return item.id === editingId; });
        if (index >= 0) {
          items[index] = Object.assign({}, items[index], payload);
        }
      } else {
        payload.id = uniqueId(items, payload.title);
        items.unshift(payload);
      }
      store[config.collection] = items;
      save(store);
      editingId = null;
      render();
      showMessage(ui("contentSaved"));
    });

    document.addEventListener("change", function(event) {
      const input = event.target.closest("input[type='file'][data-image-target]");
      if (!input || !input.files || !input.files[0]) return;
      const targetName = input.dataset.imageTarget;
      const reader = new FileReader();
      reader.onload = function() {
        const target = document.querySelector(`[name="${targetName}"]`);
        if (target) target.value = reader.result;
      };
      reader.readAsDataURL(input.files[0]);
    });

    document.addEventListener("change", function(event) {
      const input = event.target.closest("input[type='file'][data-gallery-target]");
      if (!input || !input.files || !input.files.length) return;
      const targetName = input.dataset.galleryTarget;
      const target = document.querySelector(`[name="${targetName}"]`);
      if (!target) return;
      const reads = Array.from(input.files).map(function(file) {
        return new Promise(function(resolve) {
          const reader = new FileReader();
          reader.onload = function() { resolve(reader.result); };
          reader.readAsDataURL(file);
        });
      });
      Promise.all(reads).then(function(images) {
        const existing = target.value.trim();
        target.value = [existing, images.join("\n")].filter(Boolean).join("\n");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function() {
    bindEvents();
    render();
  });

  window.addEventListener("forma:language-changed", function() {
    render();
  });
})();
