import { useState } from "react";

// Badge colour mapping. Unknown / empty badges render nothing.
const badgeStyles = {
  Popular: "bg-amber-100 text-amber-700",
  "Best Value": "bg-emerald-100 text-emerald-700",
  New: "bg-sky-100 text-sky-700",
};

// Circular icons matching the adaptive-card Approve/Decline style.
function CheckCircle({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XCircle({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.7 7.3a1 1 0 00-1.4 1.4L8.6 10l-1.3 1.3a1 1 0 101.4 1.4L10 11.4l1.3 1.3a1 1 0 001.4-1.4L11.4 10l1.3-1.3a1 1 0 00-1.4-1.4L10 8.6 8.7 7.3z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function DealCard({ deal, categoryName, onRequestLead }) {
  const [declined, setDeclined] = useState(false);

  const handleInterested = () => {
    const from = categoryName ? ` (${categoryName})` : "";
    onRequestLead({
      dealName: deal.name,
      tab: categoryName || "",
      action: "Interested",
      waMessage: `Hi! I am interested in the ${deal.name} plan at ${deal.price}${from}. Can you help me?`,
    });
  };

  // Declined ("Not now") — collapse the card into a small dismissible row.
  if (declined) {
    return (
      <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-500 ring-1 ring-gray-100">
        <span>No problem — maybe later 👍</span>
        <button
          type="button"
          onClick={() => setDeclined(false)}
          className="font-semibold text-brand hover:underline"
        >
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-gray-900">{deal.name}</h3>
            {deal.badge && (
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  badgeStyles[deal.badge] || "bg-gray-100 text-gray-600",
                ].join(" ")}
              >
                {deal.badge}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-gray-500">{deal.details}</p>
          <p className="mt-1 text-sm text-gray-400">{deal.tag}</p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-lg font-extrabold text-brand">{deal.price}</p>
        </div>
      </div>

      {/* Adaptive-card style choice: Interested / Not now */}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleInterested}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark active:scale-[0.99]"
        >
          <CheckCircle className="h-4 w-4" />
          Interested
        </button>
        <button
          type="button"
          onClick={() => setDeclined(true)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 active:scale-[0.99]"
        >
          <XCircle className="h-4 w-4" />
          Not now
        </button>
      </div>
    </div>
  );
}

export default DealCard;
