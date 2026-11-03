/* motion.js: entrance and scroll motion for the home page.
   Works on the DOM after the page template renders; every effect is skipped when the
   visitor prefers reduced motion (html.motion is not set in that case). */
(function () {
  var root = document.documentElement;
  var RM = !root.classList.contains('motion');
  var desktopPin = window.matchMedia('(min-width: 1081px) and (min-height: 700px)');

  function rendered() {
    var c = document.querySelector('[data-r="case"] h3');
    var q = document.querySelector('[data-r="quote"] p');
    return c && q && c.textContent.indexOf('{{') === -1 && q.textContent.indexOf('{{') === -1;
  }

  function onScrollFrame(fn) {
    var tick = false;
    function run() { tick = false; fn(); }
    function req() { if (!tick) { tick = true; requestAnimationFrame(run); } }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req, { passive: true });
    req();
    return req;
  }

  /* ── 3 · masked headlines ─────────────────────────────────────────────── */
  function headlines() {
    var hs = [].slice.call(document.querySelectorAll('.mh'));
    hs.forEach(function (h) {
      [].slice.call(h.querySelectorAll('.mw > span')).forEach(function (w, i) { w.style.setProperty('--i', i); });
    });
    if (RM || !('IntersectionObserver' in window)) { hs.forEach(function (h) { h.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    hs.forEach(function (h) { io.observe(h); });
  }

  /* ── 9 · nav over the dark hero ───────────────────────────────────────── */
  function nav() {
    var n = document.querySelector('nav'), top = document.getElementById('top');
    if (!n || !top) return;
    onScrollFrame(function () {
      var links = n.querySelector('[data-r="nav-links"]');
      var open = links && links.getAttribute('data-open') === 'true';
      var over = !open && top.getBoundingClientRect().bottom > 64 + 24;
      n.classList.toggle('nav-over', over);
    });
  }

  /* ── 4 · soft-to-sharp images ─────────────────────────────────────────── */
  function images() {
    var groups = [
      [].slice.call(document.querySelectorAll('[data-r="case"] > div:last-child')),
      [].slice.call(document.querySelectorAll('[data-r="edu3"] figure')),
      [].slice.call(document.querySelectorAll('#me figure > div'))
    ];
    var all = [];
    groups.forEach(function (g) { g.forEach(function (el, i) { el.classList.add('fx'); el.style.setProperty('--i', g === groups[0] ? 0 : i); all.push(el); }); });
    if (RM || !('IntersectionObserver' in window)) { all.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.18 });
    all.forEach(function (el) { io.observe(el); });
  }

  /* ── 2 · How I work, pinned ───────────────────────────────────────────── */
  function pinnedProcess() {
    var pin = document.querySelector('[data-r="process-pin"]');
    var tabs = pin && [].slice.call(pin.querySelectorAll('[data-r="process-tabs"] button'));
    var content = pin && pin.querySelector('[data-r="process-content"]');
    var tabsBox = pin && pin.querySelector('[data-r="process-tabs"]');
    if (!pin || !tabs.length || RM) return;
    var label = pin.querySelector('[data-r="process"] > div > span');
    var cur = -1, enabled = false;

    function setEnabled(on) {
      enabled = on; root.classList.toggle('pin-on', on);
      if (label) label.textContent = '0' + tabs.length + (on ? ' steps · scroll to explore' : ' steps · click to explore');
    }
    function progress() {
      var r = pin.getBoundingClientRect(), run = pin.offsetHeight - window.innerHeight;
      return Math.max(0, Math.min(1, -r.top / Math.max(1, run)));
    }
    function update() {
      var want = desktopPin.matches;
      if (want !== enabled) setEnabled(want);
      if (!enabled) return;
      var p = progress();
      tabsBox.style.setProperty('--pp', (p * 100).toFixed(1) + '%');
      var i = Math.min(tabs.length - 1, Math.floor(p * tabs.length * 0.999));
      if (i !== cur) {
        cur = i;
        if (content) { content.classList.add('swap'); requestAnimationFrame(function () { requestAnimationFrame(function () { content.classList.remove('swap'); }); }); }
        tabs[i].click();
      }
    }
    /* clicking a step scrolls to that step's place in the pinned run */
    tabs.forEach(function (b, i) {
      b.addEventListener('click', function (ev) {
        if (!enabled || !ev.isTrusted) return;
        var run = pin.offsetHeight - window.innerHeight;
        var y = pin.getBoundingClientRect().top + window.pageYOffset + run * ((i + 0.5) / tabs.length);
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
    onScrollFrame(update);
  }

  /* ── 7 · testimonials track ───────────────────────────────────────────── */
  function quotes() {
    var track = document.querySelector('[data-r="quotes"]');
    if (!track) return;
    var cards = [].slice.call(track.querySelectorAll('[data-r="quote"]'));
    var bg = [].slice.call(document.querySelectorAll('[data-r="quotes-bg"] > span'));
    var count = document.querySelector('[data-r="quotes-count"]');
    var prev = document.querySelector('[data-r="quotes-nav"] [data-dir="-1"]');
    var next = document.querySelector('[data-r="quotes-nav"] [data-dir="1"]');
    var cur = -1;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function update() {
      var left = track.getBoundingClientRect().left, best = 0, d = 1e9;
      cards.forEach(function (c, i) { var x = Math.abs(c.getBoundingClientRect().left - left); if (x < d) { d = x; best = i; } });
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (atEnd) best = cards.length - 1;
      if (best === cur) return;
      cur = best;
      cards.forEach(function (c, i) { c.classList.toggle('cur', i === best); });
      bg.forEach(function (b, i) { b.classList.toggle('on', i === best); });
      if (count) count.textContent = pad(best + 1) + ' / ' + pad(cards.length);
      if (prev) prev.disabled = best === 0;
      if (next) next.disabled = best === cards.length - 1;
    }
    function go(dir) {
      var i = Math.max(0, Math.min(cards.length - 1, cur + dir));
      track.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: RM ? 'auto' : 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    var tick = false;
    track.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; update(); }); } }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    track.classList.add('ready');
    update();
  }

  function init() {
    window.__motionReady = true;
    headlines(); nav(); images(); pinnedProcess(); quotes();
  }

  var tries = 0;
  (function wait() {
    if (rendered()) return init();
    if (tries++ < 200) setTimeout(wait, 50);
    else root.classList.remove('motion');
  })();
})();
