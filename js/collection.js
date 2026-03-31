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
 *   height      string                carousel: CSS height e.g. '70vh'. default: '70vh'
 *   aspectRatio string                grid: item aspect ratio e.g. '1' or '4/5'. default: '1'
 *   previewBase string                base URL for preview page. default: 'preview.html'
 *   wall        boolean               carousel: unified wall bg, transparent items, bg-removed images. default: false
 *   wallColor   string                carousel: wall background color. default: '#ece9e4'
 *
 * GSAP is loaded automatically from CDN when in carousel mode.
 * Requires serving over HTTP (localhost or production) — not file://.
 */

const CDN = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'media/works/hi/'
  : 'https://dimzayan.nyc3.digitaloceanspaces.com/works/hi/';

const STYLES_ID = 'coll-styles';
const GSAP_CDN  = 'https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js';

/* ── Styles ───────────────────────────────────────────────────────── */
const CSS = `
.coll-root { position: relative; }

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

.coll-carousel-clip { overflow: hidden; position: relative; width: 100%; }
.coll-track {
  display: flex;
  transition: transform 0.52s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}
.coll-track.gsap-driven { transition: none; }
.coll-car-item { flex: 0 0 auto; }

.coll-wall-img {
  filter: drop-shadow(0 12px 40px rgba(0,0,0,0.09));
  transition: filter 0.4s ease;
}

.coll-arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  z-index: 20; background: none; border: none; padding: 1.2rem;
  cursor: pointer; opacity: 0.3; user-select: none; transition: opacity 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.coll-arrow::before {
  content: ""; display: block;
  width: 11px; height: 11px;
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
  s.id = STYLES_ID;
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ── Cell builder ─────────────────────────────────────────────────── */
function makeCell(work, previewBase, wall) {
  const a = document.createElement('a');
  a.className = 'coll-cell';
  if (wall) a.style.background = 'transparent';
  a.href = `${previewBase || 'preview.html'}?id=${encodeURIComponent(work.id)}`;
  a.target = '_blank';
  a.rel = 'noopener';

  const photo = work.photo || work.id;
  const img = document.createElement('img');
  img.src = CDN + (wall ? '__' + photo : photo) + '.webp';
  img.alt = work.title || '';
  img.loading = 'lazy';
  if (wall) img.className = 'coll-wall-img';

  if (!wall) {
    const title = document.createElement('div');
    title.className = 'coll-cell-title';
    title.textContent = work.title || '';
    a.appendChild(title);
  }

  a.appendChild(img);
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
    item.appendChild(makeCell(w, opts.previewBase));
    grid.appendChild(item);
  });

  root.appendChild(grid);
}

/* ── Carousel ─────────────────────────────────────────────────────── */
async function initCarousel(root, works, opts) {
  const peek   = opts.peek   ?? 0;
  const gap    = opts.gap    ?? 4;
  const loop   = !!opts.loop;
  const height = opts.height || '70vh';
  const wall   = !!opts.wall;
  const n      = works.length;
  let current  = 0;

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
  if (wall) clip.style.background = opts.wallColor || '#ece9e4';

  /* Track */
  const track = document.createElement('div');
  track.className = 'coll-track gsap-driven';
  track.style.gap = `${gap}px`;

  works.forEach(w => {
    const item = document.createElement('div');
    item.className = 'coll-car-item';
    if (wall) item.style.background = 'transparent';
    item.appendChild(makeCell(w, opts.previewBase, wall));
    track.appendChild(item);
  });

  clip.appendChild(track);
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
      const cell = item.querySelector('.coll-cell');
      if (cell) {
        cell.style.width  = `${iw}px`;
        cell.style.height = `${ih}px`;
        const img = cell.querySelector('img');
        if (img) img.style.objectFit = 'contain';
      }
    });
  }

  /* ── Animation ───────────────────────────────────────────────── */
  function updateItemStates() {
    track.querySelectorAll('.coll-car-item').forEach((item, i) => {
      gsap.to(item, {
        scale:   i === current ? 1    : 0.94,
        opacity: i === current ? 1    : 0.45,
        duration: 0.6, ease: 'power2.out', overwrite: true
      });
    });
  }

  function moveTo(x, animate) {
    if (animate === false) {
      gsap.set(track, { x });
    } else {
      gsap.to(track, { x, duration: 0.85, ease: 'expo.out', overwrite: true });
    }
    updateItemStates();
  }

  function goTo(idx, animate) {
    current = loop ? ((idx % n) + n) % n : Math.max(0, Math.min(idx, n - 1));
    moveTo(getOffset(current), animate);
    prevBtn.disabled = !loop && current === 0;
    nextBtn.disabled = !loop && current === n - 1;
  }

  setTimeout(() => {
    applyLayout();
    goTo(0, false);
  }, 0);

  /* Resize */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { applyLayout(); goTo(current, false); }, 80);
  });

  /* Arrows */
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  /* Keyboard */
  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); e.preventDefault(); }
  });

  /* ── Drag / swipe ────────────────────────────────────────────── */
  let dragStartX = null, dragLastX = null, dragStartT = null;
  let dragVel = 0, dragging = false, trackBaseX = 0;

  function onDragStart(clientX) {
    dragStartX = dragLastX = clientX;
    dragStartT = Date.now();
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

  clip.addEventListener('mousedown',  e => onDragStart(e.clientX));
  window.addEventListener('mousemove', e => { if (dragStartX !== null) onDragMove(e.clientX); });
  window.addEventListener('mouseup',   e => onDragEnd(e.clientX));

  clip.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX),       { passive: true });
  clip.addEventListener('touchmove',  e => onDragMove(e.touches[0].clientX),        { passive: true });
  clip.addEventListener('touchend',   e => onDragEnd(e.changedTouches[0].clientX),  { passive: true });

  clip.addEventListener('click', e => { if (dragging) { e.preventDefault(); e.stopPropagation(); } }, true);
}

/* ── Public API ───────────────────────────────────────────────────── */
function init(container, works, opts = {}) {
  injectStyles();
  works = works || [];
  const root = typeof container === 'string' ? document.querySelector(container) : container;
  if (!root || !works.length) return;
  root.classList.add('coll-root');
  if (opts.mode === 'carousel') {
    initCarousel(root, works, opts);
  } else {
    initGrid(root, works, opts);
  }
}

const Collection = { init };
window.Collection = Collection;
export default Collection;
