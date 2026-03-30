/**
 * Collection module — grid or carousel display of works
 *
 * Usage:
 *   Collection.init(containerEl, works, options)
 *
 * works: array of { id, photo, title, material, dimensions, price, invoiced, reserved }
 *
 * options:
 *   mode        'grid' | 'carousel'   default: 'grid'
 *   gap         number (px)           default: 4
 *   peek        number (px)           carousel: how much of prev/next to show. default: 0
 *   loop        boolean               carousel: wrap around. default: false
 *   minWidth    number (px)           grid: min column width. default: 260
 *   height      string                carousel: CSS height of the track e.g. '70vh' or '500px'. default: '70vh'
 *   aspectRatio string                grid: item aspect ratio e.g. '1' or '4/5'. default: '1'
 *   previewBase string                base URL for preview page. default: 'preview.html'
 *   wall        boolean               carousel: unified wall bg, transparent items, bg-removed images. default: false
 *   wallColor   string                carousel: wall background color. default: '#ece9e4'
 *
 * If window.gsap is present, carousel uses GSAP for fluid animation + drag momentum.
 */
(function (global) {
  'use strict';

  var CDN = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
    ? 'media/works/hi/'
    : 'https://dimzayan.nyc3.digitaloceanspaces.com/works/hi/';
  var STYLES_ID = 'coll-styles';

  /* ── Styles ─────────────────────────────────────────────────────── */
  var CSS = [
    '.coll-root { position: relative; }',

    /* Grid */
    '.coll-grid {',
    '  display: grid;',
    '  grid-template-columns: repeat(auto-fill, minmax(var(--coll-min, 260px), 1fr));',
    '  gap: var(--coll-gap, 4px);',
    '}',
    '.coll-grid-item { overflow: hidden; }',

    /* Shared cell */
    '.coll-cell {',
    '  display: block; overflow: hidden; position: relative;',
    '  background: #ece9e4; text-decoration: none; cursor: pointer;',
    '  width: 100%; height: 100%;',
    '}',
    '.coll-cell img {',
    '  width: 100%; height: 100%; object-fit: cover; display: block;',
    '  transition: transform 0.65s ease;',
    '}',
    '.coll-cell:hover img { transform: scale(1.02); }',
    '.coll-cell-title {',
    '  position: absolute; bottom: 0; left: 0; right: 0;',
    '  padding: 3rem 1.1rem 0.85rem;',
    '  background: linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 100%);',
    '  font-family: "DM Sans", sans-serif; font-size: 0.68rem; font-weight: 200;',
    '  letter-spacing: 0.1em; color: rgba(255,255,255,0.88);',
    '  opacity: 0; transition: opacity 0.32s ease; pointer-events: none;',
    '}',
    '.coll-cell:hover .coll-cell-title { opacity: 1; }',

    /* Carousel */
    '.coll-carousel-clip {',
    '  overflow: hidden; position: relative; width: 100%;',
    '}',
    '.coll-track {',
    '  display: flex;',
    '  transition: transform 0.52s cubic-bezier(0.25, 0.46, 0.45, 0.94);',
    '  will-change: transform;',
    '}',
    '.coll-track.gsap-driven { transition: none; }',
    '.coll-car-item { flex: 0 0 auto; }',

    /* Wall mode image shadow — drop-shadow follows alpha so it hugs artwork outline */
    '.coll-wall-img {',
    '  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.13)) drop-shadow(0 1px 3px rgba(0,0,0,0.08));',
    '  transition: filter 0.4s ease;',
    '}',

    /* Arrows */
    '.coll-arrow {',
    '  position: absolute; top: 50%; transform: translateY(-50%);',
    '  z-index: 20; background: none; border: none; padding: 1.2rem;',
    '  cursor: pointer; opacity: 0.3; user-select: none; transition: opacity 0.2s;',
    '  display: flex; align-items: center; justify-content: center;',
    '}',
    '.coll-arrow::before {',
    '  content: ""; display: block;',
    '  width: 11px; height: 11px;',
    '  border-top: 1.5px solid #111; border-right: 1.5px solid #111;',
    '}',
    '.coll-arrow.coll-prev { left: 0; }',
    '.coll-arrow.coll-prev::before { transform: rotate(-135deg) translate(-2px, 2px); }',
    '.coll-arrow.coll-next { right: 0; }',
    '.coll-arrow.coll-next::before { transform: rotate(45deg) translate(-2px, 2px); }',
    '.coll-arrow:hover { opacity: 1; }',
    '.coll-arrow[disabled] { opacity: 0.07; pointer-events: none; }',
  ].join('\n');

  function injectStyles() {
    if (document.getElementById(STYLES_ID)) return;
    var s = document.createElement('style');
    s.id = STYLES_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ── Cell builder ───────────────────────────────────────────────── */
  function makeCell(work, previewBase, wall) {
    var a = document.createElement('a');
    a.className = 'coll-cell';
    if (wall) a.style.background = 'transparent';
    a.href = (previewBase || 'preview.html') + '?id=' + encodeURIComponent(work.id);
    a.target = '_blank';
    a.rel = 'noopener';

    var img = document.createElement('img');
    var photo = work.photo || work.id;
    img.src = CDN + (wall ? '__' + photo : photo) + '.webp';
    img.alt = work.title || '';
    img.loading = 'lazy';
    if (wall) img.className = 'coll-wall-img';

    var title = document.createElement('div');
    title.className = 'coll-cell-title';
    title.textContent = work.title || '';

    a.appendChild(img);
    a.appendChild(title);
    return a;
  }

  /* ── Grid ───────────────────────────────────────────────────────── */
  function initGrid(root, works, opts) {
    var grid = document.createElement('div');
    grid.className = 'coll-grid';
    grid.style.setProperty('--coll-gap', (opts.gap != null ? opts.gap : 4) + 'px');
    if (opts.minWidth) grid.style.setProperty('--coll-min', opts.minWidth + 'px');

    works.forEach(function (w) {
      var item = document.createElement('div');
      item.className = 'coll-grid-item';
      item.style.aspectRatio = opts.aspectRatio || '1';
      item.appendChild(makeCell(w, opts.previewBase));
      grid.appendChild(item);
    });

    root.appendChild(grid);
  }

  /* ── Carousel ───────────────────────────────────────────────────── */
  function initCarousel(root, works, opts) {
    var peek   = opts.peek  != null ? opts.peek  : 0;
    var gap    = opts.gap   != null ? opts.gap   : 4;
    var loop   = !!opts.loop;
    var height = opts.height || '70vh';
    var wall   = !!opts.wall;
    var n      = works.length;
    var current = 0;
    var useGsap = typeof global.gsap !== 'undefined';

    /* Clip container */
    var clip = document.createElement('div');
    clip.className = 'coll-carousel-clip';
    clip.style.height = height;
    if (wall) clip.style.background = opts.wallColor || '#ece9e4';

    /* Track */
    var track = document.createElement('div');
    track.className = 'coll-track';
    if (useGsap) track.classList.add('gsap-driven');
    track.style.gap = gap + 'px';

    works.forEach(function (w) {
      var item = document.createElement('div');
      item.className = 'coll-car-item';
      if (wall) item.style.background = 'transparent';
      item.appendChild(makeCell(w, opts.previewBase, wall));
      track.appendChild(item);
    });

    clip.appendChild(track);
    root.appendChild(clip);

    /* Arrows */
    var prevBtn = document.createElement('button');
    prevBtn.className = 'coll-arrow coll-prev';
    prevBtn.setAttribute('aria-label', 'Previous');

    var nextBtn = document.createElement('button');
    nextBtn.className = 'coll-arrow coll-next';
    nextBtn.setAttribute('aria-label', 'Next');

    root.appendChild(prevBtn);
    root.appendChild(nextBtn);

    /* ── Layout calculation ─────────────────────────────────────── */
    function getItemWidth() {
      var W = clip.offsetWidth;
      if (peek > 0) return Math.max(W - 2 * peek - 2 * gap, 80);
      return W;
    }

    function getOffset(idx) {
      var iw = getItemWidth();
      if (peek > 0) return (peek + gap) - idx * (iw + gap);
      return -idx * (iw + gap);
    }

    function applyLayout() {
      var iw = getItemWidth();
      var ih = clip.offsetHeight;
      track.querySelectorAll('.coll-car-item').forEach(function (item) {
        item.style.width  = iw + 'px';
        item.style.height = ih + 'px';
        var cell = item.querySelector('.coll-cell');
        if (cell) {
          cell.style.width  = iw + 'px';
          cell.style.height = ih + 'px';
          var img = cell.querySelector('img');
          if (img) img.style.objectFit = 'contain';
        }
      });
    }

    /* ── Animation ──────────────────────────────────────────────── */
    function moveTo(x, animate) {
      if (useGsap) {
        if (animate === false) {
          global.gsap.set(track, { x: x });
        } else {
          global.gsap.to(track, { x: x, duration: 0.72, ease: 'power3.out', overwrite: true });
        }
      } else {
        if (animate === false) {
          track.style.transition = 'none';
          track.style.transform = 'translateX(' + x + 'px)';
        } else {
          track.style.transition = '';
          track.style.transform = 'translateX(' + x + 'px)';
        }
      }
    }

    function goTo(idx, animate) {
      if (!loop) {
        idx = Math.max(0, Math.min(idx, n - 1));
      } else {
        idx = ((idx % n) + n) % n;
      }
      current = idx;
      moveTo(getOffset(current), animate);

      if (!loop) {
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === n - 1;
      } else {
        prevBtn.disabled = false;
        nextBtn.disabled = false;
      }
    }

    /* Initial layout */
    setTimeout(function () {
      applyLayout();
      goTo(0, false);
      if (!useGsap) {
        requestAnimationFrame(function () { track.style.transition = ''; });
      }
    }, 0);

    /* Resize */
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        applyLayout();
        goTo(current, false);
      }, 80);
    });

    /* Arrow clicks */
    prevBtn.addEventListener('click', function () { goTo(current - 1); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); });

    /* Keyboard */
    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { goTo(current - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); e.preventDefault(); }
    });

    /* ── Drag / swipe ───────────────────────────────────────────── */
    var dragStartX   = null;
    var dragStartT   = null;
    var dragLastX    = null;
    var dragVel      = 0;
    var dragging     = false;
    var trackBaseX   = 0; /* translateX at drag start */

    function getCurrentX() {
      if (useGsap) {
        return global.gsap.getProperty(track, 'x');
      }
      var m = new WebKitCSSMatrix(window.getComputedStyle(track).transform);
      return m.m41;
    }

    function onDragStart(clientX) {
      dragStartX  = clientX;
      dragLastX   = clientX;
      dragStartT  = Date.now();
      dragVel     = 0;
      dragging    = false;
      trackBaseX  = getCurrentX();
      if (useGsap) global.gsap.killTweensOf(track);
    }

    function onDragMove(clientX) {
      if (dragStartX === null) return;
      var dx = clientX - dragStartX;
      if (Math.abs(dx) > 4) dragging = true;
      if (!dragging) return;

      /* Velocity (px/ms) — exponential smoothing */
      var now = Date.now();
      var dt  = Math.max(now - dragStartT, 1);
      dragVel = (clientX - dragLastX) / Math.max(Date.now() - dragStartT, 1) * 0.4 + dragVel * 0.6;
      dragLastX  = clientX;
      dragStartT = now;

      var x = trackBaseX + dx;
      if (useGsap) {
        global.gsap.set(track, { x: x });
      } else {
        track.style.transition = 'none';
        track.style.transform  = 'translateX(' + x + 'px)';
      }
    }

    function onDragEnd(clientX) {
      if (dragStartX === null) return;
      var totalDx = clientX - dragStartX;
      dragStartX = null;

      if (!dragging) return;

      /* Momentum: project where we'd end up, snap to nearest item */
      var projectedX = getCurrentX() + dragVel * 180;
      var iw = getItemWidth();
      var step = iw + gap;

      /* Invert offset formula to find fractional index */
      var origin = peek > 0 ? peek + gap : 0;
      var fracIdx = (origin - projectedX) / step;
      var snapIdx = Math.round(fracIdx);

      goTo(snapIdx);
    }

    /* Mouse */
    clip.addEventListener('mousedown', function (e) { onDragStart(e.clientX); });
    window.addEventListener('mousemove', function (e) { if (dragStartX !== null) onDragMove(e.clientX); });
    window.addEventListener('mouseup',   function (e) { onDragEnd(e.clientX); });

    /* Touch */
    clip.addEventListener('touchstart', function (e) {
      onDragStart(e.touches[0].clientX);
    }, { passive: true });
    clip.addEventListener('touchmove', function (e) {
      onDragMove(e.touches[0].clientX);
    }, { passive: true });
    clip.addEventListener('touchend', function (e) {
      onDragEnd(e.changedTouches[0].clientX);
    }, { passive: true });

    /* Block link clicks on drag */
    clip.addEventListener('click', function (e) {
      if (dragging) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  }

  /* ── Public API ─────────────────────────────────────────────────── */
  function init(container, works, opts) {
    injectStyles();
    opts  = opts  || {};
    works = works || [];

    var root = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    if (!root || !works.length) return;

    root.classList.add('coll-root');

    if (opts.mode === 'carousel') {
      initCarousel(root, works, opts);
    } else {
      initGrid(root, works, opts);
    }
  }

  global.Collection = { init: init };

}(window));
