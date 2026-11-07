/* latest-note.js: keeps the hero link pointing to the newest Design Notes post.
   The HTML ships with a static link (readable without JavaScript and by search engines);
   this script reads the post order from the Design Notes data and swaps in the newest one. */
(function () {
  var latest = null;

  function apply() {
    var a = document.querySelector('[data-r="latest-note"] a');
    if (!a) return false;
    if (latest) {
      var href = 'design-notes/' + latest.slug + '.html';
      if (a.getAttribute('href') !== href) a.setAttribute('href', href);
      if (a.textContent !== latest.title) a.textContent = latest.title;
    }
    if (!a.__tracked) {
      a.__tracked = true;
      a.addEventListener('click', function () {
        try { if (window.gtag) window.gtag('event', 'hero_latest_note', { note: (a.getAttribute('href') || '').replace(/^.*\/|\.html$/g, '') }); } catch (e) {}
      });
    }
    return true;
  }

  function unescape(s) { return s.replace(/\\(['"\\])/g, '$1'); }

  fetch('design-notes/design-notes-data.jsx', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.text() : ''; })
    .then(function (src) {
      var order = src.match(/const NOTE_ORDER\s*=\s*\[\s*'([^']+)'/);
      if (!order) return;
      var slug = order[1];
      var block = src.indexOf("slug: '" + slug + "'");
      if (block === -1) return;
      var t = src.slice(block).match(/title:\s*'((?:[^'\\]|\\.)*)'/);
      if (!t) return;
      latest = { slug: slug, title: unescape(t[1]) };
      apply();
    })
    .catch(function () {});

  /* the home template renders after this script and can render twice: re-apply for a while */
  function start() {
    apply();
    var mo = new MutationObserver(apply);
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { mo.disconnect(); }, 60000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
