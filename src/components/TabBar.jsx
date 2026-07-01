// CHANGE 3 — tabs are driven by the `categories` list; App passes only the
// active ones, so hiding a tab is just `active: false` in deals.js.
function TabBar({ categories, activeId, onChange }) {
  return (
    <nav className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
      {categories.map((cat) => {
        const isActive = cat.id === activeId;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={[
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
              isActive
                ? "bg-brand text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100",
            ].join(" ")}
          >
            {cat.name}
          </button>
        );
      })}
    </nav>
  );
}

export default TabBar;
