# Dim Zayan — Project Notes for Claude

## Artist
- **Name**: Dim Zayan (legal: Gregory Mirzayantz)
- **Born**: France, 1977
- **Based**: Marfa, TX — 208 W El Paso St, Studio 2, Marfa TX 79843
- **Contact**: dim.studio.marfa@gmail.com / @dimzayan
- **Practice**: Oil and epoxy on raw gypsum panels; angle grinder used for surface carving/incising
- **DBA**: "Dim Zayan" registered as assumed name in Presidio County TX (or in progress)

## Site Structure
- `index.html` — homepage
- `works.html` — public-facing grid; fetches `/api/inventory` (Cloudflare Worker), falls back to `localStorage` (`dim_inventory_order_v2` for order)
- `inventory.html` — private inventory management tool; protected via Cloudflare Access (email OTP)
- `inventory.json` / `exhibits.json` / `data.json` — seed files in repo; KV is the live source of truth

## API / Data Layer (Cloudflare Worker)
- Worker: `worker/index.js` — handles `GET /api/inventory`, `GET /api/exhibits`, `GET /api/data` (public, no token) and `PUT` variants (Bearer token required)
- KV namespace `DIM_KV` — live source of truth for all JSON data; immediately consistent, no CDN cache lag
- Write token stored in `localStorage` key `dim_gh_token` (same key as before, now points to Worker not GitHub)
- `wrangler.toml` in `worker/` — deploy with `wrangler deploy` from that directory
- Seed KV on first deploy: `wrangler kv:key put --binding DIM_KV inventory "$(cat inventory.json)"` etc.
- Secret: `wrangler secret put DIM_TOKEN`

## Inventory System
- Data stored in `localStorage` key `dim_inventory_v2` (local cache / fallback only)
- Manual order stored in `localStorage` key `dim_inventory_order_v2`
- Fields per work: title, dimensions, material, price, year, notes, excluded (bool), invoiced (object|null)
- `inventory.html` fetches `/api/inventory` (fresh, no token needed for reads); Save JSON PUTs to `/api/inventory` with Bearer token
- Colleague also has Cloudflare Access — sees same inventory via `/api/inventory`

## Invoice System (in inventory.html)
- Right-click any row for context menu: Add to invoice / Open invoice / Clear invoice / Exclude / Delete
- Cart button appears in header when items are queued; click to open modal
- Modal fields: buyer name, address, shipping ($), sales tax (%), local discount (10% checkbox), Bitcoin checkbox
- Invoice numbers: sequential, zero-padded 4 digits, starting at 0122 (counter in `localStorage` key `dim_invoice_ctr_v1`)
- Invoice format: `Invoice.0122` — date + number on document
- Invoices stored in `localStorage` key `dim_invoices_v1`
- Invoice opens in new tab (print-ready HTML); "Mark as paid" calls back via `window.opener.dimZayanInvoicePaid()`
- Payment methods: Venmo @gregory-mirzayantz, Apple Pay 646 678 1468, Bitcoin optional
- Invoiced rows show `INV.XXXX` tag; click to reopen invoice

## CDN
- Hi-res: `https://dimzayan.nyc3.digitaloceanspaces.com/works/hi/` (.webp)
- Low-res: `https://dimzayan.nyc3.digitaloceanspaces.com/works/low/` (.webp)
- Local copies: `media/works/hi/` and `media/works/low/`
- **Rule**: all media references in HTML/JS must point to the CDN — never use local paths in production code

## Exhibits
- `exhibits.html` — public exhibit page, accessed via `?id=[slug]`; reads `/api/exhibits` and `/api/inventory` (no token)
- `dashboard.html` — exhibit editor; reads/writes `/api/exhibits` via Worker (Bearer token for writes)
- `exhibits.json` — seed only; live data is in KV (`exhibits` key)
- Structure per exhibit: `{ id, title, year, location, press: [urls], description, media: [filenames], rooms: [...] }`
- Media filenames resolve to CDN hi-res: `https://dimzayan.nyc3.digitaloceanspaces.com/works/hi/[filename]`

## GitHub / Hosting
- Repo: `https://github.com/dimzayan/dimzayan.github.io`
- Hosted on GitHub Pages (HTML/JS/assets only), domain dimzayan.com via Cloudflare
- Cloudflare Workers serves `/api/*` — same zone, no cross-origin issues
- Cloudflare Access protects `/inventory.html` and `/dashboard.html` — allowed emails: Dim + colleague
- Secret scanning is active on the repo — never commit tokens or secrets

## Gallery Spreadsheet (art.gallery.xlsx — untracked)
- Tabs: Texas, SW, MW, Cali, EST, New York
- Columns (all except NY): Gallery Name, City, Email, Website, Instagram, Phone, Note, Type
- NY tab adds: Contact column
- Note column = director/contact name and title
- Texas: well-populated. SW, MW: sparse. Cali: LA has ~21 named contacts. EST: Miami populated. NY: 382 rows, well populated.

## Preferences
- Keep code minimal — no over-engineering, no unnecessary abstractions
- No emojis unless asked
- Invoice and inventory data stays local (localStorage only) — never commit buyer info to git
- Work sheet / per-piece PDF generator is a potential next feature for inventory.html
- **Never use localStorage for cross-page data sharing** (exhibits, inventory, rooms, etc.) — localStorage is single-machine only and breaks multi-user / multi-device use. Cloudflare KV (via `/api/*`) is the source of truth; pages always read from the Worker
