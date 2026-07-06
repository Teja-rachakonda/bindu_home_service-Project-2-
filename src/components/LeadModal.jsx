import { useState } from "react";
import { addLead } from "../lib/db";
import { openWhatsApp } from "../utils/whatsapp";

/*
 * "Click Here → share your details" capture card. Opened when a visitor taps a
 * deal or poster. Collects First/Last/Phone/Email, saves the lead to Supabase,
 * then hands off to WhatsApp with a personalised message.
 */
function LeadModal({ req, onClose }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  if (!req) return null;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await addLead({
      dealName: req.dealName,
      tab: req.tab,
      action: req.action,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email,
    });
    const who = form.firstName ? ` My name is ${form.firstName} ${form.lastName}.`.trimEnd() : "";
    openWhatsApp((req.waMessage || "Hi! I want to know more about your offer.") + who);
    setSubmitting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-3 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[400px] rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">I want to know more</h3>
            {req.dealName && (
              <p className="text-sm text-brand font-semibold">{req.dealName}</p>
            )}
          </div>
          <button onClick={onClose} className="text-2xl leading-none text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-500">Please share your details and our agent will help you.</p>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              required
              value={form.firstName}
              onChange={set("firstName")}
              placeholder="First name"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <input
              value={form.lastName}
              onChange={set("lastName")}
              placeholder="Last name"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="Phone number"
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
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp py-3.5 text-base font-bold text-white transition-transform active:scale-[0.99] disabled:opacity-60"
          >
            {submitting ? "Sending…" : "💬 Continue on WhatsApp"}
          </button>
          <p className="text-center text-xs text-gray-400">Takes 5 seconds — no sign up needed</p>
        </form>
      </div>
    </div>
  );
}

export default LeadModal;
