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
- `works.html` — public-facing grid; fetches `inventory.json`, falls back to `localStorage` (`dim_inventory_order_v2` for order)
- `inventory.html` — private inventory management tool; protected via Cloudflare Access (email OTP)
- `inventory.json` — source of truth for works data; saved directly to GitHub via API from the Save JSON button

## Inventory System
- Data stored in `localStorage` key `dim_inventory_v2`
- Manual order stored in `localStorage` key `dim_inventory_order_v2`
- Fields per work: title, dimensions, material, price, year, notes, excluded (bool), invoiced (object|null)
- `inventory.html` loads from `inventory.json` first; falls back to localStorage (owner's edits take priority on subsequent loads)
- **Save JSON** uses GitHub Contents API to PUT directly to repo — token stored in `localStorage` key `dim_gh_token` (never committed)
- Colleague also has Cloudflare Access — sees same inventory via published `inventory.json`

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
- `exhibits.html` — public exhibit page, accessed via `?id=[slug]`
- `exhibits.json` — source of truth; structure per exhibit: `{ id, title, year, location, press: [urls], description, media: [filenames] }`
- Media filenames in `exhibits.json` resolve to CDN hi-res: `https://dimzayan.nyc3.digitaloceanspaces.com/works/hi/[filename]`

## GitHub / Hosting
- Repo: `https://github.com/dimzayan/dimzayan.github.io`
- Hosted on GitHub Pages, domain dimzayan.com via Cloudflare
- Cloudflare Access protects `/inventory.html` — allowed emails: Dim + colleague
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
