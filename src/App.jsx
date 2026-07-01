import { useMemo, useState } from "react";
import Header from "./components/Header";
import TopPoster from "./components/TopPoster";
import VoiceNote from "./components/VoiceNote";
import TabBar from "./components/TabBar";
import PosterStrip from "./components/PosterStrip";
import DealCard from "./components/DealCard";
import WhatsAppButton from "./components/WhatsAppButton";
import { categories } from "./data/deals";

function App() {
  // CHANGE 3 — only categories flagged active: true are shown.
  const activeCategories = useMemo(
    () => categories.filter((c) => c.active),
    []
  );

  const [activeId, setActiveId] = useState(activeCategories[0]?.id);
  const active =
    activeCategories.find((c) => c.id === activeId) ?? activeCategories[0];

  // Only active deals within the selected category.
  const activeDeals = (active?.deals ?? []).filter((d) => d.active !== false);

  return (
    <div className="min-h-svh bg-page">
      <div className="mx-auto flex min-h-svh w-full max-w-[420px] flex-col">
        <Header />

        <main className="flex-1 px-4 pb-40 pt-4">
          {/* CHANGE 1 — poster banner above the tabs */}
          {active?.poster && (
            <div className="mb-4">
              <TopPoster poster={active.poster} name={active.name} />
            </div>
          )}

          {/* CHANGE 2 — voice note player below the poster */}
          {active?.voiceNote && (
            <div className="mb-4">
              <VoiceNote src={active.voiceNote} />
            </div>
          )}

          {/* Tabs */}
          {activeCategories.length > 1 && (
            <TabBar
              categories={activeCategories}
              activeId={activeId}
              onChange={setActiveId}
            />
          )}

          {/* `key` forces a remount so content transitions per tab */}
          <div key={active?.id} className="animate-fade-in mt-3 flex flex-col gap-3">
            {/* CHANGE 4 — extra posters as a horizontal strip above the deals */}
            {active?.posters?.length > 0 && (
              <PosterStrip posters={active.posters} />
            )}

            {activeDeals.map((deal) => (
              <DealCard
                key={deal.name}
                deal={deal}
                categoryName={active?.name}
              />
            ))}
          </div>
        </main>
      </div>

      <WhatsAppButton />
    </div>
  );
}

export default App;
