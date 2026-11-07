/* loading.js: a friendly message for slow connections on the case and Design Notes pages.
   It only appears if the page content is not on screen after 1 second, and leaves as soon
   as it is. Fast connections never see it. */
(function () {
  var DELAY = 1000, MAX = 20000;
  var LINES = ['Kerning the headlines', 'Removing Comic Sans', 'Aligning everything to the grid', 'Asking the cat to get off the keyboard', 'Checking the contrast twice'];
  var RM = false;
  try { RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var overlay = null, timer = null, done = false;

  function ready() {
    var h = document.querySelector('#root h1');
    return !!(h && h.textContent.trim());
  }

  function pageName() {
    var og = document.querySelector('meta[property="og:title"]');
    if (/\/design-notes\/(?!index\.html)[^/]+\.html$/.test(location.pathname) && og && og.content) return og.content;
    return (document.title || '').split(' · ')[0] || 'this page';
  }

  function css() {
    var s = document.createElement('style');
    s.textContent =
      '#page-loading{position:fixed;inset:0;z-index:9998;background:#FFFFFF;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 28px;opacity:1;transition:opacity .35s ease}' +
      '#page-loading.out{opacity:0}' +
      '#page-loading .pl-bar{position:absolute;top:0;left:0;height:3px;width:0;background:#8B1A1F;transition:width 8s cubic-bezier(.1,.6,.2,1)}' +
      '#page-loading.go .pl-bar{width:90%}#page-loading.out .pl-bar{width:100%;transition-duration:.25s}' +
      "#page-loading .pl-msg{margin:0;font-family:'Bricolage Grotesque','Inter Tight',system-ui,sans-serif;font-weight:700;font-size:clamp(26px,3.4vw,44px);line-height:1.14;color:#8B1A1F;max-width:780px}" +
      '#page-loading .pl-msg span{color:#0E0E0E}' +
      "#page-loading .pl-tick{margin:22px 0 0;display:flex;gap:10px;align-items:center;justify-content:center;font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#6B6A66;min-height:1.4em}" +
      '#page-loading .pl-tick i{width:6px;height:6px;border-radius:50%;background:#8B1A1F;flex:none}' +
      '#page-loading .pl-tick b{font-weight:500;transition:opacity .25s ease}' +
      '@media (prefers-reduced-motion: reduce){#page-loading,#page-loading .pl-bar,#page-loading .pl-tick b{transition:none}}';
    document.head.appendChild(s);
  }

  function show() {
    if (done || overlay || ready()) return;
    css();
    overlay = document.createElement('div');
    overlay.id = 'page-loading';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    var msg = document.createElement('p');
    msg.className = 'pl-msg';
    msg.appendChild(document.createTextNode('Optimizing '));
    var name = document.createElement('span');
    name.textContent = pageName();
    msg.appendChild(name);
    msg.appendChild(document.createTextNode(' to give you the best presentation…'));
    var tick = document.createElement('p');
    tick.className = 'pl-tick';
    tick.setAttribute('aria-hidden', 'true');
    tick.innerHTML = '<i></i><b></b>';
    var bar = document.createElement('div');
    bar.className = 'pl-bar';
    overlay.appendChild(bar); overlay.appendChild(msg); overlay.appendChild(tick);
    document.body.appendChild(overlay);
    var line = tick.querySelector('b'), n = 0;
    line.textContent = LINES[0];
    if (!RM) {
      timer = setInterval(function () {
        n = (n + 1) % LINES.length;
        line.style.opacity = 0;
        setTimeout(function () { line.textContent = LINES[n]; line.style.opacity = 1; }, 250);
      }, 1200);
      requestAnimationFrame(function () { requestAnimationFrame(function () { overlay && overlay.classList.add('go'); }); });
    } else {
      bar.style.width = '90%';
    }
  }

  function finish() {
    if (done) return;
    done = true;
    if (mo) mo.disconnect();
    if (timer) clearInterval(timer);
    if (!overlay) return;
    var o = overlay;
    o.classList.add('out');
    setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); }, RM ? 0 : 400);
  }

  var mo = null;
  function watch() {
    if (ready()) return finish();
    mo = new MutationObserver(function () { if (ready()) finish(); });
    mo.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  }

  setTimeout(show, DELAY);
  setTimeout(finish, MAX);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch);
  else watch();
})();
