import { openWhatsApp } from "../utils/whatsapp";

// CHANGE 4 — horizontal, scrollable strip of extra posters shown above the
// deals. Each poster is clickable and opens WhatsApp.
function PosterStrip({ posters }) {
  const handleClick = () => {
    openWhatsApp("Hi! I saw your offer poster and want to know more.");
  };

  return (
    <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
      {posters.map((url, i) => (
        <button
          key={url + i}
          type="button"
          onClick={handleClick}
          className="shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.98]"
        >
          <img
            src={url}
            alt={`Offer ${i + 1}`}
            className="h-28 w-auto object-cover"
          />
        </button>
      ))}
    </div>
  );
}

export default PosterStrip;
