import { WHATSAPP_NUMBER } from "../data/deals";
import { Storage } from "./storage";

// Opens WhatsApp (app on mobile, web on desktop) with a pre-filled message.
// The number comes from the admin Config when set, else the built-in default.
// The pre-filled text is what turns a poster tap into a captured lead: the
// moment the person sends it, we get their WhatsApp number.
export function openWhatsApp(message) {
  let number = WHATSAPP_NUMBER;
  try {
    number = Storage.getConfig().waNumber || WHATSAPP_NUMBER;
  } catch {
    /* localStorage unavailable — fall back to default */
  }
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
