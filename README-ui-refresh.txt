# TradeLedger UI Refresh (Drop-in)
This folder provides a polished multi-page SPA (Dashboard/Trades/Journal/Analytics/Playbooks/Settings).

## Install (GitHub Pages)
1) Create a folder named `ui-refresh` at the root of your repo.
2) Upload the contents of this `ui-refresh/` folder into that path (drag&drop in GitHub web).
3) Visit: https://<your-username>.github.io/tradeledger/ui-refresh/
4) (Optional) Add to Home Screen on iOS for PWA feel.

Files:
- index.html (shell + router boot)
- styles.css (tokens + layout)
- app.js, router.js, store.js, charts.js
- components/shell.js
- pages/*.js
- sw.js (offline)
- manifest.webmanifest
