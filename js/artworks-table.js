/**
 * Artworks table module — reusable editable table for inventory.
 * Used by admin/artworks.html and admin/exhibitions.html.
 *
 * Usage:
 *   import { initArtworksTable } from '../js/artworks-table.js';
 *   const tbl = initArtworksTable({ tableEl, exhibits, filter, onRightClick });
 *   tbl.renderData(inventory);
 */

export const CDN_LOW = 'https://dimzayan.nyc3.digitaloceanspaces.com/works/low/';
export const CDN_HI  = 'https://dimzayan.nyc3.digitaloceanspaces.com/works/hi/';
const TS = Date.now();

// Lazy-load heic2any only when a HEIF/HEIC file is encountered
let _heic2any = null;
async function loadHeic2any() {
  if (_heic2any) return _heic2any;
  if (window.heic2any) { _heic2any = window.heic2any; return _heic2any; }
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';
    s.onload = () => { _heic2any = window.heic2any; resolve(_heic2any); };
    s.onerror = () => reject(new Error('Failed to load HEIC converter'));
    document.head.appendChild(s);
  });
}

const FIELDS      = ['title', 'dimensions', 'material', 'price', 'year', 'notes'];
const PLACEHOLDER = { title: 'Title', dimensions: 'e.g. 24×36 in', material: 'Material', price: '$', year: 'Year', notes: 'Notes' };
const COL_CLASS   = { title: 'col-title', dimensions: 'col-dims', material: 'col-material', price: 'col-price', year: 'col-year', notes: 'col-notes' };
const PHOTOS_KEY  = 'dim_work_photos_v1';

/**
 * @param {Object}      options
 * @param {HTMLElement} options.tableEl      <table> element with a <tbody>
 * @param {Object}      options.exhibits     { id: exhibit } for the exhibition dropdown
 * @param {Function}   [options.filter]      (id, work) => bool — show only matching rows
 * @param {Function}   [options.onFullEdit]    (tr) => void — if provided, adds "Edit" as first menu item
 * @param {Function}   [options.onMenuExtend]  (menuEl, tr) => void — append extra items to the menu
 * @returns {{ renderData, gatherData, renumberRows, tbody, openEditDrawer, createRow }}
 */
export function initArtworksTable({ tableEl, exhibits = {}, filter, onFullEdit, onMenuExtend, disableDrag = false }) {
  _injectStyles();

  const tbody = tableEl.querySelector('tbody');
  let _inventory = {};

  // ── Lightbox ─────────────────────────────────────────────────────────────
  document.getElementById('at-lb')?.remove();
  const lb = _el(`<div id="at-lb" class="at-lb">
    <button class="at-lb-close">✕</button>
    <button class="at-lb-arrow at-lb-prev">&#8592;</button>
    <img class="at-lb-img" src="" alt="">
    <button class="at-lb-arrow at-lb-next">&#8594;</button>
    <div class="at-lb-info"><div class="at-lb-title"></div><div class="at-lb-meta"></div></div>
  </div>`);
  document.body.appendChild(lb);

  const lbImg  = lb.querySelector('.at-lb-img');
  const lbTit  = lb.querySelector('.at-lb-title');
  const lbMet  = lb.querySelector('.at-lb-meta');
  let lbCurrent = null;

  lb.querySelector('.at-lb-close').addEventListener('click', closeLb);
  lb.querySelector('.at-lb-prev').addEventListener('click', () => lbStep(-1));
  lb.querySelector('.at-lb-next').addEventListener('click', () => lbStep(1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });

  const _lbKeys = e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  lbStep(-1);
    if (e.key === 'ArrowRight') lbStep(1);
    if (e.key === 'Escape')     closeLb();
  };
  document.addEventListener('keydown', _lbKeys);

  function openLightbox(id) {
    lbCurrent = id;
    const tr  = tbody.querySelector(`tr[data-id="${id}"]`);
    const photo = tr ? (tr.dataset.photo || id) : id;
    lbImg.src = CDN_HI + photo + '.webp?t=' + TS;
    lb.classList.add('open');
    const w = _inventory[id] || {};
    lbTit.textContent = w.title || '';
    const dims = w.dimensions ? w.dimensions.trim().replace(/in\.?$/i, '').trim() + ' in' : '';
    lbMet.textContent = [w.material, dims].filter(Boolean).join('  ·  ');
  }

  function closeLb() { lb.classList.remove('open'); lbImg.src = ''; }

  function lbStep(dir) {
    const ids = Array.from(tbody.querySelectorAll('tr[data-id]'))
      .filter(tr => tr.querySelector('.at-thumb'))
      .map(tr => tr.dataset.id);
    const idx = ids.indexOf(lbCurrent);
    if (idx === -1) return;
    openLightbox(ids[(idx + dir + ids.length) % ids.length]);
  }

  // ── Context menu ─────────────────────────────────────────────────────────
  document.getElementById('at-ctx')?.remove();
  const ctxMenu = document.createElement('div');
  ctxMenu.id = 'at-ctx';
  ctxMenu.className = 'at-ctx-menu';
  document.body.appendChild(ctxMenu);

  function _ctxItem(label, danger) {
    const d = document.createElement('div');
    d.className = 'at-ctx-item' + (danger ? ' at-ctx-danger' : '');
    d.textContent = label;
    return d;
  }
  function _ctxSep() { const d = document.createElement('div'); d.className = 'at-ctx-sep'; return d; }

  function showCtxMenu(tr, e) {
    window.ctxRow = tr;
    ctxMenu.innerHTML = '';

    if (onFullEdit) {
      const item = _ctxItem('Edit');
      item.addEventListener('click', () => { hideCtxMenu(); onFullEdit(tr); });
      ctxMenu.appendChild(item);
    }

    const qEdit = _ctxItem('Quick edit');
    qEdit.addEventListener('click', () => { hideCtxMenu(); openEditDrawer(tr); });
    ctxMenu.appendChild(qEdit);

    const prev = _ctxItem('Preview work sheet');
    prev.addEventListener('click', () => { hideCtxMenu(); window.open('/preview.html?id=' + encodeURIComponent(tr.dataset.id), '_blank'); });
    ctxMenu.appendChild(prev);

    if (onMenuExtend) onMenuExtend(ctxMenu, tr);

    ctxMenu.appendChild(_ctxSep());

    const res = _ctxItem(tr.classList.contains('reserved') ? 'Clear reservation' : 'Mark as reserved');
    res.addEventListener('click', () => {
      hideCtxMenu();
      const now = tr.classList.toggle('reserved');
      const tdInv = tr.querySelector('.col-inv');
      if (tdInv) {
        const tag = tdInv.querySelector('.res-tag');
        if (now && !tag) { const t = document.createElement('span'); t.className = 'res-tag'; t.textContent = 'RES'; tdInv.insertBefore(t, tdInv.firstChild); }
        else if (!now && tag) tag.remove();
      }
    });
    ctxMenu.appendChild(res);

    const del = _ctxItem('Delete', true);
    del.addEventListener('click', () => {
      hideCtxMenu();
      if (window.invoiceCart) window.invoiceCart.delete(tr.dataset.id);
      tr.remove();
      renumberRows();
      if (window.updateCartBtn) window.updateCartBtn();
    });
    ctxMenu.appendChild(del);

    ctxMenu.style.display = 'block';
    const mw = 180, mh = ctxMenu.offsetHeight || 200;
    let x = e.clientX, y = e.clientY;
    if (x + mw > window.innerWidth)  x = window.innerWidth  - mw - 8;
    if (y + mh > window.innerHeight) y = window.innerHeight - mh - 8;
    ctxMenu.style.left = x + 'px';
    ctxMenu.style.top  = y + 'px';
  }

  function hideCtxMenu() { ctxMenu.style.display = 'none'; window.ctxRow = null; }
  document.addEventListener('click', hideCtxMenu);

  // ── Edit drawer ───────────────────────────────────────────────────────────
  document.getElementById('at-drawer')?.remove();
  const opts = Object.entries(exhibits)
    .map(([k, ex]) => `<option value="${k}">${ex.title || k}</option>`).join('');
  const drawer = _el(`<div id="at-drawer" class="at-drawer">
    <div class="at-drawer-header">
      <h3 class="at-drawer-title" id="at-drawer-title">Edit work</h3>
      <button class="at-drawer-close" id="at-drawer-close">✕</button>
    </div>
    <div class="at-drawer-body">
      <div class="at-2col">
        <div class="at-field"><label>Title</label><input id="at-edit-title" type="text"></div>
        <div class="at-field"><label>Year</label><input id="at-edit-year" type="text"></div>
      </div>
      <div class="at-field"><label>Material</label><input id="at-edit-material" type="text"></div>
      <div class="at-2col">
        <div class="at-field"><label>Dimensions</label><input id="at-edit-dimensions" type="text"></div>
        <div class="at-field"><label>Price ($)</label><input id="at-edit-price" type="text"></div>
      </div>
      <div class="at-field"><label>Description</label><textarea id="at-edit-notes"></textarea></div>
      <div class="at-field"><label>Exhibition</label>
        <select id="at-edit-exhibition"><option value="">— None —</option>${opts}</select>
      </div>
      <div>
        <div class="at-section-label">Main photo</div>
        <div class="at-photo-wrap">
          <img id="at-photo-preview" alt="">
          <div class="at-field"><label>Filename (no extension)</label><input id="at-edit-photo" type="text" placeholder="e.g. IMG_0315"></div>
        </div>
      </div>
      <div>
        <div class="at-section-label">Supporting photos</div>
        <div id="at-photos-grid" class="at-photos-grid"></div>
        <input type="file" id="at-photo-input" accept="image/*" multiple style="display:none">
      </div>
    </div>
    <div class="at-drawer-footer">
      <button id="at-cancel-btn">Cancel</button>
      <span id="at-upload-status" style="font-size:0.72rem;opacity:0.5;flex:1;text-align:left;"></span>
      <input type="file" id="at-upload-file" accept="image/*" style="display:none">
      <button id="at-upload-btn">Upload photo</button>
      <button id="at-save-btn">Save</button>
    </div>
  </div>`);
  document.body.appendChild(drawer);

  let editRow = null, editPhotos = [];

  drawer.querySelector('#at-drawer-close').addEventListener('click', closeDrawer);
  drawer.querySelector('#at-cancel-btn').addEventListener('click', closeDrawer);

  drawer.querySelector('#at-edit-photo').addEventListener('input', function() {
    const v = this.value.trim();
    if (v) drawer.querySelector('#at-photo-preview').src = CDN_LOW + v + '.webp?t=' + TS;
  });

  drawer.querySelector('#at-photo-input').addEventListener('change', function() {
    Array.from(this.files).forEach(f => _compress(f, url => { editPhotos.push(url); _renderPhotos(); }));
    this.value = '';
  });

  drawer.querySelector('#at-upload-btn').addEventListener('click', () =>
    drawer.querySelector('#at-upload-file').click());

  drawer.querySelector('#at-upload-file').addEventListener('change', async function() {
    const file = this.files[0]; if (!file) return;
    const token = localStorage.getItem('dim_gh_token') || '';
    const status = drawer.querySelector('#at-upload-status');
    if (!token) { status.textContent = 'No token'; return; }
    const filename = (drawer.querySelector('#at-edit-photo').value.trim()) || (editRow && editRow.dataset.id) || '';
    if (!filename) { status.textContent = 'Set filename first'; return; }

    // createImageBitmap with a 20s timeout — hangs silently for some formats/browsers
    async function decodeBitmap(source) {
      return Promise.race([
        createImageBitmap(source),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Image decode timed out — try a JPEG or PNG')), 20000)),
      ]);
    }

    async function toWebP(source, maxDim, q) {
      const bitmap = await decodeBitmap(source);
      const scale = maxDim ? Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height)) : 1;
      const c = document.createElement('canvas');
      c.width  = Math.round(bitmap.width  * scale);
      c.height = Math.round(bitmap.height * scale);
      c.getContext('2d').drawImage(bitmap, 0, 0, c.width, c.height);
      bitmap.close();
      return new Promise((resolve, reject) => c.toBlob(b => b ? resolve(b) : reject(new Error('Canvas encode returned null')), 'image/webp', q));
    }

    // Detect HEIF via magic bytes before any browser decode attempt
    status.textContent = 'Reading…';
    let source = file;
    try {
      const buf = await file.slice(0, 12).arrayBuffer();
      const b = new Uint8Array(buf);
      const isHeif = /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name) ||
                     (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70);
      console.log('[upload] type=' + file.type + ' name=' + file.name + ' size=' + file.size + ' isHeif=' + isHeif);
      if (isHeif) {
        status.textContent = 'Converting HEIF…';
        const h2a = await loadHeic2any();
        const conv = await h2a({ blob: file, toType: 'image/jpeg', quality: 0.95 });
        source = Array.isArray(conv) ? conv[0] : conv;
        console.log('[upload] HEIF→JPEG done, size=' + source.size);
      }
    } catch(e) { status.textContent = 'Error (read): ' + e.message; return; }

    try {
      status.textContent = 'Decoding…';
      const rawB = await toWebP(source, null, 0.92);
      console.log('[upload] raw encoded, size=' + rawB.size);
      status.textContent = 'Encoding…';
      const [hiB, lowB] = await Promise.all([toWebP(source, null, 0.92), toWebP(source, 1000, 0.90)]);
      console.log('[upload] hi+low encoded');
      status.textContent = 'Uploading…';
      const _apiBase = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'https://dimzayan.com' : '';
      await Promise.all(['raw', 'hi', 'low'].map((folder, i) =>
        fetch(_apiBase + '/api/upload/' + folder + '/' + filename + '.webp', {
          method: 'PUT',
          headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'image/webp' },
          body: [rawB, hiB, lowB][i],
        }).then(r => { if (!r.ok) throw new Error(folder + ': ' + r.status); })
      ));
      const ts = Date.now();
      drawer.querySelector('#at-photo-preview').src = CDN_LOW + filename + '.webp?t=' + ts;
      const rowThumb = editRow && editRow.querySelector('.at-thumb');
      if (rowThumb) rowThumb.src = CDN_LOW + filename + '.webp?t=' + ts;
      status.textContent = 'Uploaded';
      setTimeout(() => { status.textContent = ''; }, 3000);
    } catch(e) { status.textContent = 'Error: ' + e.message; }
    this.value = '';
  });

  drawer.querySelector('#at-save-btn').addEventListener('click', () => {
    if (!editRow) return;
    const id  = editRow.dataset.id;
    const g   = k => drawer.querySelector('#at-edit-' + k).value.trim();
    const vals = { title: g('title'), year: g('year'), material: g('material'), dimensions: g('dimensions'), price: g('price'), notes: drawer.querySelector('#at-edit-notes').value };
    FIELDS.forEach(f => { const td = editRow.querySelector(`[data-field="${f}"]`); if (td) td.textContent = vals[f]; });
    _setPhotos(id, editPhotos);
    const newPhoto      = g('photo') || id;
    const newExhibition = drawer.querySelector('#at-edit-exhibition').value;
    editRow.dataset.photo = newPhoto;
    if (newExhibition) editRow.dataset.exhibition = newExhibition;
    else delete editRow.dataset.exhibition;
    const thumb = editRow.querySelector('.at-thumb');
    if (thumb) thumb.src = CDN_LOW + newPhoto + '.webp?t=' + Date.now();
    closeDrawer();
  });

  function _renderPhotos() {
    const grid = drawer.querySelector('#at-photos-grid');
    grid.innerHTML = '';
    editPhotos.forEach((src, i) => {
      const w = document.createElement('div'); w.className = 'at-photo-thumb';
      const img = document.createElement('img'); img.src = src;
      const del = document.createElement('button'); del.className = 'at-photo-del'; del.textContent = '✕';
      del.addEventListener('click', () => { editPhotos.splice(i, 1); _renderPhotos(); });
      w.appendChild(img); w.appendChild(del); grid.appendChild(w);
    });
    const add = document.createElement('div'); add.className = 'at-photo-add'; add.textContent = '+';
    add.addEventListener('click', () => drawer.querySelector('#at-photo-input').click());
    grid.appendChild(add);
  }

  function openEditDrawer(tr) {
    editRow = tr;
    const g  = f => tr.querySelector(`[data-field="${f}"]`)?.textContent.trim() || '';
    const id = tr.dataset.id;
    drawer.querySelector('#at-drawer-title').textContent = g('title') || 'Edit work';
    FIELDS.forEach(f => {
      const el = drawer.querySelector('#at-edit-' + f);
      if (el) el.value = g(f);
    });
    if (drawer.querySelector('#at-edit-notes')) drawer.querySelector('#at-edit-notes').value = g('notes');
    const photo = tr.dataset.photo || id;
    drawer.querySelector('#at-edit-photo').value = photo;
    drawer.querySelector('#at-edit-exhibition').value = tr.dataset.exhibition || '';
    drawer.querySelector('#at-photo-preview').src = CDN_LOW + photo + '.webp?t=' + TS;
    editPhotos = _getPhotos(id).slice();
    _renderPhotos();
    drawer.classList.add('open');
  }

  function closeDrawer() { drawer.classList.remove('open'); editRow = null; editPhotos = []; }

  // ── Drag & drop ───────────────────────────────────────────────────────────
  let dragSrc = null;

  function addDragHandlers(tr, handle) {
    handle.draggable = true;
    handle.addEventListener('dragstart', e => {
      dragSrc = tr;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setDragImage(tr, 20, tr.offsetHeight / 2);
      setTimeout(() => tr.classList.add('dragging'), 0);
    });
    handle.addEventListener('dragend', () => { tr.classList.remove('dragging'); _clearDrag(); dragSrc = null; });
    tr.addEventListener('dragover', e => {
      if (!dragSrc || dragSrc === tr) return;
      e.preventDefault(); _clearDrag();
      const r = tr.getBoundingClientRect();
      tr.classList.add(e.clientY < r.top + r.height / 2 ? 'drag-over-top' : 'drag-over-bottom');
      e.dataTransfer.dropEffect = 'move';
    });
    tr.addEventListener('dragleave', e => { if (!tr.contains(e.relatedTarget)) tr.classList.remove('drag-over-top', 'drag-over-bottom'); });
    tr.addEventListener('drop', e => {
      e.preventDefault();
      if (!dragSrc || dragSrc === tr) return;
      const after = tr.classList.contains('drag-over-bottom');
      _clearDrag();
      after ? tr.after(dragSrc) : tr.before(dragSrc);
      sortState = { field: null, dir: 'asc' }; applySortUI(); renumberRows();
    });
  }

  function _clearDrag() {
    tbody.querySelectorAll('.drag-over-top,.drag-over-bottom').forEach(el => el.classList.remove('drag-over-top','drag-over-bottom'));
  }

  // ── Sort ──────────────────────────────────────────────────────────────────
  let sortState = { field: null, dir: 'asc' };

  tableEl.querySelectorAll('thead th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      sortState = sortState.field === th.dataset.sort
        ? { field: th.dataset.sort, dir: sortState.dir === 'asc' ? 'desc' : 'asc' }
        : { field: th.dataset.sort, dir: 'asc' };
      applySortUI(); applySort();
    });
  });
  const thumbTh = tableEl.querySelector('.th-thumb');
  if (thumbTh) thumbTh.addEventListener('click', () => { sortState = { field: null, dir: 'asc' }; applySortUI(); renumberRows(); });

  function applySort() {
    const rows = Array.from(tbody.querySelectorAll('tr[data-id]'));
    rows.sort((a, b) => {
      const av = a.querySelector(`[data-field="${sortState.field}"]`)?.textContent.trim() || '';
      const bv = b.querySelector(`[data-field="${sortState.field}"]`)?.textContent.trim() || '';
      if (sortState.field === 'price') {
        const an = parseFloat(av.replace(/[^0-9.]/g, '')) || (sortState.dir === 'asc' ? Infinity : -Infinity);
        const bn = parseFloat(bv.replace(/[^0-9.]/g, '')) || (sortState.dir === 'asc' ? Infinity : -Infinity);
        return sortState.dir === 'asc' ? an - bn : bn - an;
      }
      return sortState.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    rows.forEach(tr => tbody.appendChild(tr));
    renumberRows();
  }

  function applySortUI() {
    tableEl.querySelectorAll('thead th[data-sort]').forEach(th => {
      th.classList.remove('sort-active');
      const a = th.querySelector('.sort-arrow'); if (a) a.textContent = '';
    });
    if (sortState.field) {
      const th = tableEl.querySelector(`thead th[data-sort="${sortState.field}"]`);
      if (th) { th.classList.add('sort-active'); const a = th.querySelector('.sort-arrow'); if (a) a.textContent = sortState.dir === 'asc' ? '↑' : '↓'; }
      if (thumbTh) thumbTh.classList.remove('sort-active');
    } else {
      if (thumbTh) thumbTh.classList.add('sort-active');
    }
  }

  // ── Thumbnails ────────────────────────────────────────────────────────────
  function _thumbImg(id, tr, td) {
    const photo = tr.dataset.photo || id;
    const img = document.createElement('img');
    img.className = 'at-thumb'; img.src = CDN_LOW + photo + '.webp?t=' + TS; img.loading = 'lazy'; img.alt = '';
    img.addEventListener('click', () => openLightbox(tr.dataset.id));
    img.addEventListener('error', () => { img.remove(); td.appendChild(_thumbInput(tr.dataset.id, tr, td)); });
    return img;
  }

  function _thumbInput(currentId, tr, td) {
    const inp = document.createElement('input');
    inp.type = 'text'; inp.className = 'at-thumb-input'; inp.placeholder = 'filename'; inp.spellcheck = false;
    inp.value = (currentId && !currentId.startsWith('_new_')) ? currentId : '';
    const apply = () => {
      const raw = inp.value.trim().replace(/\.(webp|jpg|jpeg|png)$/i, '');
      if (!raw) return;
      tr.dataset.id = raw; inp.remove(); td.appendChild(_thumbImg(raw, tr, td));
    };
    inp.addEventListener('blur', apply);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); inp.blur(); } });
    return inp;
  }

  // ── Row factory ───────────────────────────────────────────────────────────
  function createRow(id, data) {
    data = data || {};
    const tr = document.createElement('tr');
    tr.dataset.id    = id;
    tr.dataset.photo = data.photo || id;
    const exhibition = data.exhibition || data.exhibit || '';
    if (exhibition) tr.dataset.exhibition = exhibition;
    if (data.reserved) tr.classList.add('reserved');
    if (data.invoiced) { tr.classList.add('invoiced'); tr.dataset.invoiceRef = JSON.stringify(data.invoiced); }
    if (data.displayScale && data.displayScale !== 1) tr.dataset.displayScale = data.displayScale;

    // Drag handle
    const tdDrag = document.createElement('td'); tdDrag.className = 'col-drag';
    const handle = document.createElement('span'); handle.className = 'at-drag-handle'; handle.textContent = '⠿'; handle.title = 'Drag to reorder';
    if (disableDrag) { handle.style.visibility = 'hidden'; handle.style.pointerEvents = 'none'; }
    tdDrag.appendChild(handle); tr.appendChild(tdDrag);

    // Thumbnail
    const tdThumb = document.createElement('td'); tdThumb.className = 'col-thumb';
    if (id && !id.startsWith('_new_')) tdThumb.appendChild(_thumbImg(id, tr, tdThumb));
    else tdThumb.appendChild(_thumbInput(id, tr, tdThumb));
    tr.appendChild(tdThumb);

    // Row number
    const tdNum = document.createElement('td'); tdNum.className = 'col-num';
    tr.appendChild(tdNum);

    // Editable fields
    FIELDS.forEach(f => {
      const td = document.createElement('td');
      td.className = COL_CLASS[f]; td.contentEditable = 'true';
      td.dataset.field = f; td.dataset.placeholder = PLACEHOLDER[f];
      td.textContent = data[f] || ''; td.spellcheck = false;
      td.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); td.blur(); }
        if (e.key === 'Tab') {
          e.preventDefault();
          const cells = Array.from(tr.querySelectorAll('[contenteditable]'));
          const next = e.shiftKey ? cells[cells.indexOf(td) - 1] : cells[cells.indexOf(td) + 1];
          if (next) next.focus();
          else if (!e.shiftKey) tr.nextElementSibling?.querySelector('[contenteditable]')?.focus();
        }
      });
      tr.appendChild(td);
    });

    // Status column (invoice / reserved tags)
    const tdInv = document.createElement('td'); tdInv.className = 'col-inv';
    if (data.reserved) {
      const t = document.createElement('span'); t.className = 'res-tag'; t.textContent = 'RES';
      tdInv.appendChild(t);
    }
    if (data.invoiced) {
      const t = document.createElement('span');
      t.className = 'inv-tag' + (data.invoiced.paid ? ' paid' : '');
      t.textContent = 'INV.' + String(data.invoiced.num).padStart(4, '0');
      t.title = data.invoiced.paid ? 'Paid' : 'Pending';
      t.dataset.invoiceId = data.invoiced.invoiceId;
      tdInv.appendChild(t);
    }
    tr.appendChild(tdInv);

    tr.addEventListener('contextmenu', e => { e.preventDefault(); showCtxMenu(tr, e); });
    if (!disableDrag) addDragHandlers(tr, handle);
    return tr;
  }

  // ── Render / gather ───────────────────────────────────────────────────────
  function renumberRows() {
    let n = 1;
    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
      const td = tr.querySelector('.col-num'); if (td) td.textContent = n++;
    });
  }

  function renderData(inventory, order) {
    _inventory = inventory || {};
    const fn = filter || (() => true);
    tbody.innerHTML = '';
    let ids = Object.keys(_inventory).filter(id => fn(id, _inventory[id]));
    if (order && order.length) {
      const inOrder = new Set(order);
      ids = [
        ...order.filter(id => ids.includes(id)), // ordered IDs that pass the filter
        ...ids.filter(id => !inOrder.has(id)),    // new works not yet in the saved order
      ];
    }
    ids.forEach(id => tbody.appendChild(createRow(id, _inventory[id])));
    renumberRows(); applySortUI();
  }

  function getOrder() {
    return Array.from(tbody.querySelectorAll('tr[data-id]')).map(tr => tr.dataset.id);
  }

  function gatherData() {
    const obj = {};
    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
      const id = tr.dataset.id;
      obj[id] = { photo: tr.dataset.photo || id };
      if (tr.dataset.exhibition) obj[id].exhibition = tr.dataset.exhibition;
      if (tr.dataset.invoiceRef) { try { obj[id].invoiced = JSON.parse(tr.dataset.invoiceRef); } catch(e) {} }
      if (tr.dataset.displayScale) { const ds = parseFloat(tr.dataset.displayScale); if (ds && ds !== 1) obj[id].displayScale = ds; }
      if (tr.classList.contains('reserved')) obj[id].reserved = true;
      FIELDS.forEach(f => { const td = tr.querySelector(`[data-field="${f}"]`); obj[id][f] = td ? td.textContent.trim() : ''; });
    });
    return obj;
  }

  applySortUI();
  return { renderData, gatherData, getOrder, renumberRows, tbody, openEditDrawer, createRow };
}

// ── Private helpers ────────────────────────────────────────────────────────

function _el(html) {
  const d = document.createElement('div'); d.innerHTML = html.trim();
  return d.firstElementChild;
}

function _getPhotos(id) {
  try { return (JSON.parse(localStorage.getItem(PHOTOS_KEY)) || {})[id] || []; } catch(e) { return []; }
}

function _setPhotos(id, photos) {
  const all = JSON.parse(localStorage.getItem(PHOTOS_KEY) || '{}');
  if (photos.length) all[id] = photos; else delete all[id];
  localStorage.setItem(PHOTOS_KEY, JSON.stringify(all));
}

function _compress(file, cb) {
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1600, s = Math.min(1, MAX / Math.max(img.width, img.height));
      const w = Math.round(img.width * s), h = Math.round(img.height * s);
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      cb(c.toDataURL('image/jpeg', 0.82));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function _injectStyles() {
  if (document.getElementById('at-styles')) return;
  const s = document.createElement('style');
  s.id = 'at-styles';
  s.textContent = `
/* ── Table ── */
table { width:100%; border-collapse:collapse; font-size:0.85rem; }
thead th { text-align:left; font-weight:500; font-size:0.72rem; letter-spacing:0.08em; text-transform:uppercase; opacity:0.35; padding:0.5rem 0.75rem; border-bottom:1px solid rgba(0,0,0,0.12); white-space:nowrap; user-select:none; }
thead th:first-child { padding-left:0; }
thead th.sortable { cursor:pointer; } thead th.sortable:hover { opacity:0.6; } thead th.sort-active { opacity:0.72!important; }
.sort-arrow { font-size:0.8em; margin-left:0.15em; }
.th-thumb { cursor:pointer; }
tbody tr { border-bottom:1px solid rgba(0,0,0,0.07); }
tbody tr:hover { background:rgba(0,0,0,0.02); }
td { padding:0.4rem 0.75rem; vertical-align:middle; }
.col-drag  { width:1.2rem; padding:0; }
.col-thumb { width:64px; padding:0.3rem 0.75rem 0.3rem 0; }
.col-num   { color:rgba(0,0,0,0.28); font-size:0.72rem; user-select:none; width:2rem; text-align:right; padding-right:0.75rem; padding-left:0; }
.col-title    { min-width:140px; }
.col-dims     { width:110px; }
.col-material { min-width:190px; }
.col-price    { width:90px; }
.col-year     { width:60px; }
.col-notes    { min-width:160px; }
.col-inv      { width:4.5rem; padding:0 0.5rem 0 0; text-align:right; white-space:nowrap; }
/* Drag */
.at-drag-handle { display:block; padding:0.5rem 0.4rem; color:rgba(0,0,0,0.22); cursor:grab; opacity:0; font-size:0.85rem; line-height:1; user-select:none; }
tr:hover .at-drag-handle { opacity:1; } .at-drag-handle:active { cursor:grabbing; }
tr.dragging { opacity:0.3; }
tr.drag-over-top    { box-shadow:inset 0  2px 0 rgba(85,144,249,0.65); }
tr.drag-over-bottom { box-shadow:inset 0 -2px 0 rgba(85,144,249,0.65); }
/* Thumbnails */
.at-thumb { display:block; width:56px; height:56px; object-fit:cover; border-radius:2px; cursor:zoom-in; background:rgb(200,200,201); transition:opacity 0.15s; }
.at-thumb:hover { opacity:0.8; }
.at-thumb-input { display:block; width:56px; height:56px; border:1px dashed rgba(0,0,0,0.22); border-radius:2px; background:rgb(208,208,209); font-family:"DM Sans"; font-weight:300; font-size:0.6rem; color:rgba(0,0,0,0.5); text-align:center; padding:4px; outline:none; }
.at-thumb-input::placeholder { color:rgba(0,0,0,0.22); }
.at-thumb-input:focus { border-color:rgba(85,144,249,0.55); background:white; }
/* Editable */
td[contenteditable] { cursor:text; outline:none; border-radius:3px; transition:background 0.12s; }
td[contenteditable]:hover { background:rgba(0,0,0,0.04); }
td[contenteditable]:focus { background:white; box-shadow:0 0 0 1px rgba(85,144,249,0.45); }
td[contenteditable]:empty::before { content:attr(data-placeholder); opacity:0.2; pointer-events:none; }
/* Tags */
.inv-tag { display:inline-block; font-size:0.65rem; letter-spacing:0.05em; color:rgba(0,0,0,0.35); cursor:pointer; padding:0.15rem 0.35rem; border-radius:2px; border:1px solid rgba(0,0,0,0.18); }
.inv-tag:hover { color:rgba(0,0,0,0.7); border-color:rgba(0,0,0,0.4); }
.inv-tag.paid { color:rgba(30,130,60,0.7); border-color:rgba(30,130,60,0.35); }
.res-tag { display:inline-block; font-size:0.65rem; letter-spacing:0.05em; color:rgba(30,120,60,0.65); padding:0.15rem 0.35rem; border-radius:2px; border:1px solid rgba(30,120,60,0.28); }
tr.reserved td[contenteditable] { color:rgba(30,120,60,0.75); }
/* Lightbox */
.at-lb { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.92); z-index:500; align-items:center; justify-content:center; }
.at-lb.open { display:flex; }
.at-lb-img { max-width:calc(100vw - 120px); max-height:100vh; object-fit:contain; display:block; user-select:none; }
.at-lb-close { position:fixed; top:1.25rem; right:1.5rem; color:white; font-size:1.5rem; cursor:pointer; opacity:0.5; background:none; border:none; padding:0.25rem 0.5rem; line-height:1; }
.at-lb-close:hover { opacity:1; }
.at-lb-arrow { position:fixed; top:50%; transform:translateY(-50%); color:white; font-size:1.5rem; cursor:pointer; opacity:0.4; background:none; border:none; padding:1rem; line-height:1; user-select:none; }
.at-lb-arrow:hover { opacity:1; }
.at-lb-prev { left:0.5rem; } .at-lb-next { right:0.5rem; }
.at-lb-info { position:fixed; bottom:1.5rem; right:1.5rem; text-align:right; color:white; line-height:1.6; pointer-events:none; }
.at-lb-title { font-size:0.85rem; opacity:0.9; } .at-lb-meta { font-size:0.75rem; opacity:0.5; }
/* Edit drawer */
.at-drawer { position:fixed; top:0; right:0; bottom:0; width:500px; max-width:100vw; background:white; box-shadow:-4px 0 28px rgba(0,0,0,0.13); z-index:400; transform:translateX(100%); transition:transform 0.22s ease; display:flex; flex-direction:column; }
.at-drawer.open { transform:translateX(0); }
.at-drawer-header { display:flex; align-items:center; justify-content:space-between; padding:1.2rem 1.5rem; border-bottom:1px solid rgba(0,0,0,0.09); flex-shrink:0; }
.at-drawer-title { font-size:0.78rem; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; opacity:0.7; }
.at-drawer-close { background:none; border:none; font-size:1.1rem; cursor:pointer; opacity:0.35; padding:0.25rem 0.4rem; line-height:1; }
.at-drawer-close:hover { opacity:1; }
.at-drawer-body { flex:1; overflow-y:auto; padding:1.5rem; display:flex; flex-direction:column; gap:1rem; }
.at-field label { display:block; font-size:0.68rem; opacity:0.45; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:0.3rem; }
.at-field input, .at-field textarea, .at-field select { width:100%; border:1px solid rgba(0,0,0,0.14); border-radius:3px; padding:0.45rem 0.65rem; font-family:"DM Sans"; font-size:0.85rem; font-weight:300; color:inherit; background:white; }
.at-field input:focus, .at-field textarea:focus, .at-field select:focus { outline:none; border-color:rgba(0,0,0,0.4); }
.at-field select { appearance:none; cursor:pointer; }
.at-field textarea { resize:vertical; min-height:120px; }
.at-2col { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }
.at-section-label { font-size:0.68rem; opacity:0.45; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:0.6rem; }
.at-photo-wrap { display:flex; gap:1rem; align-items:center; }
#at-photo-preview { width:72px; height:72px; object-fit:cover; background:#f0f0f0; border-radius:3px; flex-shrink:0; }
.at-photo-wrap .at-field { flex:1; margin:0; }
.at-photos-grid { display:flex; flex-wrap:wrap; gap:8px; }
.at-photo-thumb { position:relative; width:100px; height:100px; }
.at-photo-thumb img { width:100%; height:100%; object-fit:cover; border-radius:3px; display:block; }
.at-photo-del { position:absolute; top:3px; right:3px; background:rgba(0,0,0,0.6); border:none; color:white; border-radius:50%; width:18px; height:18px; font-size:9px; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0; line-height:1; }
.at-photo-del:hover { background:rgba(0,0,0,0.85); }
.at-photo-add { width:100px; height:100px; border:1.5px dashed rgba(0,0,0,0.18); border-radius:3px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.5rem; opacity:0.3; user-select:none; }
.at-photo-add:hover { opacity:0.6; }
.at-drawer-footer { padding:1rem 1.5rem; border-top:1px solid rgba(0,0,0,0.09); display:flex; gap:0.75rem; justify-content:flex-end; flex-shrink:0; }
.at-drawer-footer button { background:none; border:1px solid rgba(0,0,0,0.18); border-radius:3px; padding:0.4rem 1.1rem; font-family:"DM Sans"; font-size:0.82rem; font-weight:300; cursor:pointer; color:inherit; }
.at-drawer-footer button:hover { background:rgba(0,0,0,0.04); }
#at-save-btn { background:rgba(0,0,0,0.85)!important; color:white!important; border-color:transparent!important; }
@media (max-width:540px) { .col-dims { display:none; } }
/* ── Context menu ── */
.at-ctx-menu { display:none; position:fixed; background:white; border:1px solid rgba(0,0,0,0.14); border-radius:5px; box-shadow:0 6px 20px rgba(0,0,0,0.13); z-index:9999; min-width:175px; padding:0.3rem 0; font-size:0.82rem; font-family:"DM Sans",sans-serif; }
.at-ctx-item { padding:0.45rem 1rem; cursor:pointer; color:#111; font-weight:300; }
.at-ctx-item:hover { background:rgba(0,0,0,0.05); }
.at-ctx-danger { color:rgba(180,40,40,0.85); }
.at-ctx-sep { height:1px; background:rgba(0,0,0,0.09); margin:0.3rem 0; }
`;
  document.head.appendChild(s);
}
