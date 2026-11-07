/* a11y.js: shared accessibility helpers.
   1. Back-to-top button (every page).
   2. Pause / play control for the home case videos (WCAG 2.2.2 Pause, Stop, Hide). */
(function () {
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }

  /* ── 1 · back to top ─────────────────────────────────────────────────── */
  function backToTop() {
    if (document.querySelector('.to-top')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'to-top';
    b.setAttribute('aria-label', 'Back to top');
    b.title = 'Back to top';
    b.tabIndex = -1;
    b.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><path d="M10 16V4M4.5 9.5 10 4l5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.appendChild(b);

    var shown = false, tick = false;
    function update() {
      tick = false;
      var on = (window.pageYOffset || document.documentElement.scrollTop) > window.innerHeight * 1.5;
      if (on === shown) return;
      shown = on;
      b.classList.toggle('show', on);
      b.tabIndex = on ? 0 : -1;
      b.setAttribute('aria-hidden', on ? 'false' : 'true');
    }
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
    update();

    b.addEventListener('click', function () {
      track('back_to_top');
      window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
      /* move keyboard focus to the start of the content, not just the view */
      var main = document.getElementById('main');
      if (main) {
        if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
        setTimeout(function () { main.focus({ preventScroll: true }); }, RM ? 0 : 450);
      }
    });
  }

  /* ── 2 · home videos: one control pauses or plays them all ───────────── */
  function videoControl() {
    /* only the home page (a dc template) has case videos; it renders after this script */
    if (!document.getElementById('work') && !document.querySelector('x-dc, [data-dc-tpl]')) return true;
    var list = document.querySelector('#work [data-r="case"]');
    var h = list && list.querySelector('h3');
    if (!list || !h || h.textContent.indexOf('{{') !== -1) return false; /* template not rendered yet */
    if (document.querySelector('.vid-toggle')) return true;
    var videos = [].slice.call(document.querySelectorAll('#work video'));
    if (!videos.length) return false;
    var grid = list.parentElement;
    var row = document.createElement('div');
    row.className = 'vid-toggle-row';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vid-toggle';
    row.appendChild(btn);
    grid.parentElement.insertBefore(row, grid);

    var PAUSE = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><rect x="2" y="1.5" width="2.6" height="9" fill="currentColor"/><rect x="7.4" y="1.5" width="2.6" height="9" fill="currentColor"/></svg>Pause videos';
    var PLAY = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor"/></svg>Play videos';
    function render() {
      var paused = !!window.__videosPaused;
      btn.innerHTML = paused ? PLAY : PAUSE;
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    }
    btn.addEventListener('click', function () {
      window.__videosPaused = !window.__videosPaused;
      track(window.__videosPaused ? 'videos_paused' : 'videos_played');
      videos.forEach(function (v) {
        if (window.__videosPaused) { v.pause(); }
        else {
          var r = v.getBoundingClientRect();
          if (r.bottom > 0 && r.top < window.innerHeight) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        }
      });
      render();
    });
    render();
    return true;
  }

  function init() {
    backToTop();
    var tries = 0;
    (function wait() { if (videoControl() || tries++ > 120) return; setTimeout(wait, 100); })();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
