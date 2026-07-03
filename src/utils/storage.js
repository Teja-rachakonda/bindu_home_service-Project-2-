// Central localStorage helper for the admin panel + public card.
// Everything the admin configures is persisted here and read back by Home.jsx.
export const Storage = {
  // Brand
  getBrand: () => JSON.parse(localStorage.getItem("bindu_brand") || "{}"),
  saveBrand: (data) =>
    localStorage.setItem("bindu_brand", JSON.stringify(data)),

  // Posters
  getPosters: () => JSON.parse(localStorage.getItem("bindu_posters") || "[]"),
  savePosters: (data) =>
    localStorage.setItem("bindu_posters", JSON.stringify(data)),

  // Leads
  getLeads: () => JSON.parse(localStorage.getItem("bindu_leads") || "[]"),
  addLead: (lead) => {
    const leads = Storage.getLeads();
    leads.unshift({
      ...lead,
      id: Date.now(),
      time: new Date().toLocaleString(),
    });
    localStorage.setItem("bindu_leads", JSON.stringify(leads));
  },
  clearLeads: () => localStorage.removeItem("bindu_leads"),

  // Config
  getConfig: () =>
    JSON.parse(
      localStorage.getItem("bindu_config") ||
        '{"waNumber":"16477408124","plan":"Professional","maxPosters":10,"agentEmail":"agent@pabbarealty.com"}'
    ),
  saveConfig: (data) =>
    localStorage.setItem("bindu_config", JSON.stringify(data)),

  // Auth
  getSession: () => localStorage.getItem("bindu_session"),
  setSession: (role) => localStorage.setItem("bindu_session", role),
  clearSession: () => localStorage.removeItem("bindu_session"),

  // Admin users
  getAdminUsers: () =>
    JSON.parse(localStorage.getItem("bindu_admin_users") || "[]"),
  saveAdminUsers: (data) =>
    localStorage.setItem("bindu_admin_users", JSON.stringify(data)),

  // Master password
  getMasterPassword: () => localStorage.getItem("bindu_master_pw") || "8123",
  setMasterPassword: (pw) => localStorage.setItem("bindu_master_pw", pw),

  // Admin password
  getAdminPassword: () => localStorage.getItem("bindu_admin_pw") || "8124",
  setAdminPassword: (pw) => localStorage.setItem("bindu_admin_pw", pw),

  // Security answer (master password recovery)
  getSecurityAnswer: () => localStorage.getItem("bindu_security_answer") || "",
  setSecurityAnswer: (a) => localStorage.setItem("bindu_security_answer", a),

  // API Key
  getApiKey: () => localStorage.getItem("bindu_api_key") || "",
  setApiKey: (key) => localStorage.setItem("bindu_api_key", key),

  // Backup all data
  backupAll: () => {
    const data = {
      brand: Storage.getBrand(),
      posters: Storage.getPosters(),
      leads: Storage.getLeads(),
      config: Storage.getConfig(),
      adminUsers: Storage.getAdminUsers(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bindu_backup.json";
    a.click();
    URL.revokeObjectURL(url);
  },

  // Reset all
  resetAll: () => {
    [
      "bindu_brand",
      "bindu_posters",
      "bindu_leads",
      "bindu_config",
      "bindu_admin_users",
    ].forEach((k) => localStorage.removeItem(k));
  },
};

// Small shared helper: trigger a JSON file download in the browser.
export function downloadJSON(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
