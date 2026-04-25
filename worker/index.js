import { ROUTES } from '../js/routes.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

// Admin HTML is fetched from raw.githubusercontent.com to bypass CF Access (which only protects dimzayan.com)
// GitHub may redirect dimzayan.github.io → dimzayan.com, which would re-enter CF Access
const RAW_GITHUB = 'https://raw.githubusercontent.com/dimzayan/dimzayan.github.io/master';

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    // Pretty-URL routes — defined in js/routes.js
    for (const route of ROUTES) {
      let matched = false;
      let safe    = null;

      if (route.prettyPath.includes(':id')) {
        const pattern = route.prettyPath.replace(':id', '([^/]+)');
        const m = url.pathname.match(new RegExp('^' + pattern + '$'));
        if (m) {
          matched = true;
          safe    = decodeURIComponent(m[1]).replace(/["><]/g, '');
        }
      } else {
        if (
          url.pathname === route.prettyPath ||
          url.pathname === route.prettyPath + '/' ||
          url.pathname === route.prettyPath + '/index.html'
        ) {
          matched = true;
        }
      }

      if (matched) {
        // Admin pages: fetch from raw.githubusercontent.com to bypass CF Access on dimzayan.com
        const origin = route.name.startsWith('admin') ? RAW_GITHUB : 'https://dimzayan.com';
        const html = await fetch(origin + '/' + route.workerPage).then(r => r.text());
        const inject = safe
          ? `<base href="/"><script>window.${route.injectVar}="${safe}";<\/script>`
          : '<base href="/">';
        const out = html.replace('<head>', '<head>' + inject);
        return new Response(out, {
          headers: { ...CORS, 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' },
        });
      }
    }

    // /api/* routes
    const key = url.pathname.replace(/^\/api\//, '');

    if (!['inventory', 'exhibits', 'data', 'clients', 'invoices', 'press', 'basics', 'exhibitions'].includes(key)) {
      return new Response('Not found', { status: 404, headers: CORS });
    }

    if (req.method === 'GET') {
      const val = await env.DIM_KV.get(key);
      if (val === null) return new Response('Not found', { status: 404, headers: CORS });
      return new Response(val, {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'PUT') {
      const auth = req.headers.get('Authorization') || '';
      if (auth !== 'Bearer ' + env.DIM_TOKEN) {
        return new Response('Unauthorized', { status: 401, headers: CORS });
      }
      const body = await req.text();
      await env.DIM_KV.put(key, body);
      return new Response('OK', { headers: CORS });
    }

    return new Response('Method not allowed', { status: 405, headers: CORS });
  },
};
