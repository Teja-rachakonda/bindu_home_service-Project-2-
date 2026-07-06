// Device-local auth only. All shared app data now lives in Supabase (lib/db.js).
export const Storage = {
  // Auth session
  getSession: () => localStorage.getItem("bindu_session"),
  setSession: (role) => localStorage.setItem("bindu_session", role),
  clearSession: () => localStorage.removeItem("bindu_session"),

  // Master password (super admin)
  getMasterPassword: () => localStorage.getItem("bindu_master_pw") || "8123",
  setMasterPassword: (pw) => localStorage.setItem("bindu_master_pw", pw),

  // Admin password
  getAdminPassword: () => localStorage.getItem("bindu_admin_pw") || "8124",
  setAdminPassword: (pw) => localStorage.setItem("bindu_admin_pw", pw),

  // Security answer (master password recovery)
  getSecurityAnswer: () => localStorage.getItem("bindu_security_answer") || "",
  setSecurityAnswer: (a) => localStorage.setItem("bindu_security_answer", a),

  // Anthropic API key (super admin, AI features)
  getApiKey: () => localStorage.getItem("bindu_api_key") || "",
  setApiKey: (key) => localStorage.setItem("bindu_api_key", key),
};

// Shared helper: trigger a JSON file download in the browser.
export function downloadJSON(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
