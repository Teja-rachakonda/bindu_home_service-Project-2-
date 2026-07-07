import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Storage, downloadJSON } from "../utils/storage";
import * as db from "../lib/db";

/* ─────────────────────────  shared UI  ───────────────────────── */

function Label({ children }) {
  return (
    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
      {children}
    </label>
  );
}

function Field({ label, ...props }) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <input
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20"
        {...props}
      />
    </div>
  );
}

function BlackButton({ children, className = "", ...props }) {
  return (
    <button
      className={`w-full rounded-md border border-[#f59e0b] bg-[#111] py-3 font-bold text-[#f59e0b] transition-colors hover:bg-black active:scale-[0.99] disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function RedButton({ children, className = "", ...props }) {
  return (
    <button
      className={`w-full rounded-md bg-[#ef4444] py-3 font-bold text-white transition-colors hover:bg-red-600 active:scale-[0.99] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="mb-3 mt-6 border-b border-[#f59e0b] pb-2 text-base font-extrabold text-gray-900">
      {children}
    </h3>
  );
}

function InfoBox({ children }) {
  return (
    <div className="mb-4 border-l-4 border-[#f59e0b] bg-[#f3f4f6] p-3 text-sm text-gray-700">
      {children}
    </div>
  );
}

function WarningBox({ children }) {
  return (
    <div className="mb-4 border-l-4 border-orange-500 bg-orange-100 p-3 text-sm text-orange-900">
      {children}
    </div>
  );
}

function Loading() {
  return <p className="py-10 text-center text-sm text-gray-400">Loading…</p>;
}

const ALL_TABS = ["Brand", "Posters", "Offers", "Templates", "Published", "Config", "Leads"];

const OFFER_CATEGORIES = [
  { id: "internet", label: "Internet Deals" },
  { id: "rental", label: "Rental" },
  { id: "homePhone", label: "Home Phone" },
  { id: "mobile", label: "Mobile Plans" },
];

/* ─────────────────────────  Brand tab  ───────────────────────── */

function BrandTab({ toast }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    db.getBrand().then((b) =>
      setForm({
        header1: "DEALS ALERT",
        header2: "Live Offers This Week",
        logo: "🚨",
        footerTop: "",
        footerBottom: "",
        phone: "+1 647-740-8124",
        ...b,
      })
    );
  }, []);

  if (!form) return <Loading />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, logo: reader.result });
    reader.readAsDataURL(file);
  };

  const save = async () => {
    await db.saveBrand(form);
    toast("Brand settings saved!");
  };

  return (
    <div>
      <Field label="Header 1" value={form.header1} onChange={set("header1")} />
      <Field label="Header 2" value={form.header2} onChange={set("header2")} />

      <div className="mb-4">
        <Label>Logo</Label>
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-[#f59e0b]"
          value={form.logo?.startsWith?.("data:") ? "" : form.logo}
          onChange={set("logo")}
          placeholder="Emoji or text (e.g. 🚨)"
        />
        <label className="mt-2 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#f59e0b] bg-[#fffbeb] py-3 text-sm font-semibold text-gray-700">
          📤 Upload
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
        {form.logo?.startsWith?.("data:") && (
          <img src={form.logo} alt="logo preview" className="mt-2 h-12 w-12 rounded-lg object-cover" />
        )}
      </div>

      <Field label="Footer Top" value={form.footerTop} onChange={set("footerTop")} />
      <Field label="Footer Bottom" value={form.footerBottom} onChange={set("footerBottom")} />
      <Field label="Phone" value={form.phone} onChange={set("phone")} />

      <BlackButton onClick={save}>💾 Save</BlackButton>
    </div>
  );
}

/* ─────────────────────────  Posters tab  ───────────────────────── */

const EMPTY_POSTER = {
  title: "",
  image: "",
  description: "",
  waMessage: "",
  badge: "",
  status: "draft",
  knowledgeBase: "",
};

function PostersTab({ toast }) {
  const [posters, setPosters] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewing, setViewing] = useState(null);

  const reload = () => db.getPosters().then(setPosters);
  useEffect(() => {
    reload();
  }, []);

  if (!posters) return <Loading />;

  const openAdd = () => {
    setEditing({ ...EMPTY_POSTER });
    setShowForm(true);
  };
  const openEdit = (p) => {
    setEditing({ ...p });
    setShowForm(true);
  };

  const save = async () => {
    await db.savePoster(editing);
    await reload();
    setShowForm(false);
    setEditing(null);
    toast("Poster saved!");
  };
  const remove = async (id) => {
    await db.deletePoster(id);
    reload();
  };
  const publish = async (p) => {
    await db.savePoster({ ...p, status: p.status === "active" ? "draft" : "active" });
    reload();
  };
  const makeTemplate = async (p) => {
    await db.saveTemplate({
      name: p.title || "Untitled",
      details: p.description,
      image: p.image,
      badge: p.badge,
      waMessage: p.waMessage,
    });
    toast("Saved as a template!");
  };

  const set = (k) => (e) => setEditing({ ...editing, [k]: e.target.value });
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditing({ ...editing, image: reader.result });
    reader.readAsDataURL(file);
  };

  if (showForm) {
    return (
      <div>
        <Field label="Title" value={editing.title} onChange={set("title")} />
        <Field label="Image URL" value={editing.image?.startsWith?.("data:") ? "" : editing.image} onChange={set("image")} placeholder="https://…" />
        <label className="mb-4 mt-[-8px] flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#f59e0b] bg-[#fffbeb] py-3 text-sm font-semibold text-gray-700">
          📤 Upload image
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
        {editing.image && (
          <img src={editing.image} alt="preview" className="mb-4 max-h-40 w-full rounded-lg object-cover" />
        )}

        <div className="mb-4">
          <Label>Description</Label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-[#f59e0b]"
            rows={3}
            value={editing.description}
            onChange={set("description")}
          />
        </div>

        <Field label="WhatsApp message" value={editing.waMessage} onChange={set("waMessage")} placeholder="Hi! I saw your offer…" />
        <Field label="Badge text" value={editing.badge} onChange={set("badge")} placeholder="HOT DEAL 🔥" />

        <div className="mb-4">
          <Label>Knowledge base (for the chat / bot)</Label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-[#f59e0b]"
            rows={3}
            value={editing.knowledgeBase}
            onChange={set("knowledgeBase")}
            placeholder="Details the agent/bot should know about this offer…"
          />
        </div>

        <div className="mb-4 flex items-center gap-3">
          <Label>Status</Label>
          <button
            type="button"
            onClick={() => setEditing({ ...editing, status: editing.status === "active" ? "draft" : "active" })}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${
              editing.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            {editing.status === "active" ? "Active" : "Draft"}
          </button>
        </div>

        <div className="flex gap-2">
          <BlackButton onClick={save}>💾 Save</BlackButton>
          <button
            onClick={() => {
              setShowForm(false);
              setEditing(null);
            }}
            className="w-full rounded-md border border-gray-300 bg-white py-3 font-bold text-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BlackButton onClick={openAdd} className="mb-4">
        ＋ Add Poster
      </BlackButton>

      {posters.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-400">No posters yet. Add your first one!</p>
      )}

      <div className="flex flex-col gap-3">
        {posters.map((p) => (
          <div key={p.id} className="rounded-xl border border-gray-200 p-3">
            <div className="flex items-center gap-3">
              {p.image ? (
                <img src={p.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 text-xl">🖼️</div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-gray-900">{p.title || "Untitled"}</p>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                    p.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {p.status === "active" ? "Active" : "Draft"}
                </span>
              </div>
            </div>
            <div className="mt-3 flex gap-2 text-sm font-semibold">
              <button onClick={() => openEdit(p)} className="flex-1 rounded-md border border-gray-300 py-1.5 text-gray-700">Edit</button>
              <button onClick={() => publish(p)} className="flex-1 rounded-md border border-[#f59e0b] py-1.5 text-[#b45309]">
                {p.status === "active" ? "Unpublish" : "Publish"}
              </button>
              <button onClick={() => remove(p.id)} className="flex-1 rounded-md border border-red-300 py-1.5 text-red-600">Delete</button>
            </div>
            <div className="mt-2 flex gap-2 text-sm font-semibold">
              <button onClick={() => setViewing(p)} className="flex-1 rounded-md border border-gray-300 py-1.5 text-gray-700">👁 View</button>
              <button onClick={() => makeTemplate(p)} className="flex-1 rounded-md border border-[#f59e0b] py-1.5 text-[#b45309]">⭐ Make Template</button>
            </div>
          </div>
        ))}
      </div>

      {viewing && <PosterPreviewModal poster={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}

// Shows a poster the way a customer sees it (image, badge, title, description,
// "Click Here" highlight).
function PosterPreviewModal({ poster, onClose }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-[360px] overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          {poster.image ? (
            <img src={poster.image} alt={poster.title} className="block max-h-72 w-full object-cover" />
          ) : (
            <div className="flex h-40 items-center justify-center bg-brand px-4 text-center text-lg font-extrabold text-white">
              {poster.title || "Special Offer"}
            </div>
          )}
          {poster.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow">{poster.badge}</span>
          )}
          <span className="absolute bottom-3 right-3 rounded-full bg-whatsapp px-3 py-1.5 text-xs font-bold text-white shadow-lg">👉 Click Here</span>
        </div>
        <div className="p-4">
          {poster.title && <p className="font-bold text-gray-900">{poster.title}</p>}
          {poster.description && <p className="mt-0.5 text-sm text-gray-500">{poster.description}</p>}
          <span
            className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
              poster.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            {poster.status === "active" ? "Active (published)" : "Draft"}
          </span>
          <button onClick={onClose} className="mt-3 w-full rounded-md border border-gray-300 py-2 font-bold text-gray-600">Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────  Offers tab (deal cards)  ───────────────────────── */

const EMPTY_OFFER = {
  category: "internet",
  name: "",
  details: "",
  price: "",
  tag: "",
  badge: "",
  active: true,
  sortOrder: 0,
};

function OffersTab({ toast }) {
  const [offers, setOffers] = useState(null);
  const [cat, setCat] = useState("internet");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const reload = () => db.getOffers().then(setOffers);
  useEffect(() => {
    reload();
  }, []);

  if (!offers) return <Loading />;
  const list = offers.filter((o) => o.category === cat);

  const openAdd = () => {
    setEditing({ ...EMPTY_OFFER, category: cat, sortOrder: list.length + 1 });
    setShowForm(true);
  };
  const openEdit = (o) => {
    setEditing({ ...o });
    setShowForm(true);
  };
  const save = async () => {
    await db.saveOffer(editing);
    await reload();
    setShowForm(false);
    setEditing(null);
    toast("Offer saved!");
  };
  const remove = async (id) => {
    await db.deleteOffer(id);
    reload();
  };
  const toggleActive = async (o) => {
    await db.saveOffer({ ...o, active: !o.active });
    reload();
  };
  const set = (k) => (e) => setEditing({ ...editing, [k]: e.target.value });

  if (showForm) {
    return (
      <div>
        <div className="mb-4">
          <Label>Category (tab)</Label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-[#f59e0b]"
            value={editing.category}
            onChange={set("category")}
          >
            {OFFER_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <Field label="Name" value={editing.name} onChange={set("name")} placeholder="Starter Internet" />
        <Field label="Details" value={editing.details} onChange={set("details")} placeholder="25 Mbps" />
        <Field label="Price" value={editing.price} onChange={set("price")} placeholder="$45/mo" />
        <Field label="Tag (small line)" value={editing.tag} onChange={set("tag")} placeholder="Best for 1-2 users" />
        <Field label="Badge" value={editing.badge} onChange={set("badge")} placeholder="Popular / Best Value / New" />
        <Field label="Sort order" type="number" value={editing.sortOrder} onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })} />

        <div className="mb-4 flex items-center gap-3">
          <Label>Visible</Label>
          <button
            type="button"
            onClick={() => setEditing({ ...editing, active: !editing.active })}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${
              editing.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            {editing.active ? "Shown" : "Hidden"}
          </button>
        </div>

        <div className="flex gap-2">
          <BlackButton onClick={save}>💾 Save</BlackButton>
          <button
            onClick={() => {
              setShowForm(false);
              setEditing(null);
            }}
            className="w-full rounded-md border border-gray-300 bg-white py-3 font-bold text-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Category selector */}
      <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
        {OFFER_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold ${
              cat === c.id ? "bg-[#111] text-[#f59e0b]" : "bg-gray-100 text-gray-600"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <BlackButton onClick={openAdd} className="mb-4">＋ Add Offer</BlackButton>

      {list.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-400">No offers in this tab yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {list.map((o) => (
          <div key={o.id} className="rounded-xl border border-gray-200 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-bold text-gray-900">
                  {o.name} <span className="font-extrabold text-[#b45309]">{o.price}</span>
                </p>
                <p className="text-sm text-gray-500">{o.details}</p>
                <p className="text-xs text-gray-400">{o.tag}{o.badge ? ` • ${o.badge}` : ""}</p>
              </div>
              <button
                onClick={() => toggleActive(o)}
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                  o.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {o.active ? "Shown" : "Hidden"}
              </button>
            </div>
            <div className="mt-3 flex gap-2 text-sm font-semibold">
              <button onClick={() => openEdit(o)} className="flex-1 rounded-md border border-gray-300 py-1.5 text-gray-700">Edit</button>
              <button onClick={() => remove(o.id)} className="flex-1 rounded-md border border-red-300 py-1.5 text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────  Templates tab  ───────────────────────── */

// Built-in quick-starts (always available). The admin's own templates are
// stored in Supabase and fully editable below.
const STARTER_TEMPLATES = [
  {
    key: "internet",
    name: "Internet Deal",
    poster: {
      title: "Home Internet from $45/mo",
      badge: "POPULAR",
      description: "Unlimited data + free installation. Bindu Home Services.",
      waMessage: "Hi! I saw your home internet offer and want to know more.",
      image: "/posters/internet.svg",
    },
  },
  {
    key: "realestate",
    name: "Real Estate",
    poster: {
      title: "Move-in Ready Homes",
      badge: "NEW ✨",
      description: "Homes & apartments. Book a viewing today.",
      waMessage: "Hi! I saw your real estate listing and want to know more.",
      image: "/posters/rental.svg",
    },
  },
  {
    key: "rental",
    name: "Rental",
    poster: {
      title: "Apartments from $1,800/mo",
      badge: "AVAILABLE NOW",
      description: "Pet friendly. Downtown & suburbs. Flexible lease.",
      waMessage: "Hi! I saw your rental offer and want to know more.",
      image: "/posters/homephone.svg",
    },
  },
];

const EMPTY_TEMPLATE = { name: "", details: "", image: "", badge: "", waMessage: "" };

function TemplatesTab({ goToPosters, toast }) {
  const [templates, setTemplates] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const reload = () => db.getTemplates().then(setTemplates);
  useEffect(() => {
    reload();
  }, []);

  if (!templates) return <Loading />;

  const openAdd = () => {
    setEditing({ ...EMPTY_TEMPLATE });
    setShowForm(true);
  };
  const openEdit = (t) => {
    setEditing({ ...t });
    setShowForm(true);
  };
  const save = async () => {
    await db.saveTemplate(editing);
    await reload();
    setShowForm(false);
    setEditing(null);
    toast("Template saved!");
  };
  const remove = async (id) => {
    await db.deleteTemplate(id);
    reload();
  };

  // Create a poster (draft) from a saved template or a starter.
  const createPosterFrom = async (t) => {
    await db.savePoster({
      title: t.name,
      description: t.details,
      image: t.image,
      badge: t.badge,
      waMessage: t.waMessage,
      status: "draft",
      knowledgeBase: "",
    });
    toast(`Poster created from "${t.name}" (draft)`);
    goToPosters();
  };
  const applyStarter = async (tpl) => {
    await db.savePoster({ ...tpl.poster, status: "draft", knowledgeBase: "" });
    toast(`"${tpl.name}" added to Posters as a draft`);
    goToPosters();
  };

  const set = (k) => (e) => setEditing({ ...editing, [k]: e.target.value });
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditing({ ...editing, image: reader.result });
    reader.readAsDataURL(file);
  };

  if (showForm) {
    return (
      <div>
        <Field label="Template name" value={editing.name} onChange={set("name")} placeholder="e.g. Internet Deal" />
        <Field label="Image URL" value={editing.image?.startsWith?.("data:") ? "" : editing.image} onChange={set("image")} placeholder="https://…" />
        <label className="mb-4 mt-[-8px] flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#f59e0b] bg-[#fffbeb] py-3 text-sm font-semibold text-gray-700">
          📤 Upload image
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
        {editing.image && <img src={editing.image} alt="preview" className="mb-4 max-h-40 w-full rounded-lg object-cover" />}
        <div className="mb-4">
          <Label>Description</Label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-[#f59e0b]"
            rows={3}
            value={editing.details}
            onChange={set("details")}
          />
        </div>
        <Field label="Badge" value={editing.badge} onChange={set("badge")} placeholder="HOT DEAL 🔥" />
        <Field label="WhatsApp message" value={editing.waMessage} onChange={set("waMessage")} placeholder="Hi! I saw your offer…" />

        <div className="flex gap-2">
          <BlackButton onClick={save}>💾 Save Template</BlackButton>
          <button
            onClick={() => {
              setShowForm(false);
              setEditing(null);
            }}
            className="w-full rounded-md border border-gray-300 bg-white py-3 font-bold text-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BlackButton onClick={openAdd} className="mb-4">＋ Create Template</BlackButton>

      {/* Admin's own templates (full CRUD) */}
      {templates.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-400">
          No templates yet. Create one, or turn a poster into a template from the Posters tab.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {templates.map((t) => (
            <div key={t.id} className="overflow-hidden rounded-xl border border-gray-200">
              {t.image ? (
                <img src={t.image} alt="" className="h-24 w-full object-cover" />
              ) : (
                <div className="flex h-24 items-center justify-center bg-brand font-bold text-white">{t.name || "Template"}</div>
              )}
              <div className="p-3">
                <p className="font-bold text-gray-900">{t.name || "Untitled template"}</p>
                {t.details && <p className="mt-0.5 text-sm text-gray-500">{t.details}</p>}
                <div className="mt-2 flex gap-2 text-sm font-semibold">
                  <button onClick={() => createPosterFrom(t)} className="flex-1 rounded-md border border-[#f59e0b] bg-[#111] py-1.5 text-[#f59e0b]">＋ Create Poster</button>
                  <button onClick={() => openEdit(t)} className="flex-1 rounded-md border border-gray-300 py-1.5 text-gray-700">Edit</button>
                  <button onClick={() => remove(t.id)} className="flex-1 rounded-md border border-red-300 py-1.5 text-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Built-in quick starts */}
      <SectionTitle>Quick starts</SectionTitle>
      <div className="flex flex-col gap-3">
        {STARTER_TEMPLATES.map((t) => (
          <div key={t.key} className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
            <span className="font-bold text-gray-900">{t.name}</span>
            <button onClick={() => applyStarter(t)} className="rounded-md border border-[#f59e0b] bg-[#111] px-4 py-2 text-sm font-bold text-[#f59e0b]">
              Use
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────  Published tab  ───────────────────────── */

function PublishedTab({ toast }) {
  const [posters, setPosters] = useState(null);
  const reload = () => db.getPosters().then(setPosters);
  useEffect(() => {
    reload();
  }, []);

  if (!posters) return <Loading />;
  const published = posters.filter((p) => p.status === "active");

  const unpublish = async (p) => {
    await db.savePoster({ ...p, status: "draft" });
    reload();
  };
  const shareLink = () => {
    const url = window.location.origin + "/";
    navigator.clipboard?.writeText(url);
    toast("Share link copied: " + url);
  };

  if (published.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-400">No published posters yet. Publish one from the Posters tab.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {published.map((p) => (
        <div key={p.id} className="overflow-hidden rounded-xl border border-gray-200">
          {p.image ? (
            <img src={p.image} alt="" className="h-32 w-full object-cover" />
          ) : (
            <div className="flex h-32 items-center justify-center bg-brand font-bold text-white">{p.title}</div>
          )}
          <div className="p-3">
            <p className="font-bold text-gray-900">{p.title}</p>
            <div className="mt-2 flex gap-2 text-sm font-semibold">
              <button onClick={shareLink} className="flex-1 rounded-md border border-[#f59e0b] py-1.5 text-[#b45309]">🔗 Share Link</button>
              <button onClick={() => unpublish(p)} className="flex-1 rounded-md border border-gray-300 py-1.5 text-gray-600">Unpublish</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────  Config tab  ───────────────────────── */

const TAB_OPTIONS = [
  { id: "internet", label: "Internet Deals" },
  { id: "rental", label: "Rental" },
  { id: "homePhone", label: "Home Phone" },
  { id: "mobile", label: "Mobile Plans" },
];

function Toggle({ on, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-[#f59e0b]" : "bg-gray-300"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function ConfigTab({ toast }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    db.getConfig().then((cfg) =>
      setForm({
        waNumber: cfg.waNumber || "16477408124",
        connectText: cfg.connectText || "💬 Connect with Agent",
        callText: cfg.callText || "📞 Call Us Now",
        tabs: { internet: true, rental: true, homePhone: true, mobile: true, ...cfg.tabs },
      })
    );
  }, []);

  if (!form) return <Loading />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggleTab = (id) => setForm({ ...form, tabs: { ...form.tabs, [id]: !form.tabs[id] } });

  const save = async () => {
    await db.saveConfig(form);
    toast("Config saved!");
  };

  return (
    <div>
      <Field label="WhatsApp Number" value={form.waNumber} onChange={set("waNumber")} />
      <Field label="Connect Button Text" value={form.connectText} onChange={set("connectText")} />
      <Field label="Call Button Text" value={form.callText} onChange={set("callText")} />

      <SectionTitle>Show / Hide Tabs</SectionTitle>
      {TAB_OPTIONS.map((t) => (
        <div key={t.id} className="flex items-center justify-between border-b border-gray-100 py-2.5">
          <span className="font-medium text-gray-800">{t.label}</span>
          <Toggle on={form.tabs[t.id]} onClick={() => toggleTab(t.id)} />
        </div>
      ))}

      <div className="mt-5">
        <BlackButton onClick={save}>💾 Save</BlackButton>
      </div>
    </div>
  );
}

/* ─────────────────────────  Leads tab  ───────────────────────── */

function LeadsTab({ toast }) {
  const [leads, setLeads] = useState(null);
  const reload = () => db.getLeads().then(setLeads);
  useEffect(() => {
    reload();
  }, []);

  if (!leads) return <Loading />;

  const clearAll = async () => {
    if (!confirm("Clear all leads? This cannot be undone.")) return;
    await db.clearLeads();
    setLeads([]);
    toast("All leads cleared");
  };

  const exportCSV = () => {
    const rows = [["Time", "Deal", "Tab", "Action", "First", "Last", "Phone", "Email"]];
    leads.forEach((l) =>
      rows.push([l.createdAt, l.dealName, l.tab, l.action, l.firstName, l.lastName, l.phone, l.email])
    );
    const csv = rows
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bindu_leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-gray-900">Total Leads: {leads.length}</h3>
        <div className="flex gap-2 text-sm font-semibold">
          <button onClick={exportCSV} className="rounded-md border border-[#f59e0b] px-3 py-1.5 text-[#b45309]">📥 Export CSV</button>
          <button onClick={clearAll} className="rounded-md border border-red-300 px-3 py-1.5 text-red-600">🗑️ Clear All</button>
        </div>
      </div>

      {leads.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">No leads yet. Share your card link!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                <th className="py-2 pr-2">Time</th>
                <th className="py-2 pr-2">Deal</th>
                <th className="py-2 pr-2">Tab</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-gray-100">
                  <td className="py-2 pr-2 text-gray-500">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="py-2 pr-2 font-medium text-gray-900">{l.dealName}</td>
                  <td className="py-2 pr-2 text-gray-600">{l.tab}</td>
                  <td className="py-2 text-gray-600">{l.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────  Super tab  ───────────────────────── */

function SuperTab({ toast }) {
  const [masterPw, setMasterPw] = useState("");
  const [securityAns, setSecurityAns] = useState(Storage.getSecurityAnswer());
  const [apiKey, setApiKey] = useState(Storage.getApiKey());
  const [saas, setSaas] = useState(null);
  const [usedPosters, setUsedPosters] = useState(0);
  const [newUser, setNewUser] = useState({
    name: "",
    phone: "",
    password: "",
    allowedTabs: ALL_TABS.reduce((a, t) => ({ ...a, [t]: true }), {}),
  });
  const [adminUsers, setAdminUsers] = useState([]);

  useEffect(() => {
    db.getConfig().then((cfg) =>
      setSaas({
        plan: cfg.plan || "Professional",
        maxPosters: cfg.maxPosters || 10,
        agentEmail: cfg.agentEmail || "agent@pabbarealty.com",
      })
    );
    db.getPosters().then((p) => setUsedPosters(p.length));
    db.getAdminUsers().then(setAdminUsers);
  }, []);

  const updateMaster = () => {
    if (!masterPw.trim()) return toast("Enter a new master password");
    Storage.setMasterPassword(masterPw.trim());
    Storage.setSecurityAnswer(securityAns.trim());
    setMasterPw("");
    toast("Master password updated!");
  };

  const saveApiKey = () => {
    Storage.setApiKey(apiKey.trim());
    toast("API key saved");
  };

  const saveSaas = async () => {
    await db.saveConfig(saas);
    toast("SaaS settings saved");
  };

  const exportCarousel = async () => {
    const published = (await db.getPosters()).filter((p) => p.status === "active").slice(0, 10);
    const waNumber = db.getCachedWaNumber();
    downloadJSON("carousel_template.json", {
      name: "bindu_deals_carousel",
      language: "en",
      category: "MARKETING",
      components: [
        {
          type: "CAROUSEL",
          cards: published.map((p) => ({
            components: [
              { type: "HEADER", format: "IMAGE", example: { header_handle: [p.image || ""] } },
              { type: "BODY", text: p.description || p.title || "" },
              { type: "BUTTONS", buttons: [{ type: "URL", text: "Learn More", url: `https://wa.me/${waNumber}` }] },
            ],
          })),
        },
      ],
    });
    toast("carousel_template.json downloaded");
  };

  const exportFlow = () => {
    downloadJSON("flow_skeleton.json", {
      version: "3.1",
      screens: [{ id: "DEALS_SCREEN", title: "Bindu Home Services", data: {}, layout: { type: "SingleColumnLayout", children: [] } }],
    });
    toast("flow_skeleton.json downloaded");
  };

  const appForm = async () => {
    const [brand, config, posters] = await Promise.all([db.getBrand(), db.getConfig(), db.getPosters()]);
    downloadJSON("app_form.json", { brand, config, posters });
    toast("app_form.json downloaded");
  };

  const resetAll = async () => {
    if (!confirm("⚠️ This will erase ALL posters, offers, templates, leads and admin users. Continue?")) return;
    await db.resetAllData();
    toast("All data has been reset");
  };

  const createUser = async () => {
    if (!newUser.name.trim() || !newUser.password.trim()) return toast("Name and password required");
    await db.addAdminUser({
      name: newUser.name,
      phone: newUser.phone,
      password: newUser.password,
      allowedTabs: Object.keys(newUser.allowedTabs).filter((t) => newUser.allowedTabs[t]),
    });
    setNewUser({ name: "", phone: "", password: "", allowedTabs: ALL_TABS.reduce((a, t) => ({ ...a, [t]: true }), {}) });
    db.getAdminUsers().then(setAdminUsers);
    toast("Admin user created");
  };

  if (!saas) return <Loading />;

  return (
    <div>
      {/* Section 1 — Password */}
      <SectionTitle>🔑 Password Management</SectionTitle>
      <Field label="New Master Password" type="password" value={masterPw} onChange={(e) => setMasterPw(e.target.value)} />
      <Field label="Security Answer (for recovery)" value={securityAns} onChange={(e) => setSecurityAns(e.target.value)} placeholder="e.g. your pet's name" />
      <BlackButton onClick={updateMaster}>✅ Update Master Password</BlackButton>

      {/* Section 2 — AI */}
      <SectionTitle>🤖 AI Settings (for standalone / shared use)</SectionTitle>
      <InfoBox>
        AI Extract &amp; per-poster AI Chat only work inside Claude.ai's preview. To use them when the app is shared/hosted elsewhere, add your own Anthropic API key.
      </InfoBox>
      <Field label="Anthropic API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-ant-…" />
      <BlackButton onClick={saveApiKey}>💾 Save API Key</BlackButton>
      <div className="mt-3">
        <WarningBox>
          ⚠️ Testing only — this key is stored in localStorage and visible in devtools. For production, route these calls through your own backend (e.g. an n8n webhook).
        </WarningBox>
      </div>

      {/* Section 3 — WhatsApp Business Export */}
      <SectionTitle>📱 WhatsApp Business Export</SectionTitle>
      <InfoBox>
        Generates starter files for the official WhatsApp Business Platform (Cloud API / a BSP like Twilio, 360dialog, Gupshup) — the only way to get a native, in-chat interactive card instead of a shared link/file.
      </InfoBox>
      <div className="mb-2">
        <BlackButton onClick={exportCarousel}>📤 Export Carousel Template JSON</BlackButton>
      </div>
      <p className="mb-4 text-xs text-gray-500">Up to 10 published posters → swipeable native cards with buttons. Needs Meta template approval (24h–7 days).</p>
      <BlackButton onClick={exportFlow}>📤 Export Flow JSON Skeleton</BlackButton>
      <p className="mb-2 mt-2 text-xs text-gray-500">A starting point for a full in-chat mini-app. Refine in Meta's Flow Builder and wire a live data endpoint.</p>

      {/* Section 4 — SaaS */}
      <SectionTitle>SaaS Settings</SectionTitle>
      <div className="mb-4 space-y-2">
        <div className="border-l-4 border-[#f59e0b] bg-[#f3f4f6] px-3 py-2 text-sm"><b>Plan:</b> {saas.plan}</div>
        <div className="border-l-4 border-[#f59e0b] bg-[#f3f4f6] px-3 py-2 text-sm"><b>Max Posters:</b> {saas.maxPosters} (Used: {usedPosters})</div>
      </div>
      <div className="mb-4">
        <Label>Plan</Label>
        <select
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-[#f59e0b]"
          value={saas.plan}
          onChange={(e) => setSaas({ ...saas, plan: e.target.value })}
        >
          <option>Basic</option>
          <option>Professional</option>
          <option>Enterprise</option>
        </select>
      </div>
      <Field label="Max Posters" type="number" value={saas.maxPosters} onChange={(e) => setSaas({ ...saas, maxPosters: Number(e.target.value) })} />
      <Field label="Agent Email" value={saas.agentEmail} onChange={(e) => setSaas({ ...saas, agentEmail: e.target.value })} />
      <BlackButton onClick={saveSaas}>💾 Save</BlackButton>

      {/* Section 5 — Actions */}
      <SectionTitle>Actions</SectionTitle>
      <div className="mb-2"><BlackButton onClick={appForm}>📋 App Form</BlackButton></div>
      <div className="mb-2"><BlackButton onClick={db.backupAll}>💾 All Data Backup</BlackButton></div>
      <RedButton onClick={resetAll}>⚠️ Reset All Data</RedButton>

      {/* Section 6 — Create Admin User */}
      <SectionTitle>👥 Create Admin User</SectionTitle>
      <Field label="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
      <Field label="Phone" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />
      <Field label="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
      <Label>Allowed Tabs (restrict access)</Label>
      <div className="mb-4 mt-1 grid grid-cols-2 gap-2">
        {ALL_TABS.map((t) => (
          <label key={t} className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={newUser.allowedTabs[t]}
              onChange={() => setNewUser({ ...newUser, allowedTabs: { ...newUser.allowedTabs, [t]: !newUser.allowedTabs[t] } })}
              className="h-4 w-4 accent-[#f59e0b]"
            />
            {t}
          </label>
        ))}
      </div>
      <BlackButton onClick={createUser}>＋ Create Admin User</BlackButton>

      <SectionTitle>Admin Users</SectionTitle>
      {adminUsers.length === 0 ? (
        <p className="py-2 text-sm text-gray-400">No admin users yet</p>
      ) : (
        <div className="flex flex-col gap-2">
          {adminUsers.map((u) => (
            <div key={u.id} className="rounded-lg border border-gray-200 p-3 text-sm">
              <p className="font-bold text-gray-900">{u.name}</p>
              <p className="text-gray-500">{u.phone}</p>
              <p className="mt-1 text-xs text-gray-400">Tabs: {(u.allowedTabs || []).join(", ")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────  Shell  ───────────────────────── */

function AdminPanel() {
  const navigate = useNavigate();
  const isSuper = Storage.getSession() === "super";
  const [tab, setTab] = useState("Brand");
  const [toastMsg, setToastMsg] = useState("");

  const tabs = useMemo(() => (isSuper ? [...ALL_TABS, "Super"] : ALL_TABS), [isSuper]);

  const toast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const logout = () => {
    Storage.clearSession();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-svh bg-black/90">
      <div className="mx-auto flex min-h-svh w-full max-w-[520px] flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#0f172a] px-4 py-4 text-white">
          <div className="flex items-center gap-2 text-lg font-extrabold">⚙️ Admin</div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/")} className="rounded-md bg-[#f59e0b] px-3 py-1.5 text-sm font-bold text-[#0f172a]">
              📊 Dashboard
            </button>
            <button onClick={logout} title="Logout" className="text-2xl leading-none text-white/80 hover:text-white">
              ✕
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-gray-200 px-2">
          {tabs.map((t) => {
            const active = t === tab;
            const isSuperTab = t === "Super";
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
                  active ? "border-[#f59e0b] text-[#b45309]" : "border-transparent text-gray-500 hover:text-gray-800"
                } ${isSuperTab ? "text-orange-600" : ""}`}
              >
                {isSuperTab ? "👑 Super" : t}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          {tab === "Brand" && <BrandTab toast={toast} />}
          {tab === "Posters" && <PostersTab toast={toast} />}
          {tab === "Offers" && <OffersTab toast={toast} />}
          {tab === "Templates" && <TemplatesTab toast={toast} goToPosters={() => setTab("Posters")} />}
          {tab === "Published" && <PublishedTab toast={toast} />}
          {tab === "Config" && <ConfigTab toast={toast} />}
          {tab === "Leads" && <LeadsTab toast={toast} />}
          {tab === "Super" && isSuper && <SuperTab toast={toast} />}
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-[#0f172a] px-4 py-2.5 text-sm font-semibold text-white shadow-lg">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
