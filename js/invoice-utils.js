/**
 * Shared invoice utilities — imported by dashboard.html (and any future page).
 * invoicing.js (inventory-specific, non-module) has its own copy of these functions
 * since it can't use ES module imports. Keep them in sync if the invoice format changes.
 */

export const INVOICE_KEY     = 'dim_invoices_v1';
export const INVOICE_CTR_KEY = 'dim_invoice_ctr_v1';

export function nextInvoiceNum() {
  const n = Math.max(parseInt(localStorage.getItem(INVOICE_CTR_KEY) || '0', 10), 121) + 1;
  localStorage.setItem(INVOICE_CTR_KEY, String(n));
  return n;
}

export function fmtMoney(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDims(raw) {
  if (!raw) return '';
  return /in\.?$|inches?$/i.test(raw.trim()) ? raw.trim() : raw.trim() + ' inches';
}

export function calcTotal(inv) {
  const subtotal    = (inv.items || []).reduce(function(s, it) { return s + (it.price || 0); }, 0);
  const discountAmt = inv.discount ? subtotal * 0.10 : 0;
  const taxAmt      = (subtotal - discountAmt) * ((inv.taxPct || 0) / 100);
  return subtotal - discountAmt + (inv.shipping || 0) + taxAmt;
}

export function allInvoices() {
  try { return JSON.parse(localStorage.getItem(INVOICE_KEY) || '{}'); }
  catch(e) { return {}; }
}

export function openInvoice(invoiceId) {
  import('./routes.js').then(function(m) {
    window.open(m.routeUrl('admin-invoice', { id: invoiceId }), '_blank');
  });
}

export function generateInvoiceHTML(inv) {
  const numStr      = 'Invoice.' + String(inv.num).padStart(4, '0');
  const subtotal    = (inv.items || []).reduce(function(s, it) { return s + (it.price || 0); }, 0);
  const discountAmt = inv.discount ? subtotal * 0.10 : 0;
  const taxAmt      = (subtotal - discountAmt) * ((inv.taxPct || 0) / 100);
  const total       = subtotal - discountAmt + (inv.shipping || 0) + taxAmt;
  const CDN_LOW     = 'https://dimzayan.nyc3.digitaloceanspaces.com/works/low';

  const itemRows = (inv.items || []).map(function(it) { return `
    <tr class="item-row">
      <td class="cell-img"><img src="${CDN_LOW}/${it.id}.webp" alt="${it.title}"></td>
      <td class="cell-desc">
        <div class="it-title">${it.title || '—'}</div>
        ${it.year       ? `<div class="it-meta">${it.year}</div>` : ''}
        ${it.material   ? `<div class="it-meta">${it.material}</div>` : ''}
        ${it.dimensions ? `<div class="it-meta">${fmtDims(it.dimensions)}</div>` : ''}
      </td>
      <td class="cell-price">${it.price ? fmtMoney(it.price) : ''}</td>
    </tr>`; }).join('');

  const totalRows = `
    <tr class="total-row"><td colspan="2" class="label-cell">Subtotal</td><td class="cell-price">${fmtMoney(subtotal)}</td></tr>
    ${inv.discount ? `<tr class="total-row"><td colspan="2" class="label-cell">Local discount (10%)</td><td class="cell-price">−${fmtMoney(discountAmt)}</td></tr>` : ''}
    ${inv.shipping ? `<tr class="total-row"><td colspan="2" class="label-cell">Shipping</td><td class="cell-price">${fmtMoney(inv.shipping)}</td></tr>` : ''}
    ${inv.taxPct   ? `<tr class="total-row"><td colspan="2" class="label-cell">Sales Tax (${inv.taxPct}%)</td><td class="cell-price">${fmtMoney(taxAmt)}</td></tr>` : ''}
    <tr class="total-row grand-total"><td colspan="2" class="label-cell"><strong>Total</strong></td><td class="cell-price"><strong>${fmtMoney(total)}</strong></td></tr>`;

  const statusClass = inv.paid ? 'status-paid' : 'status-pending';
  const statusLabel = inv.paid ? 'Paid' : 'Pending';

  return `<!DOCTYPE html><html lang="en-US"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${numStr}</title>
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
* { font-family:"DM Sans"; font-weight:300; padding:0; margin:0; box-sizing:border-box; }
body { background:#f4f4f4; color:#111; }
.page { max-width:660px; margin:0 auto; background:white; padding:2.5rem 2.8rem 3rem; min-height:100vh; }
.header-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:2.5rem; }
.artist-name { font-size:0.95rem; font-weight:500; letter-spacing:0.02em; margin-bottom:0.3rem; }
.artist-meta { font-size:0.78rem; opacity:0.5; line-height:1.65; }
.inv-meta { text-align:right; font-size:0.78rem; opacity:0.5; line-height:1.65; }
.section { margin-bottom:1.5rem; }
.section-label { font-size:0.68rem; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; opacity:0.38; margin-bottom:0.35rem; }
.section-body { font-size:0.82rem; line-height:1.7; }
.status-badge { display:inline-block; font-size:0.68rem; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; padding:0.2rem 0.55rem; border-radius:2px; }
.status-pending { background:rgba(200,150,0,0.1); color:rgba(150,110,0,0.9); }
.status-paid    { background:rgba(30,130,60,0.1);  color:rgba(30,130,60,0.9); }
table { width:100%; border-collapse:collapse; margin:1.5rem 0 1rem; font-size:0.8rem; }
td { padding:0.8rem 0.65rem; vertical-align:top; border:1px solid rgba(0,0,0,0.09); }
.cell-img { width:85pt; padding:0.5rem; }
.cell-img img { width:75pt; height:75pt; object-fit:contain; display:block; background:#f7f7f7; }
.it-title { font-weight:400; margin-bottom:0.2rem; }
.it-meta { opacity:0.45; font-size:0.74rem; line-height:1.5; }
.cell-price { width:80pt; text-align:right; vertical-align:middle; }
.total-row td { border-left:none; border-right:none; border-top:none; border-bottom:1px solid rgba(0,0,0,0.06); }
.total-row .label-cell { text-align:right; opacity:0.5; font-size:0.78rem; }
.total-row.grand-total td { border-top:1px solid rgba(0,0,0,0.14); padding-top:0.7rem; }
.payment-block { font-size:0.76rem; line-height:1.8; opacity:0.55; border-top:1px solid rgba(0,0,0,0.09); padding-top:1.4rem; margin-top:1.8rem; }
.payment-title { font-weight:500; margin-bottom:0.4rem; opacity:0.9; font-size:0.78rem; }
.no-print { margin-top:2rem; display:flex; gap:0.75rem; }
.no-print button { background:none; border:1px solid rgba(0,0,0,0.18); border-radius:3px; padding:0.4rem 1rem; font-family:"DM Sans"; font-size:0.78rem; font-weight:300; cursor:pointer; }
.btn-paid { background:rgba(0,0,0,0.85)!important; color:white!important; border-color:transparent!important; }
@media print { body { background:white; } .page { padding:0; } .no-print { display:none; } }
@page { margin:0.9in 1in; }
</style></head><body><div class="page">
  <div class="header-row">
    <div>
      <div class="artist-name">Dim Zayan</div>
      <div class="artist-meta">208 W El Paso St / 1226<br>Marfa, TX 79843<br>646 678 1468</div>
    </div>
    <div class="inv-meta">${inv.date}<br>${numStr}</div>
  </div>
  <div class="section">
    <div class="section-label">Bill to</div>
    <div class="section-body">${inv.buyer && inv.buyer.name ? `<strong>${inv.buyer.name}</strong><br>` : ''}${((inv.buyer && inv.buyer.address) || '').replace(/\n/g, '<br>')}</div>
  </div>
  <div class="section">
    <div class="section-label">Status</div>
    <span class="status-badge ${statusClass}" id="status-badge">${statusLabel}</span>
  </div>
  <table>${itemRows}${totalRows}</table>
  <div class="payment-block">
    <div class="payment-title">Payment instructions</div>
    Invoice due upon receipt. Payments can be made via one of the following methods.<br>
    Kindly reference the invoice number when making payment, thank you!<br><br>
    — Venmo: @gregory-mirzayantz<br>
    — Apple Pay: 646 678 1468
    ${inv.bitcoin ? '<br>— Bitcoin: bc1qptxza9png045rya3zdk7uzfl8wafvk778hlc4f' : ''}
  </div>
  <div class="no-print">
    <button onclick="window.print()">Print / Save PDF</button>
    ${!inv.paid ? `<button class="btn-paid" id="mark-paid-btn">Mark as paid</button>` : ''}
  </div>
</div>
<script>
var invId = ${JSON.stringify(inv.invoiceId)};
var btn = document.getElementById('mark-paid-btn');
if (btn) btn.addEventListener('click', function() {
  try {
    var all = JSON.parse(localStorage.getItem('dim_invoices_v1') || '{}');
    if (all[invId]) { all[invId].paid = true; localStorage.setItem('dim_invoices_v1', JSON.stringify(all)); }
  } catch(e) {}
  if (window.opener && window.opener.dimZayanInvoicePaid) window.opener.dimZayanInvoicePaid(invId);
  var badge = document.getElementById('status-badge');
  badge.textContent = 'Paid'; badge.className = 'status-badge status-paid';
  btn.remove();
});
<\/script></body></html>`;
}
