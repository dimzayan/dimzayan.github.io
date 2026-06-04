import { ROUTES } from '../js/routes.js';

// ── S3 / DO Spaces signing helpers (AWS Sig V4) ──────────────────────────────

async function sha256Hex(data) {
  const buf = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSha256(key, data) {
  const k = key instanceof ArrayBuffer
    ? key
    : (typeof key === 'string' ? new TextEncoder().encode(key) : key);
  const cryptoKey = await crypto.subtle.importKey('raw', k, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', cryptoKey, typeof data === 'string' ? new TextEncoder().encode(data) : data);
}

async function getSigningKey(secret, dateStamp, region, service) {
  const kDate    = await hmacSha256('AWS4' + secret, dateStamp);
  const kRegion  = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  return hmacSha256(kService, 'aws4_request');
}

async function signedS3Put(secretKey, folder, filename, bodyBuf, contentType) {
  const ACCESS_KEY = 'DO801RB8ZDHCUNMDK3BX';
  const REGION     = 'nyc3';
  const BUCKET     = 'dimzayan';
  const key        = `works/${folder}/${filename}`;
  // Path-style URL avoids virtual-hosted SSL issues
  const host       = `${REGION}.digitaloceanspaces.com`;
  const s3Path     = `/${BUCKET}/${key}`;
  const now        = new Date();
  const dateStamp  = now.toISOString().slice(0, 10).replace(/-/g, '');
  const amzDate    = now.toISOString().replace(/[:-]|\.\d{3}/g, '');

  const bodyHash      = await sha256Hex(bodyBuf);
  const canonHeaders  = `host:${host}\nx-amz-acl:public-read\nx-amz-content-sha256:${bodyHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-acl;x-amz-content-sha256;x-amz-date';
  const canonRequest  = ['PUT', s3Path, '', canonHeaders, signedHeaders, bodyHash].join('\n');
  const scope         = `${dateStamp}/${REGION}/s3/aws4_request`;
  const strToSign     = `AWS4-HMAC-SHA256\n${amzDate}\n${scope}\n${await sha256Hex(canonRequest)}`;
  const sigBuf        = await getSigningKey(secretKey, dateStamp, REGION, 's3');
  const sigHex        = Array.from(new Uint8Array(await hmacSha256(sigBuf, strToSign))).map(b => b.toString(16).padStart(2, '0')).join('');
  const authHeader    = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${scope}, SignedHeaders=${signedHeaders}, Signature=${sigHex}`;

  return fetch(`https://${host}${s3Path}`, {
    method: 'PUT',
    headers: {
      'Authorization':          authHeader,
      'Content-Type':           contentType,
      'x-amz-acl':              'public-read',
      'x-amz-content-sha256':   bodyHash,
      'x-amz-date':             amzDate,
    },
    body: bodyBuf,
  });
}

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
        const isAdmin = route.name.startsWith('admin');
        const origin = isAdmin ? RAW_GITHUB : 'https://dimzayan.com';
        const html = await fetch(origin + '/' + route.workerPage).then(r => r.text());
        const inject = safe
          ? `<base href="/"><script>window.${route.injectVar}="${safe}";<\/script>`
          : '<base href="/">';

        let out = html.replace('<head>', '<head>' + inject);

        if (isAdmin && route.name !== 'admin-worksheet' && route.name !== 'admin-pricelist') {
          const SECTIONS = [
            { label: 'Artworks',    name: 'admin-artworks'    },
            { label: 'Exhibitions', name: 'admin-exhibitions' },
            { label: 'Invoices',    name: 'admin-invoices'    },
            { label: 'Clients',     name: 'admin-clients'     },
            { label: 'Press',       name: 'admin-press'       },
            { label: 'Settings',    name: 'admin-settings'    },
          ];
          const URLS = {
            'admin-artworks':    '/admin/artworks',
            'admin-exhibitions': '/admin/exhibitions',
            'admin-invoices':    '/admin/invoices',
            'admin-clients':     '/admin/clients',
            'admin-press':       '/admin/press',
            'admin-settings':    '/admin/settings',
          };
          const links = SECTIONS.map(s => {
            const active = route.name === s.name || (route.name === 'admin-artwork' && s.name === 'admin-artworks') || (route.name === 'admin-exhibition' && s.name === 'admin-exhibitions') || (route.name === 'admin-invoice' && s.name === 'admin-invoices') || (route.name === 'admin-client' && s.name === 'admin-clients');
            return `<a class="adm-link${active ? ' adm-active' : ''}" href="${URLS[s.name]}">${s.label}</a>`;
          }).join('');

          const sidebarCSS = `<style>
body{margin-left:176px!important;}
.adm-sidebar{position:fixed;top:0;left:0;width:176px;height:100vh;background:#fff;border-right:1px solid rgba(0,0,0,0.07);display:flex;flex-direction:column;padding:1.75rem 1.25rem 1.25rem;overflow-y:auto;z-index:200;box-sizing:border-box;}
.adm-logo{font-family:"DM Sans",sans-serif;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;opacity:0.38;line-height:1.5;margin-bottom:1.75rem;}
.adm-link{display:block;border-top:1px solid rgba(0,0,0,0.07);padding:0.65rem 0;font-family:"DM Sans",sans-serif;font-size:0.88rem;font-weight:300;color:#111;text-decoration:none;opacity:0.35;letter-spacing:0.01em;transition:opacity 0.1s;}
.adm-link:last-child{border-bottom:1px solid rgba(0,0,0,0.07);}
.adm-active{opacity:1!important;font-weight:400!important;}
.adm-link:hover{opacity:0.7;}
</style>`;

          const sidebarHTML = `<nav class="adm-sidebar"><div class="adm-logo">Dim Zayan<br>Studio</div>${links}</nav>`;

          out = out.replace('</head>', sidebarCSS + '</head>');
          out = out.replace('<body>', '<body>' + sidebarHTML);
          // Handle <body with attributes (e.g. <body class="...">)
          if (!out.includes(sidebarHTML)) {
            out = out.replace(/<body([^>]*)>/, `<body$1>${sidebarHTML}`);
          }
        }

        return new Response(out, {
          headers: { ...CORS, 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' },
        });
      }
    }

    // /api/upload/{folder}/{filename} — proxy binary to DO Spaces
    const uploadMatch = url.pathname.match(/^\/api\/upload\/(raw|hi|low)\/([^/]+\.webp)$/);
    if (uploadMatch) {
      const auth = req.headers.get('Authorization') || '';
      if (auth !== 'Bearer ' + env.DIM_TOKEN) {
        return new Response('Unauthorized', { status: 401, headers: CORS });
      }
      const [, folder, filename] = uploadMatch;
      const bodyBuf = await req.arrayBuffer();
      const r = await signedS3Put(env.DO801RB8ZDHCUNMDK3BX, folder, filename, bodyBuf, 'image/webp');
      if (!r.ok) {
        const err = await r.text();
        return new Response(err, { status: r.status, headers: CORS });
      }
      return new Response('{"ok":true}', { headers: { ...CORS, 'Content-Type': 'application/json' } });
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
