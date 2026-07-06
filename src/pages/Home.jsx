import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import TopPoster from "../components/TopPoster";
import VoiceNote from "../components/VoiceNote";
import TabBar from "../components/TabBar";
import PosterStrip from "../components/PosterStrip";
import DealCard from "../components/DealCard";
import WhatsAppButton from "../components/WhatsAppButton";
import AdminPosters from "../components/AdminPosters";
import LeadModal from "../components/LeadModal";
import { categories } from "../data/deals";
import * as db from "../lib/db";

// Static per-tab metadata (name, hero poster, voice note, poster strip).
// The actual deals ("offers") come from Supabase and are merged in below.
const CATEGORY_META = categories.map(({ deals: _deals, ...meta }) => meta);

function Home() {
  const [brand, setBrand] = useState({});
  const [config, setConfig] = useState({});
  const [adminPosters, setAdminPosters] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [leadReq, setLeadReq] = useState(null); // "Click Here" lead-capture request

  useEffect(() => {
    let alive = true;
    (async () => {
      const [b, c, ap, off] = await Promise.all([
        db.getBrand(),
        db.getConfig(),
        db.getActivePosters(),
        db.getOffers(),
      ]);
      if (!alive) return;
      setBrand(b);
      setConfig(c);
      setAdminPosters(ap);
      setOffers(off);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Categories that are active and not hidden in admin Config, each with its
  // DB offers merged in.
  const activeCategories = useMemo(
    () =>
      CATEGORY_META.filter(
        (c) => c.active && config.tabs?.[c.id] !== false
      ).map((c) => ({
        ...c,
        deals: offers.filter((o) => o.category === c.id && o.active !== false),
      })),
    [config, offers]
  );

  // Pick the first tab once categories are known.
  useEffect(() => {
    if (activeId == null && activeCategories.length > 0) {
      setActiveId(activeCategories[0].id);
    }
  }, [activeCategories, activeId]);

  const active =
    activeCategories.find((c) => c.id === activeId) ?? activeCategories[0];
  const activeDeals = active?.deals ?? [];

  return (
    <div className="min-h-svh bg-page">
      <div className="mx-auto flex min-h-svh w-full max-w-[420px] flex-col bg-page sm:shadow-xl sm:ring-1 sm:ring-black/5">
        <Header brand={brand} />

        <main className="flex-1 px-4 pb-40 pt-4">
          {loading ? (
            <p className="py-16 text-center text-sm text-gray-400">Loading offers…</p>
          ) : (
            <>
              {/* Admin-created posters (framed, clickable) at the very top */}
              {adminPosters.length > 0 && (
                <div className="mb-4">
                  <AdminPosters posters={adminPosters} onRequestLead={setLeadReq} />
                </div>
              )}

              {/* Category poster banner above the tabs */}
              {active?.poster && (
                <div className="mb-4">
                  <TopPoster poster={active.poster} name={active.name} />
                </div>
              )}

              {/* Voice note player below the poster */}
              {active?.voiceNote && (
                <div className="mb-4">
                  <VoiceNote src={active.voiceNote} />
                </div>
              )}

              {/* Tabs */}
              {activeCategories.length > 1 && (
                <TabBar
                  categories={activeCategories}
                  activeId={active?.id}
                  onChange={setActiveId}
                />
              )}

              {/* `key` forces a remount so content transitions per tab */}
              <div key={active?.id} className="animate-fade-in mt-3 flex flex-col gap-3">
                {active?.posters?.length > 0 && (
                  <PosterStrip posters={active.posters} />
                )}

                {activeDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    categoryName={active?.name}
                    onRequestLead={setLeadReq}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      <WhatsAppButton
        label={config.connectText}
        phone={brand.phone}
        callText={config.callText}
        onRequestLead={setLeadReq}
      />

      <LeadModal req={leadReq} onClose={() => setLeadReq(null)} />
    </div>
  );
}

export default Home;
