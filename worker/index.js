const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    // /exhibitions/:id  or  /exhibitions/:id/edit — proxy HTML with injected ID
    const exMatch = url.pathname.match(/^\/exhibitions\/([^/]+)(\/edit)?$/);
    if (exMatch) {
      const id     = decodeURIComponent(exMatch[1]);
      const isEdit = !!exMatch[2];
      const page   = isEdit ? 'exhibition.html' : 'exhibitions.html';
      const origin = 'https://dimzayan.com/' + page;
      const html   = await fetch(origin).then(r => r.text());
      const safe   = id.replace(/"/g, '').replace(/</g, '').replace(/>/g, '');
      const out    = html.replace('<head>',
        `<head><base href="/"><script>window.__EXHIBIT_ID__="${safe}";<\/script>`
      );
      return new Response(out, {
        headers: { ...CORS, 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' },
      });
    }

    // /api/* routes
    const key = url.pathname.replace(/^\/api\//, '');

    if (!['inventory', 'exhibits', 'data'].includes(key)) {
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
