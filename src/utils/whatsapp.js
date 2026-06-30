import { WHATSAPP_NUMBER } from "../data/deals";

// Opens WhatsApp (app on mobile, web on desktop) with a pre-filled message.
export function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
