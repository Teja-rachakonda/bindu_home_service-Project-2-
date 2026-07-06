import { WHATSAPP_NUMBER } from "../data/deals";
import { getCachedWaNumber } from "../lib/db";

// Opens WhatsApp (app on mobile, web on desktop) with a pre-filled message.
// The number comes from the admin Config (cached from Supabase) when available,
// else the built-in default. The pre-filled text is what turns a poster tap
// into a captured lead: the moment the person sends it, we get their number.
export function openWhatsApp(message) {
  const number = getCachedWaNumber() || WHATSAPP_NUMBER;
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
