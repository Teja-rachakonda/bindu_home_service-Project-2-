import { addLead } from "../lib/db";

// Inline WhatsApp glyph so we don't depend on an icon library.
function WhatsAppIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  );
}

// CHANGE 5 — more prominent chat button with an "Online Now" status.
// `label`, `phone` and `callText` come from the admin Brand/Config settings.
function WhatsAppButton({ label, phone, callText, onRequestLead }) {
  const handleChat = () => {
    onRequestLead({
      dealName: "General enquiry",
      tab: "",
      action: "Chat with Agent",
      waMessage: "Hi! I saw your offer and I would like to know more.",
    });
  };

  const handleCall = () => {
    addLead({ dealName: "Call request", tab: "", action: "Call" });
    window.location.href = `tel:${phone.replace(/[^\d+]/g, "")}`;
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto w-full max-w-[420px] px-4 pt-2 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="pointer-events-auto rounded-2xl bg-gradient-to-t from-page via-page/95 to-transparent">
          {/* Online status row */}
          <div className="mb-1.5 flex items-center justify-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-blink absolute inline-flex h-full w-full rounded-full bg-green-500" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span className="text-xs font-semibold text-gray-700">Online Now</span>
          </div>

          <button
            type="button"
            onClick={handleChat}
            className="animate-pulse-glow flex w-full items-center justify-center gap-2 rounded-2xl bg-whatsapp py-4 text-lg font-extrabold text-white shadow-lg transition-transform active:scale-[0.99]"
          >
            <WhatsAppIcon className="h-7 w-7" />
            <span>{label || "💬 Chat with Agent"}</span>
          </button>

          {/* Optional call button — only when a phone number is configured */}
          {phone && (
            <button
              type="button"
              onClick={handleCall}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3 text-base font-bold text-white transition-transform active:scale-[0.99]"
            >
              {callText || "📞 Call Us Now"}
            </button>
          )}

          <p className="mt-1.5 text-center text-xs text-gray-500">
            Usually replies in 2 minutes
          </p>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppButton;
