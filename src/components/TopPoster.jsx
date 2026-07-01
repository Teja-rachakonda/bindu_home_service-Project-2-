import { openWhatsApp } from "../utils/whatsapp";

// CHANGE 1 — full-width, rounded, clickable poster banner shown above the tabs.
function TopPoster({ poster, name }) {
  const handleClick = () => {
    openWhatsApp("Hi! I saw your special offer poster and want to know more.");
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        className="block w-full overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition-transform active:scale-[0.99]"
      >
        <img
          src={poster}
          alt={name ? `${name} offer` : "Special offer"}
          className="block h-auto w-full bg-brand object-cover"
          onError={(e) => {
            // If the image can't load, show a coloured fallback banner so the
            // poster area is never blank.
            const el = e.currentTarget;
            el.style.display = "none";
            el.parentElement.classList.add(
              "flex",
              "h-40",
              "items-center",
              "justify-center",
              "bg-brand"
            );
            el.parentElement.insertAdjacentHTML(
              "beforeend",
              '<span class="px-4 text-center text-lg font-extrabold text-white">🔥 Special Offer — Tap to learn more</span>'
            );
          }}
        />
      </button>
      <p className="mt-1.5 text-center text-xs font-medium text-gray-500">
        👆 Tap above to learn more
      </p>
    </div>
  );
}

export default TopPoster;
