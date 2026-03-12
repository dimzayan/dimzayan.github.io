// Print listing
(function() {
  const CDN_LOW = 'https://dimzayan.nyc3.digitaloceanspaces.com/works/low';
  const COVER   = 'https://dimzayan.nyc3.digitaloceanspaces.com/assets/cover.jpg';
  const QR      = 'https://dimzayan.nyc3.digitaloceanspaces.com/assets/qr.png';

  document.getElementById('print-btn').addEventListener('click', () => {
    const activeRows = Array.from(tbody.querySelectorAll('tr[data-id]:not(.excluded)'));
    function fmtDims(raw) {
      if (!raw) return '';
      return /in\.?$|inches?$/i.test(raw.trim()) ? raw.trim() : raw.trim() + ' in';
    }
    function fmtPrice(raw) {
      if (!raw) return '';
      const n = parseFloat(raw.replace(/[^0-9.]/g, ''));
      if (isNaN(n)) return raw;
      return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }

    const items = activeRows.map((tr, i) => {
      const ref      = tr.dataset.invoiceRef ? JSON.parse(tr.dataset.invoiceRef) : null;
      const sold     = !!ref;
      const reserved = tr.classList.contains('reserved');
      return {
        num:      i + 1,
        id:       tr.dataset.id,
        title:    tr.querySelector('[data-field="title"]')?.textContent.trim()      || '',
        dims:     fmtDims(tr.querySelector('[data-field="dimensions"]')?.textContent.trim()),
        material: tr.querySelector('[data-field="material"]')?.textContent.trim()   || '',
        price:    fmtPrice(tr.querySelector('[data-field="price"]')?.textContent.trim()),
        sold,
        reserved,
      };
    });

    const PER_PAGE = 5;
    const pages = [];
    for (let i = 0; i < items.length; i += PER_PAGE) pages.push(items.slice(i, i + PER_PAGE));

    const qrPage = `
      <div class="page qr-page">
        <img class="qr-img" src="${QR}" />
        <div class="qr-url">dimzayan.com</div>
      </div>`;

    const coverPage = `
      <div class="page cover-page">
        <img class="cover-img" src="${COVER}" />
      </div>`;

    const pageHTML = coverPage + pages.map((page, pi) => `
      <div class="page">
        <div class="page-header">
          <span class="artist">Dim Zayan</span>
          <span class="page-num">${pi + 1} / ${pages.length}</span>
        </div>
        ${page.map(item => `
          <div class="item">
            <img class="thumb" src="${CDN_LOW}/${item.id}.webp" />
            <div class="info">
              <div class="item-num">${item.num}</div>
              <div class="title">${item.title || '—'}</div>
              <div class="meta">${[item.dims, item.material].filter(Boolean).join('&ensp;·&ensp;')}</div>
              ${item.sold ? `<div class="price sold">SOLD</div>` : item.reserved ? `<div class="price reserved-label">RESERVED</div>` : (item.price ? `<div class="price">${item.price}</div>` : '')}
            </div>
          </div>`).join('')}
        <div class="page-footer">dim.studio.marfa@gmail.com</div>
      </div>`).join('');

    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8">
  <title>Dim Zayan — Works</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;500&display=swap" rel="stylesheet">
  <style>
    @page { size: letter portrait; margin: 0.65in 0.85in 0.7in; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "DM Sans", sans-serif; font-weight: 300; font-size: 10pt; color: #1a1a1a; }
    .page { page-break-after: always; }
    .page:last-child { page-break-after: avoid; }
    .page-header {
      display: flex; justify-content: space-between; align-items: baseline;
      border-bottom: 0.75pt solid #bbb; padding-bottom: 6pt; margin-bottom: 18pt;
    }
    .artist { font-size: 9pt; letter-spacing: 0.1em; text-transform: uppercase; }
    .page-num { font-size: 7.5pt; color: #999; }
    .item {
      display: flex; gap: 18pt; align-items: flex-start;
      padding: 9pt 0; border-bottom: 0.5pt solid #ddd;
    }
    .thumb {
      width: 100pt; height: 100pt; object-fit: contain; background: #f0f0f0;
      flex-shrink: 0; display: block;
    }
    .info { flex: 1; padding-top: 2pt; }
    .item-num { font-size: 7pt; color: #bbb; margin-bottom: 4pt; }
    .title { font-size: 12pt; margin-bottom: 4pt; }
    .meta { font-size: 8.5pt; color: #666; line-height: 1.5; }
    .price { margin-top: 6pt; font-size: 9.5pt; }
    .cover-page { display: flex; align-items: center; justify-content: center; height: 100%; }
    .cover-img { width: 100%; height: 100%; object-fit: contain; display: block; }
    .page-footer {
      font-size: 7.5pt; color: #aaa; text-align: center; padding-top: 8pt;
      letter-spacing: 0.04em; margin-top: 14pt;
    }
    .sold { color: #b52c2c; font-weight: 400; }
    .reserved-label { color: #1e7a3c; font-weight: 400; }
    @media print {
      .cover-page { height: 100vh; page-break-after: always; }
    }
    .qr-page { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; page-break-after: avoid; }
    .qr-img { width: 220pt; height: 220pt; image-rendering: pixelated; }
    .qr-url { margin-top: 14pt; font-size: 9pt; letter-spacing: 0.1em; color: #555; }
    @media screen {
      body { background: #e8e8e8; }
      .page { background: white; max-width: 680px; margin: 2rem auto; padding: 48pt 62pt 50pt; }
    }
  </style>
</head><body>
  ${pageHTML}
  <script>window.onload = () => window.print();<\/script>
</body></html>`);
    win.document.close();
  });
})();
