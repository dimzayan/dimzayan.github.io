# Dim Zayan — Project Notes for Claude

## Artist
- **Name**: Dim Zayan (legal: Gregory Mirzayantz)
- **Born**: France, 1977
- **Based**: Marfa, TX — 208 W El Paso St, Studio 2, Marfa TX 79843
- **Contact**: dim.studio.marfa@gmail.com / @dimzayan
- **Practice**: Oil and epoxy on raw gypsum panels; angle grinder used for surface carving/incising
- **DBA**: "Dim Zayan" registered as assumed name in Presidio County TX (or in progress)

## Site Structure

### Public pages (GitHub Pages)
- `index.html` — homepage
- `artworks.html` — public grid (no ID) + detail view (with `__ARTWORK_ID__`); fetches `/api/inventory`
- `exhibitions.html` — public list (no ID) + exhibition detail (with `__EXHIBIT_ID__`); fetches `/api/exhibits` + `/api/inventory`

### Admin pages (GitHub Pages, protected by Cloudflare Access)
- `admin/index.html` — hub with nav cards (Artworks, Exhibitions, Invoices, Clients)
- `admin/artworks.html` — editable inventory table; uses `js/artworks-table.js` module; Save JSON PUTs to `/api/inventory`
- `admin/exhibitions.html` — list mode (no ID) + detail/editor mode (with `__EXHIBIT_ID__`); rooms editor + works panel; Save PUTs to both `/api/exhibits` and `/api/inventory`
- `admin/invoices.html` — invoice list + viewer
- `admin/clients.html` — clients list + add form
- `dashboard.html` — redirects to `admin/` (kept for backward compat)

### Seed / legacy files (repo only, KV is live source of truth)
- `inventory.json` / `exhibits.json` / `data.json` — seed files only

## Routing (`js/routes.js`)
- Single source of truth for all route definitions — imported by both the Worker and all pages
- `routeUrl(name, params)` — generates correct URL: `?id=` locally, pretty path in production
- `getPageId(varName)` — reads `window.__VAR__` (injected by Worker) or `?id=` query param
- `IS_LOCAL` — true when hostname is not `dimzayan.com`
- Routes: `artworks`, `artwork-view`, `exhibitions`, `exhibition-view`, `admin`, `admin-artworks`, `admin-artwork`, `admin-exhibitions`, `admin-exhibition`, `admin-invoices`, `admin-invoice`, `admin-clients`, `admin-client`

## API / Data Layer (Cloudflare Worker)
- Worker: `worker/index.js` — handles `/api/*` (public reads, Bearer-token writes) and pretty-URL routing for all registered routes
- KV namespace `DIM_KV` — live source of truth for all JSON data
- Write token stored in `localStorage` key `dim_gh_token`
- `wrangler.toml` in `worker/` — deploy with `wrangler deploy` from that directory
- Seed KV on first deploy: `wrangler kv:key put --binding DIM_KV inventory "$(cat inventory.json)"` etc.
- Secret: `wrangler secret put DIM_TOKEN`
- Worker routes in `wrangler.toml`: `dimzayan.com/api/*`, `dimzayan.com/admin*`, `dimzayan.com/artworks*`, `dimzayan.com/exhibitions*`
- Worker injects `<base href="/">` + optional `window.__VAR__="id"` into proxied HTML for pretty URLs

## Inventory / Artworks
- Fields per work: `title`, `dimensions`, `material`, `price`, `year`, `notes`, `photo`, `exhibition` (slug of assigned exhibition, or absent), `reserved` (bool), `invoiced` (object|null)
- No `excluded` field — removed. Exhibition membership is the single source of truth via the `exhibition` field.
- `admin/artworks.html` uses `js/artworks-table.js` (shared module) for all table UI
- Invoice refs stored in `localStorage` key `dim_invoice_refs_v1` (cross-reference only; authoritative data in KV)
- Fallback cache in `localStorage` key `dim_inventory_cache`

## Shared Module: `js/artworks-table.js`
- `initArtworksTable({ tableEl, exhibits, filter, onRightClick })` — sets up editable table with drag/drop, sort, thumbnails, lightbox, edit drawer
- `filter: (id, work) => bool` — used by exhibitions detail page to show only works in that exhibition
- Returns `{ renderData, gatherData, renumberRows, tbody, openEditDrawer, createRow }`
- Injects all shared CSS via `_injectStyles()` (prefixed `at-`)
- `gatherData()` returns only rows currently in the tbody (respects filter)
- Edit drawer has Exhibition dropdown; reads `data.exhibition || data.exhibit` for migration compat; saves as `exhibition`

## Invoice System (in `admin/artworks.html`)
- Right-click context menu: Edit / Preview work sheet / Add to invoice / Clear invoice / Mark as reserved / Delete
- Cart button in header when items queued; click opens modal
- Modal fields: buyer name, address, shipping ($), sales tax (%), local discount (10%), Bitcoin checkbox
- Invoice numbers: sequential, zero-padded 4 digits, starting at 0122 (`dim_invoice_ctr_v1` localStorage)
- Invoice format: `Invoice.0122` — print-ready HTML in new tab
- Invoices stored in `localStorage` key `dim_invoices_v1`
- `js/invoicing.js` — non-module script; accesses `ctxRow`, `tbody`, `renumberRows` as globals set on `window` by the module script

## CDN
- Hi-res: `https://dimzayan.nyc3.digitaloceanspaces.com/works/hi/` (.webp)
- Low-res: `https://dimzayan.nyc3.digitaloceanspaces.com/works/low/` (.webp)
- Local copies: `media/works/hi/` and `media/works/low/`
- **Rule**: all media references in HTML/JS must point to the CDN — never use local paths in production code

## Exhibitions
- Structure per exhibition: `{ id, title, year, location, press: [urls], description, media: [filenames], rooms: [...] }`
- Rooms: `{ photo, hotspots: [{ id, x, y, w, h } | { type:'room', target, x, y, w, h }] }`
- Works are assigned to an exhibition via the `exhibition` field on the inventory item (not stored on the exhibit object)
- `admin/exhibitions.html` detail mode: rooms editor (40/60 split — room list left, canvas editor right) + works panel below using `js/artworks-table.js` filtered to current exhibition; single Save button saves both exhibits and inventory in parallel
- **Homepage exhibitions list** (`index.html`): loaded dynamically via `loadExhibitions()` in the inline module script; fetches `/api/exhibits`; renders into `<dl id="exhibitions-dl">` placeholder in the `exhibitions` entity in `entities.js`; static list was removed from `entities.js`
- **Pending KV rename**: intent is to rename the KV key from `exhibits` → `exhibitions` and update the fetch URL in `index.html`. Worker allowlist already includes `'exhibitions'`. Migration command: `curl -s https://dimzayan.com/api/exhibits | curl -X PUT https://dimzayan.com/api/exhibitions -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d @-`

## GitHub / Hosting
- Repo: `https://github.com/dimzayan/dimzayan.github.io`
- Hosted on GitHub Pages (HTML/JS/assets only), domain dimzayan.com via Cloudflare
- Cloudflare Workers serves `/api/*` and pretty URLs — same zone, no CORS issues
- Cloudflare Access protects entire `/admin*` path with one rule — allowed emails: Dim + colleague
- Secret scanning is active on the repo — never commit tokens or secrets

## Gallery Spreadsheet (art.gallery.xlsx — untracked)
- Tabs: Texas, SW, MW, Cali, EST, New York
- Columns (all except NY): Gallery Name, City, Email, Website, Instagram, Phone, Note, Type
- NY tab adds: Contact column
- Note column = director/contact name and title

## Preferences
- Keep code minimal — no over-engineering, no unnecessary abstractions
- No emojis unless asked
- Invoice and buyer data stays local (localStorage only) — never commit to git
- **Never use localStorage for cross-page data sharing** — localStorage is single-machine only. Cloudflare KV (via `/api/*`) is the source of truth; pages always read from the Worker
- Admin pages use `../js/routes.js` — works locally (relative path) and in production (with `<base href="/">`)
