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
  const objKey     = `works/${folder}/${filename}`;
  const host       = `${BUCKET}.nyc3.digitaloceanspaces.com`;
  const now        = new Date();
  const dateStamp  = now.toISOString().slice(0, 10).replace(/-/g, '');
  const amzDate    = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');

  const bodyHash      = await sha256Hex(bodyBuf);
  const canonHeaders  = `host:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-date';
  const canonRequest  = ['PUT', '/' + objKey, '', canonHeaders, signedHeaders, bodyHash].join('\n');
  const scope         = `${dateStamp}/${REGION}/s3/aws4_request`;
  const strToSign     = `AWS4-HMAC-SHA256\n${amzDate}\n${scope}\n${await sha256Hex(canonRequest)}`;
  const sigBuf        = await getSigningKey(secretKey, dateStamp, REGION, 's3');
  const sigHex        = Array.from(new Uint8Array(await hmacSha256(sigBuf, strToSign))).map(b => b.toString(16).padStart(2, '0')).join('');
  const authHeader    = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${scope}, SignedHeaders=${signedHeaders}, Signature=${sigHex}`;

  return fetch(`https://${host}/${objKey}`, {
    method: 'PUT',
    headers: {
      'Authorization': authHeader,
      'Content-Type': contentType,
      'x-amz-date': amzDate,
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
