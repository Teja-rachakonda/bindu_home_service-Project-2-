// Central WhatsApp number used as a fallback (admin Config overrides it).
export const WHATSAPP_NUMBER = "16477408124";

// Fallback tab list used before the admin has created any categories in
// Supabase (or if the categories table doesn't exist yet). `key` is the stable
// id stored on each offer (offers.category).
export const DEFAULT_CATEGORIES = [
  { key: "internet", name: "Internet Deals", sortOrder: 1, active: true },
  { key: "rental", name: "Rental", sortOrder: 2, active: true },
  { key: "homePhone", name: "Home Phone", sortOrder: 3, active: true },
  { key: "mobile", name: "Mobile Plans", sortOrder: 4, active: true },
];

// Optional hero assets (top poster / voice note / poster strip) for the
// built-in tabs. New admin-created tabs simply have none.
export const CATEGORY_ASSETS = {
  internet: {
    poster: "/posters/internet.svg",
    voiceNote: "https://www.w3schools.com/html/horse.mp3",
    posters: ["/posters/strip-cashback.svg", "/posters/strip-600.svg"],
  },
  rental: { poster: "/posters/rental.svg", voiceNote: "", posters: [] },
  homePhone: { poster: "/posters/homephone.svg", voiceNote: "", posters: [] },
  mobile: { poster: "/posters/mobile.svg", voiceNote: "", posters: [] },
};
