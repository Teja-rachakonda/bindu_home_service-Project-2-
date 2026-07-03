import { useMemo, useState } from "react";
import Header from "../components/Header";
import TopPoster from "../components/TopPoster";
import VoiceNote from "../components/VoiceNote";
import TabBar from "../components/TabBar";
import PosterStrip from "../components/PosterStrip";
import DealCard from "../components/DealCard";
import WhatsAppButton from "../components/WhatsAppButton";
import AdminPosters from "../components/AdminPosters";
import { categories } from "../data/deals";
import { Storage } from "../utils/storage";

function Home() {
  // Read admin-configured settings once on mount. Missing/empty → defaults,
  // so the app behaves exactly as before if the admin never touched anything.
  const brand = useMemo(() => Storage.getBrand(), []);
  const config = useMemo(() => Storage.getConfig(), []);
  const adminPosters = useMemo(
    () => Storage.getPosters().filter((p) => p.status === "active"),
    []
  );

  // CHANGE 3 + Config tab — only categories that are active AND not hidden
  // in the admin Config are shown.
  const activeCategories = useMemo(
    () =>
      categories.filter(
        (c) => c.active && config.tabs?.[c.id] !== false
      ),
    [config]
  );

  const [activeId, setActiveId] = useState(activeCategories[0]?.id);
  const active =
    activeCategories.find((c) => c.id === activeId) ?? activeCategories[0];

  const activeDeals = (active?.deals ?? []).filter((d) => d.active !== false);

  return (
    <div className="min-h-svh bg-page">
      <div className="mx-auto flex min-h-svh w-full max-w-[420px] flex-col bg-page sm:shadow-xl sm:ring-1 sm:ring-black/5">
        <Header brand={brand} />

        <main className="flex-1 px-4 pb-40 pt-4">
          {/* Admin-created posters (framed, clickable) at the very top */}
          {adminPosters.length > 0 && (
            <div className="mb-4">
              <AdminPosters posters={adminPosters} />
            </div>
          )}

          {/* CHANGE 1 — category poster banner above the tabs */}
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

      <WhatsAppButton
        label={config.connectText}
        phone={brand.phone}
        callText={config.callText}
      />
    </div>
  );
}

export default Home;
