/**
 * Route definitions — single source of truth for all pretty-URL routes.
 *
 * Consumed by:
 *   - worker/index.js  (imported at build time via Wrangler bundling)
 *   - Any page via <script type="module"> to generate correct links on
 *     both localhost (?id= fallback) and production (pretty URLs).
 *
 * To add a new route:
 *   1. Add an entry here
 *   2. Add a [[routes]] block in worker/wrangler.toml (if not already covered)
 *   3. Create the HTML page; use getPageId() to read the injected ID
 *   4. Generate links with routeUrl('route-name', { id: ... }) or routeUrl('route-name')
 */

export const ROUTES = [
  // ── Public ──────────────────────────────────────────────────────────────
  {
    name:         'artworks',
    prettyPath:   '/artworks',
    fallbackPage: 'artworks.html',
    workerPage:   'artworks.html',
  },
  {
    name:         'artwork-view',
    prettyPath:   '/artworks/:id',
    fallbackPage: 'artworks.html',
    workerPage:   'artworks.html',
    injectVar:    '__ARTWORK_ID__',
  },
  {
    name:         'exhibitions',
    prettyPath:   '/exhibitions',
    fallbackPage: 'exhibitions.html',
    workerPage:   'exhibitions.html',
  },
  {
    name:         'exhibition-view',
    prettyPath:   '/exhibitions/:id',
    fallbackPage: 'exhibitions.html',
    workerPage:   'exhibitions.html',
    injectVar:    '__EXHIBIT_ID__',
  },

  // ── Admin ────────────────────────────────────────────────────────────────
  {
    name:         'admin',
    prettyPath:   '/admin',
    fallbackPage: 'admin/index.html',
    workerPage:   'admin/index.html',
  },
  {
    name:         'admin-artworks',
    prettyPath:   '/admin/artworks',
    fallbackPage: 'admin/artworks.html',
    workerPage:   'admin/artworks.html',
  },
  {
    name:         'admin-artwork',
    prettyPath:   '/admin/artworks/:id',
    fallbackPage: 'admin/artworks.html',
    workerPage:   'admin/artworks.html',
    injectVar:    '__ARTWORK_ID__',
  },
  {
    name:         'admin-exhibitions',
    prettyPath:   '/admin/exhibitions',
    fallbackPage: 'admin/exhibitions.html',
    workerPage:   'admin/exhibitions.html',
  },
  {
    name:         'admin-exhibition',
    prettyPath:   '/admin/exhibitions/:id',
    fallbackPage: 'admin/exhibitions.html',
    workerPage:   'admin/exhibitions.html',
    injectVar:    '__EXHIBIT_ID__',
  },
  {
    name:         'admin-invoices',
    prettyPath:   '/admin/invoices',
    fallbackPage: 'admin/invoices.html',
    workerPage:   'admin/invoices.html',
  },
  {
    name:         'admin-invoice',
    prettyPath:   '/admin/invoices/:id',
    fallbackPage: 'admin/invoices.html',
    workerPage:   'admin/invoices.html',
    injectVar:    '__INVOICE_ID__',
  },
  {
    name:         'admin-clients',
    prettyPath:   '/admin/clients',
    fallbackPage: 'admin/clients.html',
    workerPage:   'admin/clients.html',
  },
  {
    name:         'admin-client',
    prettyPath:   '/admin/clients/:id',
    fallbackPage: 'admin/clients.html',
    workerPage:   'admin/clients.html',
    injectVar:    '__CLIENT_ID__',
  },
  {
    name:         'admin-settings',
    prettyPath:   '/admin/settings',
    fallbackPage: 'admin/settings.html',
    workerPage:   'admin/settings.html',
  },
];

const IS_LOCAL =
  typeof location !== 'undefined' &&
  !location.hostname.endsWith('dimzayan.com');

/**
 * Generate a URL for a named route.
 * On localhost: /<fallbackPage>  or  /<fallbackPage>?id=<encoded>
 * On production: pretty path e.g. /exhibitions/<encoded>
 */
export function routeUrl(name, params) {
  const route = ROUTES.find(function(r) { return r.name === name; });
  if (!route) throw new Error('Unknown route: ' + name);
  if (IS_LOCAL) {
    const base = '/' + route.fallbackPage;
    return (params && params.id) ? base + '?id=' + encodeURIComponent(params.id) : base;
  }
  let path = route.prettyPath;
  if (params && params.id) path = path.replace(':id', encodeURIComponent(params.id));
  return path;
}

/**
 * Read the current page's entity ID.
 * Checks window[varName] first (injected by Worker on production),
 * then falls back to the ?id= query param (localhost / direct access).
 */
export function getPageId(varName) {
  const key = varName || '__EXHIBIT_ID__';
  return (typeof window !== 'undefined' && window[key])
    || new URLSearchParams(window.location.search).get('id');
}
