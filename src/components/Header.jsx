// Header text/logo can be overridden by the admin Brand settings; when unset
// it falls back to the original Bindu defaults so nothing changes by default.
function Header({ brand = {} }) {
  const title = brand.header1 || "Bindu Home Services";
  const subtitle = brand.header2 || "Canada's Best Home Deals";
  const logo = brand.logo || "🏠";
  const logoIsImage =
    typeof logo === "string" &&
    (logo.startsWith("data:") || logo.startsWith("http") || logo.startsWith("/"));

  return (
    <header className="bg-brand text-white rounded-b-2xl px-5 pt-6 pb-4 shadow-md">
      <div className="flex items-center gap-3">
        {/* Logo (emoji/text, or uploaded image) */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/15 text-2xl">
          {logoIsImage ? (
            <img src={logo} alt="logo" className="h-full w-full object-cover" />
          ) : (
            logo
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold leading-tight">{title}</h1>
          <p className="text-sm text-white/80 leading-tight">{subtitle}</p>
        </div>

        {/* Live offers indicator */}
        <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-blink absolute inline-flex h-full w-full rounded-full bg-green-400" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
          </span>
          <span className="text-xs font-medium">Live Offers</span>
        </div>
      </div>

      {/* Promo banner */}
      <div className="mt-4 rounded-xl bg-white/15 px-4 py-2.5 text-center text-sm font-semibold backdrop-blur-sm">
        Special Promo — Save up to $240/year 🎉
      </div>
    </header>
  );
}

export default Header;
