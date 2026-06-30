import { useState } from "react";
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import DealCard from "./components/DealCard";
import WhatsAppButton from "./components/WhatsAppButton";
import { deals, tabs } from "./data/deals";

function App() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const activeDeals = deals[activeTab] ?? [];

  return (
    <div className="min-h-svh bg-page">
      <div className="mx-auto flex min-h-svh w-full max-w-[420px] flex-col">
        <Header />

        <main className="flex-1 px-4 pb-32 pt-4">
          <div className="sticky top-0 z-10 -mx-4 bg-page/90 px-4 pb-2 pt-1 backdrop-blur">
            <TabBar activeTab={activeTab} onChange={setActiveTab} />
          </div>

          {/* `key` forces a remount so the fade-in animation replays per tab */}
          <div
            key={activeTab}
            className="animate-fade-in mt-3 flex flex-col gap-3"
          >
            {activeDeals.map((deal) => (
              <DealCard key={deal.name} deal={deal} />
            ))}
          </div>
        </main>
      </div>

      <WhatsAppButton />
    </div>
  );
}

export default App;
