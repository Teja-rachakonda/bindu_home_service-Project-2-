import { tabs } from "../data/deals";

function TabBar({ activeTab, onChange }) {
  return (
    <nav className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={[
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
              isActive
                ? "bg-brand text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

export default TabBar;
