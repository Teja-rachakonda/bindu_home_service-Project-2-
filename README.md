# Bindu Home Services

A mobile-first React + Vite digital advertising card — built to be shared as a
link in WhatsApp groups across Canada. Single public page, no backend.

## Tech

- React 19 + Vite
- Tailwind CSS v4 (`@tailwindcss/vite` plugin)

## Run locally

```bash
npm install
npm run dev
```

Then open the printed URL (default **http://localhost:5173**).

Other scripts:

```bash
npm run build     # production build into dist/
npm run preview   # preview the production build locally
```

## Configuration

- WhatsApp number lives in [`src/data/deals.js`](src/data/deals.js) as
  `WHATSAPP_NUMBER` (currently `16477408124`).
- All deal/tab content lives in the same file — edit there, no code changes needed.

## Deploy to Vercel (free)

1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. **Add New… → Project**, then import the repo.
4. Vercel auto-detects Vite. Confirm:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**. You get a free `*.vercel.app` URL to share in WhatsApp.

`vercel.json` is included so the single-page app routes correctly.
