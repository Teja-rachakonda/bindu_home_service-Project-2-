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
import SubscribeModal from "../components/SubscribeModal";
import { CATEGORY_ASSETS } from "../data/deals";
import * as db from "../lib/db";

function Home() {
  const [brand, setBrand] = useState({});
  const [config, setConfig] = useState({});
  const [adminPosters, setAdminPosters] = useState([]);
  const [offers, setOffers] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [leadReq, setLeadReq] = useState(null); // "Click Here" lead-capture request
  const [showSub, setShowSub] = useState(false);
  const [subscribed, setSubscribed] = useState(
    typeof localStorage !== "undefined" && localStorage.getItem("bindu_subscribed") === "1"
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      const [b, c, ap, off, ct] = await Promise.all([
        db.getBrand(),
        db.getConfig(),
        db.getActivePosters(),
        db.getOffers(),
        db.getCategories(),
      ]);
      if (!alive) return;
      setBrand(b);
      setConfig(c);
      setAdminPosters(ap);
      setOffers(off);
      setCats(ct);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Active tabs (from admin), each merged with its hero assets + DB offers.
  // `id` = the category key so the rest of the UI can stay the same.
  const activeCategories = useMemo(
    () =>
      cats
        .filter((c) => c.active !== false)
        .map((c) => ({
          id: c.key,
          name: c.name,
          ...(CATEGORY_ASSETS[c.key] || {}),
          deals: offers.filter((o) => o.category === c.key && o.active !== false),
        })),
    [cats, offers]
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
  const socials = Array.isArray(config.socials) ? config.socials : [];

  return (
    <div className="min-h-svh bg-page">
      <div className="mx-auto flex min-h-svh w-full max-w-[420px] flex-col bg-page sm:shadow-xl sm:ring-1 sm:ring-black/5">
        <Header brand={brand} />

        <main className="flex-1 px-4 pb-40 pt-4">
          {loading ? (
            <p className="py-16 text-center text-sm text-gray-400">Loading offers…</p>
          ) : (
            <>
              {/* 🔔 Alert Me — subscribe for new-deal alerts */}
              <button
                type="button"
                onClick={() => setShowSub(true)}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 py-2.5 text-sm font-bold text-amber-800 active:scale-[0.99]"
              >
                🔔 {subscribed ? "You're subscribed — update alerts" : "Get alerts for new deals"}
              </button>

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

              {/* Footer: social links + brand details */}
              <footer className="mt-8 border-t border-gray-100 pt-4 text-center">
                {socials.length > 0 && (
                  <div className="mb-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
                    {socials.map((s, i) => (
                      <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-brand"
                      >
                        {s.name || s.url}
                      </a>
                    ))}
                  </div>
                )}
                {brand.footerTop && <p className="text-sm font-semibold text-gray-700">{brand.footerTop}</p>}
                {brand.footerBottom && <p className="text-xs text-gray-500">{brand.footerBottom}</p>}
                {brand.phone && <p className="mt-0.5 text-xs text-gray-500">📞 {brand.phone}</p>}
              </footer>
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
      <SubscribeModal
        open={showSub}
        onClose={() => setShowSub(false)}
        onDone={() => setSubscribed(true)}
      />
    </div>
  );
}

export default Home;
