import { useState } from "react";
import { addSubscriber } from "../lib/db";

// "🔔 Alert Me" opt-in. Collects name + phone (consent) and stores the person
// as a subscriber so new offers can be sent to them later (via WhatsApp API).
function SubscribeModal({ open, onClose, onDone }) {
  const [form, setForm] = useState({ firstName: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await addSubscriber({
      name: form.firstName,
      phone: form.phone,
      email: form.email,
    });
    try {
      localStorage.setItem("bindu_subscribed", "1");
    } catch {
      /* ignore */
    }
    setSubmitting(false);
    onDone?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-3 sm:items-center"
      onClick={onClose}
    >
      <div className="w-full max-w-[400px] rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">🔔 Get Deal Alerts</h3>
            <p className="text-sm text-gray-500">Be the first to know when a new offer drops.</p>
          </div>
          <button onClick={onClose} className="text-2xl leading-none text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            required
            value={form.firstName}
            onChange={set("firstName")}
            placeholder="Your name"
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <input
            required
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="WhatsApp number"
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="Email (optional)"
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 w-full rounded-xl bg-brand py-3.5 text-base font-bold text-white transition-transform active:scale-[0.99] disabled:opacity-60"
          >
            {submitting ? "Subscribing…" : "🔔 Notify me of new deals"}
          </button>
          <p className="text-center text-xs text-gray-400">
            By subscribing you agree to receive deal updates on WhatsApp. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
}

export default SubscribeModal;
