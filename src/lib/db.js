import { supabase } from "./supabase";
import { DEFAULT_CATEGORIES } from "../data/deals";

/*
 * Async data-access layer backed by Supabase. Components use camelCase; the
 * database uses snake_case — these helpers translate between the two.
 * Auth (session, passwords, api key) stays device-local in utils/storage.js.
 */

const ZERO_UUID = "00000000-0000-0000-0000-000000000000";

const toSnake = (obj) => {
  const out = {};
  for (const k in obj)
    out[k.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase())] = obj[k];
  return out;
};
const toCamel = (obj) => {
  if (!obj) return obj;
  const out = {};
  for (const k in obj) out[k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] = obj[k];
  return out;
};
const toCamelList = (arr) => (arr || []).map(toCamel);

// Cache the WhatsApp number so the synchronous openWhatsApp() can read it.
let _waNumberCache = "16477408124";
export const getCachedWaNumber = () => _waNumberCache;

/* ───────────── BRAND (singleton id=1) ───────────── */
export async function getBrand() {
  const { data } = await supabase.from("brand").select("*").eq("id", 1).maybeSingle();
  return toCamel(data) || {};
}
export async function saveBrand(patch) {
  const row = toSnake(patch);
  delete row.id;
  row.updated_at = new Date().toISOString();
  const { data, error } = await supabase
    .from("brand").update(row).eq("id", 1).select().maybeSingle();
  if (error) throw error;
  return toCamel(data);
}

/* ───────────── CONFIG (singleton id=1) ───────────── */
export async function getConfig() {
  const { data } = await supabase.from("config").select("*").eq("id", 1).maybeSingle();
  if (data?.wa_number) _waNumberCache = data.wa_number;
  return toCamel(data) || {};
}
export async function saveConfig(patch) {
  const row = toSnake(patch);
  delete row.id;
  row.updated_at = new Date().toISOString();
  const { data, error } = await supabase
    .from("config").update(row).eq("id", 1).select().maybeSingle();
  if (error) throw error;
  if (data?.wa_number) _waNumberCache = data.wa_number;
  return toCamel(data);
}

/* ───────────── POSTERS ───────────── */
export async function getPosters() {
  const { data } = await supabase
    .from("posters").select("*").order("sort_order").order("created_at");
  return toCamelList(data);
}
export async function getActivePosters() {
  const { data } = await supabase
    .from("posters").select("*").eq("status", "active").order("sort_order");
  return toCamelList(data);
}
export async function savePoster(poster) {
  const row = toSnake(poster);
  delete row.created_at;
  if (row.id) {
    const { data, error } = await supabase
      .from("posters").update(row).eq("id", row.id).select().maybeSingle();
    if (error) throw error;
    return toCamel(data);
  }
  delete row.id;
  const { data, error } = await supabase.from("posters").insert(row).select().maybeSingle();
  if (error) throw error;
  return toCamel(data);
}
export async function deletePoster(id) {
  await supabase.from("posters").delete().eq("id", id);
}

/* ───────────── CATEGORIES (tabs) ───────────── */
const slugKey = (name) =>
  (name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "") || `tab_${Date.now()}`;

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories").select("*").order("sort_order");
  // Fall back to the built-in tabs if the table doesn't exist yet / is empty.
  if (error || !data || data.length === 0) return DEFAULT_CATEGORIES;
  return toCamelList(data);
}
export async function saveCategory(c) {
  const row = toSnake(c);
  delete row.created_at;
  if (!row.key) row.key = slugKey(c.name);
  if (row.id) {
    const { data, error } = await supabase
      .from("categories").update(row).eq("id", row.id).select().maybeSingle();
    if (error) throw error;
    return toCamel(data);
  }
  delete row.id;
  const { data, error } = await supabase.from("categories").insert(row).select().maybeSingle();
  if (error) throw error;
  return toCamel(data);
}
export async function deleteCategory(id) {
  await supabase.from("categories").delete().eq("id", id);
}

/* ───────────── OFFERS (deal cards) ───────────── */
export async function getOffers() {
  const { data } = await supabase
    .from("offers").select("*").order("category").order("sort_order");
  return toCamelList(data);
}
export async function saveOffer(offer) {
  const row = toSnake(offer);
  delete row.created_at;
  if (row.id) {
    const { data, error } = await supabase
      .from("offers").update(row).eq("id", row.id).select().maybeSingle();
    if (error) throw error;
    return toCamel(data);
  }
  delete row.id;
  const { data, error } = await supabase.from("offers").insert(row).select().maybeSingle();
  if (error) throw error;
  return toCamel(data);
}
export async function deleteOffer(id) {
  await supabase.from("offers").delete().eq("id", id);
}

/* ───────────── TEMPLATES ───────────── */
export async function getTemplates() {
  const { data } = await supabase.from("templates").select("*").order("created_at");
  return toCamelList(data);
}
export async function saveTemplate(t) {
  const row = toSnake(t);
  delete row.created_at;
  if (row.id) {
    const { data, error } = await supabase
      .from("templates").update(row).eq("id", row.id).select().maybeSingle();
    if (error) throw error;
    return toCamel(data);
  }
  delete row.id;
  const { data, error } = await supabase.from("templates").insert(row).select().maybeSingle();
  if (error) throw error;
  return toCamel(data);
}
export async function deleteTemplate(id) {
  await supabase.from("templates").delete().eq("id", id);
}

/* ───────────── LEADS ───────────── */
export async function getLeads() {
  const { data } = await supabase
    .from("leads").select("*").order("created_at", { ascending: false });
  return toCamelList(data);
}
export async function addLead(lead) {
  // Fire-and-forget from callers; swallow errors so UX never blocks on it.
  const { error } = await supabase.from("leads").insert(toSnake(lead));
  if (error) console.warn("addLead failed:", error.message);
}
export async function clearLeads() {
  await supabase.from("leads").delete().neq("id", ZERO_UUID);
}

/* ───────────── ADMIN USERS ───────────── */
export async function getAdminUsers() {
  const { data } = await supabase.from("admin_users").select("*").order("created_at");
  return toCamelList(data);
}
export async function addAdminUser(u) {
  const row = toSnake(u);
  delete row.id;
  delete row.created_at;
  const { data, error } = await supabase
    .from("admin_users").insert(row).select().maybeSingle();
  if (error) throw error;
  return toCamel(data);
}
export async function deleteAdminUser(id) {
  await supabase.from("admin_users").delete().eq("id", id);
}

/* ───────────── BACKUP / RESET ───────────── */
export async function backupAll() {
  const [brand, config, posters, offers, leads, templates, adminUsers] = await Promise.all([
    getBrand(), getConfig(), getPosters(), getOffers(), getLeads(), getTemplates(), getAdminUsers(),
  ]);
  const payload = {
    brand, config, posters, offers, leads, templates, adminUsers,
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bindu_backup.json";
  a.click();
  URL.revokeObjectURL(url);
}
export async function resetAllData() {
  // Clears the list tables. Brand & config singletons are left in place.
  await Promise.all([
    supabase.from("posters").delete().neq("id", ZERO_UUID),
    supabase.from("offers").delete().neq("id", ZERO_UUID),
    supabase.from("templates").delete().neq("id", ZERO_UUID),
    supabase.from("leads").delete().neq("id", ZERO_UUID),
    supabase.from("admin_users").delete().neq("id", ZERO_UUID),
  ]);
}
