/**
 * Collection module — grid or carousel display of works
 *
 * Usage (ES module):
 *   import Collection from './js/collection.js';
 *   Collection.init(containerEl, works, options);
 *
 * Or as a global drop-in (sets window.Collection):
 *   <script type="module" src="js/collection.js"></script>
 *
 * works: array of { id, photo, title, material, dimensions, price, invoiced, reserved }
 *
 * options:
 *   mode        'grid' | 'carousel'   default: 'grid'
 *   gap         number (px)           default: 4
 *   peek        number (px)           carousel: how much of prev/next to show. default: 0
 *   loop        boolean               carousel: wrap around. default: false
 *   minWidth    number (px)           grid: min column width. default: 260
 *   height      string                carousel: CSS height e.g. '100vh'. default: '100vh'
 *   aspectRatio string                grid: item aspect ratio. default: '1'
 *   previewBase string                base URL for preview page. default: 'preview.html'
 *   wall        boolean               carousel: wall mode — bg-removed images, info panel, zoom. default: false
 *   wallColor   string                wall background color. default: '#ece9e4'
 *
 * Wall carousel: full-height view, info panel fixed at bottom (crossfades between works),
 * click image to zoom into a full-clip overlay, mouse to pan, click again to close.
 * GSAP loaded automatically from CDN. Requires HTTP (not file://).
 */

const CDN = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'media/works/hi/'
  : 'https://dimzayan.nyc3.digitaloceanspaces.com/works/hi/';

const STYLES_ID = 'coll-styles';
const GSAP_CDN  = 'https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js';
const PANEL_H   = 110; /* px */

/* ── Styles ───────────────────────────────────────────────────────── */
const CSS = `
.coll-root { position: relative; }

/* Grid */
.coll-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--coll-min, 260px), 1fr));
  gap: var(--coll-gap, 4px);
}
.coll-grid-item { overflow: hidden; }
.coll-cell {
  display: block; overflow: hidden; position: relative;
  background: #ece9e4; text-decoration: none; cursor: pointer;
  width: 100%; height: 100%;
}
.coll-cell img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform 0.65s ease;
}
.coll-cell:hover img { transform: scale(1.02); }
.coll-cell-title {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 3rem 1.1rem 0.85rem;
  background: linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 100%);
  font-family: "DM Sans", sans-serif; font-size: 0.68rem; font-weight: 200;
  letter-spacing: 0.1em; color: rgba(255,255,255,0.88);
  opacity: 0; transition: opacity 0.32s ease; pointer-events: none;
}
.coll-cell:hover .coll-cell-title { opacity: 1; }

/* Carousel */
.coll-carousel-clip {
  overflow: hidden; position: relative; width: 100%;
}
.coll-track { display: flex; will-change: transform; height: 100%; }
.coll-car-item { flex: 0 0 auto; }

/* Wall image area — fills item height minus the fixed panel */
.coll-img-area {
  position: absolute; top: 0; left: 0; right: 0; bottom: ${PANEL_H}px;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.coll-img-area img {
  max-width: 92%; max-height: 92%;
  object-fit: contain; display: block;
  filter: drop-shadow(0 12px 40px rgba(0,0,0,0.09));
  cursor: zoom-in;
  user-select: none; -webkit-user-drag: none;
}

/* Fixed info panel — sits at the bottom of the clip, outside the track */
.coll-panel {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: ${PANEL_H}px; z-index: 5; pointer-events: none;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.3rem; padding: 0 2rem;
  font-family: "DM Sans", sans-serif; font-weight: 200; color: #222;
  text-align: center;
}
.coll-panel-inner {
  display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
  transition: opacity 0.28s ease;
  pointer-events: all;
}
.coll-panel-inner.fading { opacity: 0; }
.coll-panel-title  { font-size: 0.9rem; font-weight: 300; letter-spacing: 0.04em; }
.coll-panel-meta   { font-size: 0.68rem; opacity: 0.4; letter-spacing: 0.07em; }
.coll-panel-link   {
  font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase;
  color: #222; text-decoration: none; border-bottom: 1px solid rgba(0,0,0,0.18);
  padding-bottom: 2px; opacity: 0.4; transition: opacity 0.2s; margin-top: 0.2rem;
}
.coll-panel-link:hover { opacity: 1; }

/* Zoom overlay — covers the full clip, above track */
.coll-zoom-layer {
  position: absolute; inset: 0; z-index: 20;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s ease;
  cursor: zoom-out;
}
.coll-zoom-layer.active { opacity: 1; pointer-events: all; }
.coll-zoom-layer img {
  max-width: 100%; max-height: 100%;
  object-fit: contain; display: block;
  filter: drop-shadow(0 12px 40px rgba(0,0,0,0.09));
  transform-origin: 50% 50%;
  will-change: transform-origin;
  user-select: none; -webkit-user-drag: none;
}

/* Arrows — centred on image area (full height minus panel) */
.coll-arrow {
  position: absolute;
  top: calc(50% - ${PANEL_H / 2}px); transform: translateY(-50%);
  z-index: 6; background: none; border: none; padding: 1.8rem;
  cursor: pointer; opacity: 0.3; user-select: none; transition: opacity 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.coll-arrow::before {
  content: ""; display: block; width: 18px; height: 18px;
  border-top: 1.5px solid #111; border-right: 1.5px solid #111;
}
.coll-arrow.coll-prev { left: 0; }
.coll-arrow.coll-prev::before { transform: rotate(-135deg) translate(-2px, 2px); }
.coll-arrow.coll-next { right: 0; }
.coll-arrow.coll-next::before { transform: rotate(45deg) translate(-2px, 2px); }
.coll-arrow:hover { opacity: 1; }
.coll-arrow[disabled] { opacity: 0.07; pointer-events: none; }
`;

function injectStyles() {
  if (document.getElementById(STYLES_ID)) return;
  const s = document.createElement('style');
  s.id = STYLES_ID; s.textContent = CSS;
  document.head.appendChild(s);
}

/* ── Grid cell ────────────────────────────────────────────────────── */
function makeGridCell(work, previewBase) {
  const a = document.createElement('a');
  a.className = 'coll-cell';
  a.href = `${previewBase || 'preview.html'}?id=${encodeURIComponent(work.id)}`;
  a.target = '_blank'; a.rel = 'noopener';

  const img = document.createElement('img');
  img.src = CDN + (work.photo || work.id) + '.webp';
  img.alt = work.title || ''; img.loading = 'lazy';

  const title = document.createElement('div');
  title.className = 'coll-cell-title';
  title.textContent = work.title || '';

  a.appendChild(title); a.appendChild(img);
  return a;
}

/* ── Grid ─────────────────────────────────────────────────────────── */
function initGrid(root, works, opts) {
  const grid = document.createElement('div');
  grid.className = 'coll-grid';
  grid.style.setProperty('--coll-gap', `${opts.gap ?? 4}px`);
  if (opts.minWidth) grid.style.setProperty('--coll-min', `${opts.minWidth}px`);

  works.forEach(w => {
    const item = document.createElement('div');
    item.className = 'coll-grid-item';
    item.style.aspectRatio = opts.aspectRatio || '1';
    item.appendChild(makeGridCell(w, opts.previewBase));
    grid.appendChild(item);
  });

  root.appendChild(grid);
}

/* ── Carousel ─────────────────────────────────────────────────────── */
async function initCarousel(root, works, opts) {
  const peek      = opts.peek  ?? 0;
  const gap       = opts.gap   ?? 4;
  const loop      = !!opts.loop;
  const height    = opts.height || '100vh';
  const wall      = !!opts.wall;
  const wallColor = opts.wallColor || '#ece9e4';
  const n         = works.length;
  let current     = 0;

  const gsap = await new Promise(resolve => {
    if (window.gsap) return resolve(window.gsap);
    const s = document.createElement('script');
    s.src = GSAP_CDN;
    s.onload = () => resolve(window.gsap);
    document.head.appendChild(s);
  });

  /* Clip */
  const clip = document.createElement('div');
  clip.className = 'coll-carousel-clip';
  clip.style.height = height;
  if (wall) clip.style.background = wallColor;

  /* Track */
  const track = document.createElement('div');
  track.className = 'coll-track';
  track.style.gap = `${gap}px`;

  works.forEach(w => {
    const item = document.createElement('div');
    item.className = 'coll-car-item';
    item.style.position = 'relative';

    if (wall) {
      const imgArea = document.createElement('div');
      imgArea.className = 'coll-img-area';
      const img = document.createElement('img');
      img.src = CDN + '__' + (w.photo || w.id) + '.webp';
      img.alt = w.title || ''; img.loading = 'lazy';
      imgArea.appendChild(img);

      /* Zoom — click opens overlay, not handled here; see zoom layer below */
      img.addEventListener('click', () => openZoom(w, wallColor));

      item.appendChild(imgArea);
    } else {
      item.appendChild(makeGridCell(w, opts.previewBase));
    }

    track.appendChild(item);
  });

  clip.appendChild(track);

  /* ── Fixed panel (outside track, crossfades) ─────────────────── */
  let panelInner = null;
  if (wall) {
    const panel = document.createElement('div');
    panel.className = 'coll-panel';
    panelInner = document.createElement('div');
    panelInner.className = 'coll-panel-inner';
    panel.appendChild(panelInner);
    clip.appendChild(panel);
  }

  function updatePanel(w, animate) {
    if (!panelInner) return;
    const meta   = [w.material, w.dimensions, w.year].filter(Boolean).join('  ·  ');
    const status = w.invoiced ? 'Sold' : w.reserved ? 'Reserved' : w.price || '';

    const render = () => {
      panelInner.innerHTML = `
        <div class="coll-panel-title">${w.title || ''}</div>
        ${(meta || status) ? `<div class="coll-panel-meta">${[meta, status].filter(Boolean).join('  ·  ')}</div>` : ''}
        <a class="coll-panel-link" href="${opts.previewBase || 'preview.html'}?id=${encodeURIComponent(w.id)}" target="_blank" rel="noopener">View details</a>
      `;
      panelInner.classList.remove('fading');
    };

    if (animate === false) { render(); return; }
    panelInner.classList.add('fading');
    setTimeout(render, 140);
  }

  /* ── Zoom overlay ────────────────────────────────────────────── */
  const zoomLayer = document.createElement('div');
  zoomLayer.className = 'coll-zoom-layer';
  zoomLayer.style.background = wallColor;
  const zoomImg = document.createElement('img');
  zoomLayer.appendChild(zoomImg);
  clip.appendChild(zoomLayer);

  function openZoom(w) {
    zoomImg.src = CDN + (w.photo || w.id) + '.webp';
    zoomImg.style.transform = 'scale(1)';
    zoomImg.style.transformOrigin = '50% 50%';
    zoomLayer.classList.add('active');
  }

  zoomLayer.addEventListener('mousemove', e => {
    const r = zoomLayer.getBoundingClientRect();
    const ox = ((e.clientX - r.left) / r.width  * 100).toFixed(2);
    const oy = ((e.clientY - r.top)  / r.height * 100).toFixed(2);
    zoomImg.style.transformOrigin = `${ox}% ${oy}%`;
    zoomImg.style.transform = 'scale(2.4)';
  });

  zoomLayer.addEventListener('click', () => {
    zoomImg.style.transition = 'transform 0.35s ease, transform-origin 0.35s ease';
    zoomImg.style.transform = 'scale(1)';
    zoomImg.style.transformOrigin = '50% 50%';
    setTimeout(() => {
      zoomLayer.classList.remove('active');
      zoomImg.style.transition = '';
    }, 320);
  });

  root.appendChild(clip);

  /* Arrows */
  const prevBtn = document.createElement('button');
  prevBtn.className = 'coll-arrow coll-prev';
  prevBtn.setAttribute('aria-label', 'Previous');

  const nextBtn = document.createElement('button');
  nextBtn.className = 'coll-arrow coll-next';
  nextBtn.setAttribute('aria-label', 'Next');

  root.appendChild(prevBtn);
  root.appendChild(nextBtn);

  /* ── Layout ─────────────────────────────────────────────────── */
  const getItemWidth = () => {
    const W = clip.offsetWidth;
    return peek > 0 ? Math.max(W - 2 * peek - 2 * gap, 80) : W;
  };

  const getOffset = idx => {
    const iw = getItemWidth();
    return peek > 0 ? (peek + gap) - idx * (iw + gap) : -idx * (iw + gap);
  };

  function applyLayout() {
    const iw = getItemWidth();
    const ih = clip.offsetHeight;
    track.querySelectorAll('.coll-car-item').forEach(item => {
      item.style.width  = `${iw}px`;
      item.style.height = `${ih}px`;
      if (!wall) {
        const cell = item.querySelector('.coll-cell');
        if (cell) {
          cell.style.width = `${iw}px`;
          cell.style.height = `${ih}px`;
          const img = cell.querySelector('img');
          if (img) img.style.objectFit = 'contain';
        }
      }
    });
  }

  /* ── Animation ───────────────────────────────────────────────── */
  function updateItemStates() {
    track.querySelectorAll('.coll-car-item').forEach((item, i) => {
      gsap.to(item, {
        scale: i === current ? 1 : 0.94, opacity: i === current ? 1 : 0.45,
        duration: 0.6, ease: 'power2.out', overwrite: true
      });
    });
  }

  function moveTo(x, animate) {
    if (animate === false) gsap.set(track, { x });
    else gsap.to(track, { x, duration: 0.85, ease: 'expo.out', overwrite: true });
    updateItemStates();
  }

  function goTo(idx, animate) {
    current = loop ? ((idx % n) + n) % n : Math.max(0, Math.min(idx, n - 1));
    moveTo(getOffset(current), animate);
    updatePanel(works[current], animate);
    prevBtn.disabled = !loop && current === 0;
    nextBtn.disabled = !loop && current === n - 1;
  }

  setTimeout(() => { applyLayout(); goTo(0, false); }, 0);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { applyLayout(); goTo(current, false); }, 80);
  });

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); e.preventDefault(); }
  });

  /* ── Drag / swipe ────────────────────────────────────────────── */
  let dragStartX = null, dragLastX = null, dragStartT = null;
  let dragVel = 0, dragging = false, trackBaseX = 0;

  function onDragStart(clientX) {
    dragStartX = dragLastX = clientX; dragStartT = Date.now();
    dragVel = 0; dragging = false;
    trackBaseX = gsap.getProperty(track, 'x');
    gsap.killTweensOf(track);
  }
  function onDragMove(clientX) {
    if (dragStartX === null) return;
    if (Math.abs(clientX - dragStartX) > 4) dragging = true;
    if (!dragging) return;
    const now = Date.now();
    dragVel = (clientX - dragLastX) / Math.max(now - dragStartT, 1) * 0.4 + dragVel * 0.6;
    dragLastX = clientX; dragStartT = now;
    gsap.set(track, { x: trackBaseX + (clientX - dragStartX) });
  }
  function onDragEnd(clientX) {
    if (dragStartX === null) return;
    dragStartX = null;
    if (!dragging) return;
    const projectedX = gsap.getProperty(track, 'x') + dragVel * 180;
    const origin = peek > 0 ? peek + gap : 0;
    goTo(Math.round((origin - projectedX) / (getItemWidth() + gap)));
  }

  clip.addEventListener('mousedown',   e => onDragStart(e.clientX));
  window.addEventListener('mousemove', e => { if (dragStartX !== null) onDragMove(e.clientX); });
  window.addEventListener('mouseup',   e => onDragEnd(e.clientX));

  clip.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX),      { passive: true });
  clip.addEventListener('touchmove',  e => onDragMove(e.touches[0].clientX),       { passive: true });
  clip.addEventListener('touchend',   e => onDragEnd(e.changedTouches[0].clientX), { passive: true });

  clip.addEventListener('click', e => { if (dragging) { e.preventDefault(); e.stopPropagation(); } }, true);
}

/* ── Public API ───────────────────────────────────────────────────── */
function init(container, works, opts = {}) {
  injectStyles();
  works = works || [];
  const root = typeof container === 'string' ? document.querySelector(container) : container;
  if (!root || !works.length) return;
  root.classList.add('coll-root');
  opts.mode === 'carousel' ? initCarousel(root, works, opts) : initGrid(root, works, opts);
}

const Collection = { init };
window.Collection = Collection;
export default Collection;
