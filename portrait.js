/* portrait.js: the hero portrait reacts to the visitor.
   Desktop (mouse): looks at the text when the cursor is on it, smiles on the buttons,
   closes his eyes after 5 s of stillness or when the cursor leaves the window.
   Touch: one slow sequence on load, repeated once per tap on the photo.
   Reduced motion: main expression only. Timers pause when the hero is off screen
   or the tab is hidden. */
(function () {
  var RM = false;
  try { RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (RM) return;
  var FINE = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var DWELL = 150, IDLE = 5000, STEP = 1500, FADE = 400;

  var box, faces = {}, current = 'main', heroVisible = true, ready = false;

  var io = null;
  /* the template can re-render the hero: pick up the new nodes if that happens */
  function sync() {
    if (box && box.isConnected) return;
    box = document.querySelector('[data-r="hero-photo"].portrait');
    faces = {};
    if (!box) return;
    [].slice.call(box.querySelectorAll('.pf')).forEach(function (p) { faces[p.getAttribute('data-face')] = p; });
    var on = box.querySelector('.pf.is-on');
    current = on ? on.getAttribute('data-face') : 'main';
    if (io) io.observe(box);
  }

  function img(face) { sync(); return faces[face] && faces[face].querySelector('img'); }

  function decoded(face) {
    var i = img(face);
    if (!i) return Promise.resolve();
    if (i.complete && i.naturalWidth) return i.decode ? i.decode().catch(function () {}) : Promise.resolve();
    return new Promise(function (res) { i.addEventListener('load', res, { once: true }); i.addEventListener('error', res, { once: true }); })
      .then(function () { return i.decode ? i.decode().catch(function () {}) : null; });
  }

  var swapToken = 0;
  function show(face) {
    sync();
    if (!faces[face] || face === current) return;
    var token = ++swapToken;
    decoded(face).then(function () {
      if (token !== swapToken) return;            /* a newer request won */
      var prev = faces[current], next = faces[face];
      Object.keys(faces).forEach(function (k) { if (faces[k] !== prev && faces[k] !== next) faces[k].classList.remove('is-on', 'is-prev'); });
      prev.classList.remove('is-on'); prev.classList.add('is-prev');
      next.classList.remove('is-prev'); next.classList.add('is-on');
      current = face;
      setTimeout(function () { if (token === swapToken) prev.classList.remove('is-prev'); }, FADE + 50);
    });
  }

  /* preload the extra faces once the page has finished loading */
  function preload() {
    ['smile', 'side', 'closed'].forEach(function (f) {
      var i = img(f); if (!i) return;
      i.loading = 'eager';
      var pre = new Image();
      pre.src = i.currentSrc || i.src;
      decoded(f);
    });
  }

  /* ── desktop ─────────────────────────────────────────────────────────── */
  var dwellTimer = null, idleTimer = null, pendingZone = null, lastZone = 'main', outside = false;

  function zoneOf(target) {
    if (!target || !target.closest) return 'main';
    if (target.closest('[data-r="hero-cta"] a')) return 'smile';
    if (target.closest('[data-r="hero-photo"]')) return 'main';
    if (target.closest('[data-r="hero"] > div:last-child')) return 'side';
    return 'main';
  }

  function clearTimers() { clearTimeout(dwellTimer); clearTimeout(idleTimer); dwellTimer = idleTimer = null; pendingZone = null; }

  function armIdle() {
    clearTimeout(idleTimer);
    if (!heroVisible || document.hidden) return;
    idleTimer = setTimeout(function () { if (heroVisible && !document.hidden) show('closed'); }, IDLE);
  }

  function onMove(e) {
    if (!ready) return;
    outside = false;
    var zone = zoneOf(e.target);
    armIdle();
    if (current === 'closed') { lastZone = zone; pendingZone = null; clearTimeout(dwellTimer); show(zone); return; }
    if (zone === lastZone && current === zone) { clearTimeout(dwellTimer); pendingZone = null; return; }
    if (zone === pendingZone) return;
    pendingZone = zone;
    clearTimeout(dwellTimer);
    dwellTimer = setTimeout(function () { lastZone = zone; pendingZone = null; if (heroVisible) show(zone); }, DWELL);
  }

  function onLeaveWindow(e) {
    if (e.relatedTarget || e.toElement) return;
    outside = true;
    clearTimeout(dwellTimer); pendingZone = null;
    if (heroVisible && !document.hidden) show('closed');
  }

  /* ── touch ───────────────────────────────────────────────────────────── */
  var SEQ = ['main', 'smile', 'side', 'closed', 'main'], seqIndex = -1, seqTimer = null;

  function seqTick() {
    seqTimer = null;
    if (seqIndex < 0) return;
    if (!heroVisible || document.hidden) return;   /* resumes from here when visible again */
    show(SEQ[seqIndex]);
    seqIndex++;
    if (seqIndex >= SEQ.length) { seqIndex = -1; return; }
    seqTimer = setTimeout(seqTick, STEP);
  }
  function playSequence() {
    if (seqIndex >= 0) return;                      /* already running */
    seqIndex = 0;
    clearTimeout(seqTimer);
    seqTimer = setTimeout(seqTick, 0);
  }
  function resumeSequence() { if (seqIndex >= 0 && !seqTimer) seqTimer = setTimeout(seqTick, STEP); }
  function pauseSequence() { clearTimeout(seqTimer); seqTimer = null; }

  /* ── visibility ──────────────────────────────────────────────────────── */
  function onHeroVisibility(visible) {
    heroVisible = visible;
    if (FINE) {
      if (!visible) { clearTimers(); show('main'); lastZone = 'main'; }
      else if (outside) show('closed');
      else armIdle();
    } else {
      if (visible) resumeSequence(); else pauseSequence();
    }
  }

  function start() {
    if (ready) return true;
    box = null; sync();
    if (!box || !faces.main || !faces.smile || !faces.side || !faces.closed) return false;
    ready = true;

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.target === box) onHeroVisibility(en.isIntersecting); }); }, { threshold: 0.25 });
      io.observe(box);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { if (FINE) clearTimers(); else pauseSequence(); }
      else if (FINE) armIdle(); else resumeSequence();
    });

    var go = function () {
      preload();
      if (FINE) {
        document.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('mouseout', onLeaveWindow);
        armIdle();
      } else {
        Promise.all(['smile', 'side', 'closed'].map(decoded)).then(playSequence);
        document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-r="hero-photo"]')) playSequence(); });
      }
    };
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true });
    return true;
  }

  /* the home template renders after this script: wait for the portrait to exist */
  if (!start()) {
    var mo = new MutationObserver(function () { if (start()) mo.disconnect(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { mo.disconnect(); }, 30000);
  }
})();
