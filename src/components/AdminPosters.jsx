import { openWhatsApp } from "../utils/whatsapp";
import { Storage } from "../utils/storage";

// Renders admin-created posters as framed, clickable cards. No visible link:
// tapping silently opens WhatsApp with the poster's pre-filled message and
// records a lead.
function AdminPosters({ posters }) {
  const handleClick = (poster) => {
    Storage.addLead({
      dealName: poster.title || "Poster",
      tab: "Poster",
      action: "Poster tap",
    });
    openWhatsApp(
      poster.waMessage ||
        `Hi! I saw your "${poster.title}" offer and want to know more.`
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {posters.map((poster) => (
        <button
          key={poster.id}
          type="button"
          onClick={() => handleClick(poster)}
          className="relative block w-full overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition-transform active:scale-[0.99]"
        >
          {poster.image ? (
            <img
              src={poster.image}
              alt={poster.title || "Offer"}
              className="block h-auto w-full object-cover"
            />
          ) : (
            <div className="flex h-40 items-center justify-center bg-brand px-4 text-center text-lg font-extrabold text-white">
              {poster.title || "Special Offer"}
            </div>
          )}

          {poster.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow">
              {poster.badge}
            </span>
          )}

          {(poster.title || poster.description) && (
            <div className="bg-white px-4 py-3 text-left">
              {poster.title && (
                <p className="font-bold text-gray-900">{poster.title}</p>
              )}
              {poster.description && (
                <p className="mt-0.5 text-sm text-gray-500">
                  {poster.description}
                </p>
              )}
            </div>
          )}
        </button>
      ))}
      <p className="text-center text-xs font-medium text-gray-500">
        👆 Tap a poster to connect on WhatsApp
      </p>
    </div>
  );
}

export default AdminPosters;
