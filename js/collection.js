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

/* Room mode */
.coll-room-layer {
  position: relative; width: 100%; height: 100vh; overflow: hidden; background: #000;
}
.coll-room-photo {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: cover; display: block;
  pointer-events: none;
}
.coll-hotspot {
  position: absolute; cursor: pointer;
  border: 1px solid rgba(255,255,255,0);
  transition: border 0.2s, background 0.2s;
}
.coll-hotspot:hover {
  border: 1px solid rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.08);
}
.coll-carousel-layer { position: relative; width: 100%; }
.coll-back-btn {
  position: absolute; top: 1rem; left: 1rem; z-index: 30;
  background: rgba(255,255,255,0.85); border: none; border-radius: 2px;
  font-family: "DM Sans", sans-serif; font-size: 0.72rem; font-weight: 200;
  letter-spacing: 0.08em; color: #111; cursor: pointer;
  padding: 0.35rem 0.75rem; opacity: 0.7; transition: opacity 0.2s;
}
.coll-back-btn:hover { opacity: 1; }
.coll-room-layer .coll-arrow { top: 50%; transform: translateY(-50%); }

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

/* Wall image area — flex child, fills item height minus the fixed panel */
.coll-car-item.wall { display: flex; flex-direction: column; }
.coll-img-area {
  flex: 1 1 auto; min-height: 0;
  display: flex; align-items: center; justify-content: center;
  overflow: visible;
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

/* Xfade overlay — covers the full clip, above track */
.coll-zoom-layer {
  position: absolute; inset: 0; z-index: 20;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.5s ease;
  cursor: zoom-out;
}
.coll-zoom-layer.active { opacity: 1; pointer-events: all; }
.coll-zoom-layer img {
  max-width: 100%; max-height: 100%;
  object-fit: contain; display: block;
  filter: drop-shadow(0 12px 40px rgba(0,0,0,0.09));
  transform-origin: 50% 50%;
  user-select: none; -webkit-user-drag: none;
}

/* Arrows — centred on image area (full height minus panel) */
.coll-arrow {
  position: absolute;
  top: calc(50% - ${PANEL_H / 2}px); transform: translateY(-50%);
  z-index: 6; background: none; border: none; padding: 2.2rem;
  cursor: pointer; opacity: 0.3; user-select: none; transition: opacity 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.coll-arrow::before {
  content: ""; display: block; width: 22px; height: 22px;
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

/* ── GSAP loader ──────────────────────────────────────────────────── */
function loadGsap() {
  return new Promise(resolve => {
    if (window.gsap) return resolve(window.gsap);
    const s = document.createElement('script');
    s.src = GSAP_CDN;
    s.onload = () => resolve(window.gsap);
    document.head.appendChild(s);
  });
}

/* ── Room mode ────────────────────────────────────────────────────── */
async function initRoom(root, works, opts) {
  const rooms = opts.rooms || [];
  if (!rooms.length) return initCarousel(root, works, opts);

  const gsap = await loadGsap();

  const workMap = {};
  works.forEach(w => { workMap[w.id] = w; });

  const orderedWorks = [];
  const workToRoom   = {};
  rooms.forEach((room, ri) => {
    (room.hotspots || []).forEach(hs => {
      if (workMap[hs.id] && workToRoom[hs.id] === undefined) {
        orderedWorks.push(workMap[hs.id]);
        workToRoom[hs.id] = ri;
      }
    });
  });
  works.forEach(w => {
    if (workToRoom[w.id] === undefined) {
      orderedWorks.push(w);
      workToRoom[w.id] = 0;
    }
  });

  /* DOM */
  const roomLayer = document.createElement('div');
  roomLayer.className = 'coll-room-layer';

  const roomImgA = document.createElement('img');
  roomImgA.className = 'coll-room-photo';
  const roomImgB = document.createElement('img');
  roomImgB.className = 'coll-room-photo';
  roomImgB.style.opacity = '0';
  roomLayer.appendChild(roomImgA);
  roomLayer.appendChild(roomImgB);
  let activeImg   = roomImgA;
  let inactiveImg = roomImgB;

  const roomPrev = document.createElement('button');
  roomPrev.className = 'coll-arrow coll-prev';
  roomPrev.setAttribute('aria-label', 'Previous room');
  const roomNext = document.createElement('button');
  roomNext.className = 'coll-arrow coll-next';
  roomNext.setAttribute('aria-label', 'Next room');
  roomLayer.appendChild(roomPrev);
  roomLayer.appendChild(roomNext);

  const carouselLayer = document.createElement('div');
  carouselLayer.className = 'coll-carousel-layer';
  carouselLayer.style.display = 'none';

  const backBtn = document.createElement('button');
  backBtn.className = 'coll-back-btn';
  backBtn.textContent = '\u2190 Room view';
  carouselLayer.appendChild(backBtn);

  const carouselContainer = document.createElement('div');
  carouselLayer.appendChild(carouselContainer);

  root.appendChild(roomLayer);
  root.appendChild(carouselLayer);

  let currentRoom        = 0;
  let carouselGoTo       = null;
  let getCarouselIdx     = () => 0;
  let carouselApplyLayout = () => {};

  function showRoom(idx) {
    currentRoom = ((idx % rooms.length) + rooms.length) % rooms.length;
    const room  = rooms[currentRoom];
    activeImg.src = CDN + room.photo;
    gsap.set(activeImg,   { opacity: 1 });
    gsap.set(inactiveImg, { opacity: 0 });
    roomLayer.querySelectorAll('.coll-hotspot').forEach(el => el.remove());
    (room.hotspots || []).forEach(hs => {
      const w = workMap[hs.id];
      const el = document.createElement('div');
      el.className = 'coll-hotspot';
      el.dataset.id = hs.id;
      el.style.left   = hs.x + '%';
      el.style.top    = hs.y + '%';
      el.style.width  = hs.w + '%';
      el.style.height = hs.h + '%';
      if (hs.type === 'room') el.addEventListener('click', () => showRoom(hs.target));
      else if (w) el.addEventListener('click', () => clickHotspot(hs, w));
      roomLayer.appendChild(el);
    });
    roomPrev.disabled = rooms.length <= 1;
    roomNext.disabled = rooms.length <= 1;
  }

  function clickHotspot(hs, w) {
    const workIdx = orderedWorks.findIndex(ow => ow.id === w.id);
    root.classList.add('coll-in-carousel');
    carouselLayer.style.opacity = '0';
    carouselLayer.style.display = '';
    carouselApplyLayout();
    if (carouselGoTo) carouselGoTo(workIdx, false);
    gsap.timeline()
      .to(roomLayer,     { opacity: 0, duration: 0.55, ease: 'power1.inOut' }, 0)
      .to(carouselLayer, { opacity: 1, duration: 0.55, ease: 'power1.inOut', onComplete: () => {
        roomLayer.style.display = 'none';
        gsap.set(roomLayer, { opacity: 1 });
      }}, 0);
  }

  backBtn.addEventListener('click', () => {
    root.classList.remove('coll-in-carousel');
    gsap.to(carouselLayer, { opacity: 0, duration: 0.3, onComplete: () => {
      const wi = getCarouselIdx();
      const w  = orderedWorks[wi];
      const ri = w ? (workToRoom[w.id] ?? 0) : currentRoom;
      carouselLayer.style.display = 'none';
      showRoom(ri);
      roomLayer.style.display = '';
      gsap.fromTo(roomLayer, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    }});
  });

  roomPrev.addEventListener('click', () => showRoom(currentRoom - 1));
  roomNext.addEventListener('click', () => showRoom(currentRoom + 1));

  showRoom(0);

  await initCarousel(carouselContainer, orderedWorks, {
    ...opts,
    mode: 'carousel',
    onReady: (api) => {
      carouselGoTo        = api.goTo;
      getCarouselIdx      = api.getCurrentIdx;
      carouselApplyLayout = api.applyLayout;
    }
  });
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
  // displayIdx tracks position in the track DOM (includes clones at 0 and n+1 when looping)
  let displayIdx  = loop ? 1 : 0;

  const gsap = await loadGsap();

  /* Clip */
  const clip = document.createElement('div');
  clip.className = 'coll-carousel-clip';
  clip.style.height = height;
  if (wall) clip.style.background = wallColor;

  /* Track */
  const track = document.createElement('div');
  track.className = 'coll-track';
  track.style.gap = `${gap}px`;

  function makeItem(w) {
    const item = document.createElement('div');
    item.className = 'coll-car-item';
    item.style.position = 'relative';
    if (wall) {
      item.classList.add('wall');
      const imgArea = document.createElement('div');
      imgArea.className = 'coll-img-area';
      const img = document.createElement('img');
      img.src = CDN + '__' + (w.photo || w.id) + '.webp';
      img.alt = w.title || ''; img.loading = 'lazy';
      if (w.displayScale && w.displayScale !== 1) {
        img.style.transform = `scale(${w.displayScale})`;
      }
      imgArea.appendChild(img);
      img.addEventListener('click', () => openZoom(w));
      const spacer = document.createElement('div');
      spacer.style.flexShrink = '0';
      spacer.style.height = PANEL_H + 'px';
      item.appendChild(imgArea);
      item.appendChild(spacer);
    } else {
      item.appendChild(makeGridCell(w, opts.previewBase));
    }
    return item;
  }

  // Prepend clone of last, append clone of first for seamless looping
  if (loop) track.appendChild(makeItem(works[n - 1]));
  works.forEach(w => track.appendChild(makeItem(w)));
  if (loop) track.appendChild(makeItem(works[0]));

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

  /* ── Xfade overlay ───────────────────────────────────────────── */
  const zoomLayer = document.createElement('div');
  zoomLayer.className = 'coll-zoom-layer';
  zoomLayer.style.background = wallColor;
  const zoomImg = document.createElement('img');
  zoomLayer.appendChild(zoomImg);
  clip.appendChild(zoomLayer);

  function openZoom(w) {
    zoomImg.src = CDN + (w.photo || w.id) + '.webp';
    zoomImg.style.transformOrigin = '50% 50%';
    zoomImg.style.transform = 'scale(1.8)';
    zoomLayer.classList.add('active');
  }

  zoomLayer.addEventListener('mousemove', e => {
    const r  = zoomLayer.getBoundingClientRect();
    const ox = ((e.clientX - r.left) / r.width  * 100).toFixed(2);
    const oy = ((e.clientY - r.top)  / r.height * 100).toFixed(2);
    zoomImg.style.transformOrigin = `${ox}% ${oy}%`;
  });

  zoomLayer.addEventListener('click', () => {
    zoomLayer.classList.remove('active');
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
    if (peek <= 0) return W;
    const natural = W - 2 * peek - 2 * gap;
    return natural >= 200 ? natural : W; // fall back to full-width on narrow screens
  };

  const peekFits = () => peek > 0 && getItemWidth() < clip.offsetWidth;

  const getOffset = idx => {
    const iw = getItemWidth();
    return peekFits() ? (peek + gap) - idx * (iw + gap) : -idx * (iw + gap);
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
  function updateItemStates(instant) {
    track.querySelectorAll('.coll-car-item').forEach((item, i) => {
      const active = i === displayIdx;
      if (instant) {
        gsap.set(item, { scale: active ? 1 : 0.94, opacity: active ? 1 : 0.45 });
      } else {
        gsap.to(item, {
          scale: active ? 1 : 0.94, opacity: active ? 1 : 0.45,
          duration: 0.6, ease: 'power2.out', overwrite: true
        });
      }
    });
  }

  function moveTo(x, animate, onComplete) {
    if (animate === false) {
      gsap.set(track, { x });
      updateItemStates();
      if (onComplete) onComplete();
    } else {
      gsap.to(track, { x, duration: 0.85, ease: 'expo.out', overwrite: true, onComplete });
      updateItemStates();
    }
  }

  function goTo(idx, animate) {
    current    = loop ? ((idx % n) + n) % n : Math.max(0, Math.min(idx, n - 1));
    displayIdx = loop ? current + 1 : current;
    moveTo(getOffset(displayIdx), animate);
    updatePanel(works[current], animate);
    prevBtn.disabled = !loop && current === 0;
    nextBtn.disabled = !loop && current === n - 1;
  }

  function navigatePrev() {
    if (loop && current === 0) {
      // Animate to clone-of-last at displayIdx 0, then silently jump to real last
      displayIdx = 0;
      updatePanel(works[n - 1], true);
      moveTo(getOffset(0), true, () => {
        current    = n - 1;
        displayIdx = n;
        gsap.set(track, { x: getOffset(n) });
        updateItemStates(true);
      });
    } else {
      goTo(current - 1);
    }
  }

  function navigateNext() {
    if (loop && current === n - 1) {
      // Animate to clone-of-first at displayIdx n+1, then silently jump to real first
      displayIdx = n + 1;
      updatePanel(works[0], true);
      moveTo(getOffset(n + 1), true, () => {
        current    = 0;
        displayIdx = 1;
        gsap.set(track, { x: getOffset(1) });
        updateItemStates(true);
      });
    } else {
      goTo(current + 1);
    }
  }

  setTimeout(() => { applyLayout(); goTo(0, false); }, 0);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { applyLayout(); goTo(current, false); }, 80);
  });

  prevBtn.addEventListener('click', navigatePrev);
  nextBtn.addEventListener('click', navigateNext);

  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { navigatePrev(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { navigateNext(); e.preventDefault(); }
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
    const projectedX  = gsap.getProperty(track, 'x') + dragVel * 180;
    const origin      = peek > 0 ? peek + gap : 0;
    const rawDisplay  = Math.round((origin - projectedX) / (getItemWidth() + gap));
    // Convert display index back to logical index (real items start at displayIdx 1 when looping)
    const logicalIdx  = loop ? rawDisplay - 1 : rawDisplay;
    goTo(logicalIdx);
  }

  clip.addEventListener('mousedown',   e => onDragStart(e.clientX));
  window.addEventListener('mousemove', e => { if (dragStartX !== null) onDragMove(e.clientX); });
  window.addEventListener('mouseup',   e => onDragEnd(e.clientX));

  clip.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX),      { passive: true });
  clip.addEventListener('touchmove',  e => onDragMove(e.touches[0].clientX),       { passive: true });
  clip.addEventListener('touchend',   e => onDragEnd(e.changedTouches[0].clientX), { passive: true });

  clip.addEventListener('click', e => { if (dragging) { e.preventDefault(); e.stopPropagation(); } }, true);

  if (opts.onReady) opts.onReady({ goTo, getCurrentIdx: () => current, applyLayout });
}

/* ── Public API ───────────────────────────────────────────────────── */
function init(container, works, opts = {}) {
  injectStyles();
  works = works || [];
  const root = typeof container === 'string' ? document.querySelector(container) : container;
  if (!root || !works.length) return;
  root.classList.add('coll-root');
  if (opts.mode === 'room')     initRoom(root, works, opts);
  else if (opts.mode === 'carousel') initCarousel(root, works, opts);
  else initGrid(root, works, opts);
}

const Collection = { init };
window.Collection = Collection;
export default Collection;
