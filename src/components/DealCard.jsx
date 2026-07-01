import { openWhatsApp } from "../utils/whatsapp";

// Badge colour mapping. Unknown / empty badges render nothing.
const badgeStyles = {
  Popular: "bg-amber-100 text-amber-700",
  "Best Value": "bg-emerald-100 text-emerald-700",
  New: "bg-sky-100 text-sky-700",
};

function DealCard({ deal, categoryName }) {
  const handleGetDeal = () => {
    const from = categoryName ? ` (${categoryName})` : "";
    openWhatsApp(
      `Hi! I am interested in the ${deal.name} plan at ${deal.price}${from}. Can you help me?`
    );
  };

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

      <button
        type="button"
        onClick={handleGetDeal}
        className="mt-3 w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark active:scale-[0.99]"
      >
        Get Deal
      </button>
    </div>
  );
}

export default DealCard;
