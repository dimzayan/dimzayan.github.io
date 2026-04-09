/**
 * Inline-edit press articles table module.
 * Fields: source, date, link, exhibition (optional column)
 *
 * Usage:
 *   const tbl = initPressTable({ tableEl, exhibits, showExhibitionCol, onRightClick, onChange });
 *   tbl.renderData(pressData, filterFn);
 *   tbl.addRow(defaults, existingId);
 *   tbl.gatherData();
 */

let _stylesInjected = false;
function _injectStyles() {
  if (_stylesInjected) return;
  _stylesInjected = true;
  const s = document.createElement('style');
  s.textContent = `
    .pt-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; font-family: 'DM Sans', sans-serif; font-weight: 300; }
    .pt-table thead th { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.4; text-align: left; padding: 0.55rem 0.75rem; border-bottom: 1px solid rgba(0,0,0,0.08); white-space: nowrap; }
    .pt-table td { border-bottom: 1px solid rgba(0,0,0,0.05); vertical-align: middle; }
    .pt-table tbody tr:last-child td { border-bottom: none; }
    .pt-table tbody tr:hover { background: rgba(0,0,0,0.015); }
    .pt-inp { width: 100%; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.84rem; font-weight: 300; color: #111; padding: 0.65rem 0.75rem; outline: none; }
    .pt-inp:focus { background: rgba(0,0,0,0.025); border-radius: 2px; }
    .pt-link-wrap { display: flex; align-items: center; }
    .pt-open-link { font-size: 0.72rem; opacity: 0; color: #111; text-decoration: none; padding: 0 0.5rem; flex-shrink: 0; }
    .pt-table tr:hover .pt-open-link { opacity: 0.35; }
    .pt-open-link:hover { opacity: 1 !important; }
    .pt-num { width: 2.5rem; text-align: center; font-size: 0.72rem; opacity: 0.3; padding: 0.65rem 0; user-select: none; }
    .pt-del-cell { width: 2.5rem; text-align: center; }
    .pt-del-btn { background: none; border: none; font-size: 0.9rem; line-height: 1; color: #c00; opacity: 0; cursor: pointer; padding: 0.2rem 0.5rem; font-family: inherit; border-radius: 2px; }
    .pt-table tr:hover .pt-del-btn { opacity: 0.3; }
    .pt-del-btn:hover { opacity: 1 !important; background: rgba(200,0,0,0.06); }
    .pt-sel { width: 100%; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 300; color: #111; padding: 0.65rem 0.75rem; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; }
  `;
  document.head.appendChild(s);
}

let _rowCounter = 0;

export function initPressTable({ tableEl, exhibits, showExhibitionCol, onRightClick, onChange }) {
  _injectStyles();

  const showEx = showExhibitionCol !== false;

  tableEl.className = 'pt-table';

  // Build thead
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr>' +
    '<th class="pt-num"></th>' +
    '<th>Title</th>' +
    '<th style="width:11rem">Source</th>' +
    '<th style="width:10rem">Date</th>' +
    '<th>Link</th>' +
    (showEx ? '<th style="width:13rem">Exhibition</th>' : '') +
    '<th class="pt-del-cell"></th>' +
    '</tr>';
  tableEl.innerHTML = '';
  tableEl.appendChild(thead);

  const tbody = document.createElement('tbody');
  tableEl.appendChild(tbody);

  function renumber() {
    Array.from(tbody.querySelectorAll('tr[data-id]')).forEach(function(tr, i) {
      const c = tr.querySelector('.pt-num');
      if (c) c.textContent = i + 1;
    });
  }

  function makeRow(rowId, article) {
    const tr = document.createElement('tr');
    tr.dataset.id = rowId;

    // Number cell
    const numTd = document.createElement('td');
    numTd.className = 'pt-num';
    numTd.textContent = tbody.children.length + 1;
    tr.appendChild(numTd);

    // Title
    const titleTd = document.createElement('td');
    const titleInp = document.createElement('input');
    titleInp.className = 'pt-inp';
    titleInp.type = 'text';
    titleInp.value = article.title || '';
    titleInp.placeholder = 'Article title';
    titleInp.dataset.field = 'title';
    if (onChange) titleInp.addEventListener('input', onChange);
    titleTd.appendChild(titleInp);
    tr.appendChild(titleTd);

    // Source
    const srcTd = document.createElement('td');
    const srcInp = document.createElement('input');
    srcInp.className = 'pt-inp';
    srcInp.type = 'text';
    srcInp.value = article.source || '';
    srcInp.placeholder = 'Publication';
    srcInp.dataset.field = 'source';
    if (onChange) srcInp.addEventListener('input', onChange);
    srcTd.appendChild(srcInp);
    tr.appendChild(srcTd);

    // Date
    const dateTd = document.createElement('td');
    const dateInp = document.createElement('input');
    dateInp.className = 'pt-inp';
    dateInp.type = 'date';
    dateInp.value = article.date || '';
    dateInp.dataset.field = 'date';
    if (onChange) dateInp.addEventListener('change', onChange);
    dateTd.appendChild(dateInp);
    tr.appendChild(dateTd);

    // Link
    const linkTd = document.createElement('td');
    const linkWrap = document.createElement('div');
    linkWrap.className = 'pt-link-wrap';
    const linkInp = document.createElement('input');
    linkInp.className = 'pt-inp';
    linkInp.type = 'text';
    linkInp.value = article.link || '';
    linkInp.placeholder = 'https://';
    linkInp.dataset.field = 'link';
    const openA = document.createElement('a');
    openA.className = 'pt-open-link';
    openA.title = 'Open';
    openA.target = '_blank';
    openA.rel = 'noopener';
    openA.textContent = '↗';
    openA.href = article.link || '#';
    linkInp.addEventListener('input', function() { openA.href = linkInp.value || '#'; if (onChange) onChange(); });
    linkWrap.appendChild(linkInp);
    linkWrap.appendChild(openA);
    linkTd.appendChild(linkWrap);
    tr.appendChild(linkTd);

    // Exhibition column (optional)
    if (showEx) {
      const exTd = document.createElement('td');
      const exSel = document.createElement('select');
      exSel.className = 'pt-sel';
      exSel.dataset.field = 'exhibition';
      const blankOpt = document.createElement('option');
      blankOpt.value = '';
      blankOpt.textContent = '—';
      exSel.appendChild(blankOpt);
      if (exhibits) {
        Object.entries(exhibits).forEach(function(entry) {
          const opt = document.createElement('option');
          opt.value = entry[0];
          opt.textContent = entry[1].title || entry[0];
          exSel.appendChild(opt);
        });
      }
      exSel.value = article.exhibition || '';
      if (onChange) exSel.addEventListener('change', onChange);
      exTd.appendChild(exSel);
      tr.appendChild(exTd);
    } else {
      // Store exhibition as data attribute when column is hidden
      if (article.exhibition) tr.dataset.exhibition = article.exhibition;
    }

    // Delete button
    const delTd = document.createElement('td');
    delTd.className = 'pt-del-cell';
    const delBtn = document.createElement('button');
    delBtn.className = 'pt-del-btn';
    delBtn.title = 'Delete';
    delBtn.textContent = '×';
    delBtn.addEventListener('click', function() {
      tr.remove();
      renumber();
      if (onChange) onChange();
    });
    delTd.appendChild(delBtn);
    tr.appendChild(delTd);

    // Right-click
    if (onRightClick) {
      tr.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        onRightClick(tr, e);
      });
    }

    return tr;
  }

  function renderData(pressData, filter) {
    tbody.innerHTML = '';
    const entries = Object.entries(pressData || {});
    // Sort by date descending
    entries.sort(function(a, b) {
      return (b[1].date || '').localeCompare(a[1].date || '');
    });
    entries.forEach(function(entry) {
      if (filter && !filter(entry[0], entry[1])) return;
      tbody.appendChild(makeRow(entry[0], entry[1]));
    });
    renumber();
  }

  function addRow(defaults, existingId) {
    const id = existingId || ('prx_' + Date.now() + '_' + (++_rowCounter));
    const article = Object.assign({ title: '', source: '', date: '', link: '' }, defaults || {});
    const tr = makeRow(id, article);
    tbody.appendChild(tr);
    renumber();
    const firstInp = tr.querySelector('.pt-inp');
    if (firstInp) { firstInp.focus(); firstInp.select(); }
    return tr;
  }

  function gatherData() {
    const result = {};
    Array.from(tbody.querySelectorAll('tr[data-id]')).forEach(function(tr) {
      const id = tr.dataset.id;
      const obj = {};
      tr.querySelectorAll('[data-field]').forEach(function(el) {
        const val = el.tagName === 'SELECT' ? el.value : el.value.trim();
        if (val) obj[el.dataset.field] = val;
      });
      // When exhibition col is hidden, read from data attribute
      if (!showEx && tr.dataset.exhibition) obj.exhibition = tr.dataset.exhibition;
      if (obj.source || obj.link) result[id] = obj;
    });
    return result;
  }

  return { renderData, addRow, gatherData, renumber, tbody };
}
