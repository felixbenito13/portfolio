/* tab-title.js: a small nudge when the visitor switches tabs.
   While the tab is hidden its title reads "Coffee first, design next ☕︎"; when the visitor
   comes back, the page's own title returns. Only the live title changes: the <title> tag in
   the HTML stays as it is for search engines, link previews and browser history. */
(function () {
  var AWAY = 'Coffee first, design next ☕︎'; /* hot beverage + text presentation selector */
  var original = document.title;                        /* each page keeps its own title */

  function update() {
    if (document.hidden) {
      if (document.title !== AWAY) original = document.title; /* keeps up if a page renames itself */
      document.title = AWAY;
    } else if (document.title === AWAY) {
      document.title = original;
    }
  }

  document.addEventListener('visibilitychange', update);
  /* back/forward cache: a restored page must not keep the away title */
  window.addEventListener('pageshow', function () { if (!document.hidden && document.title === AWAY) document.title = original; });
  if (document.hidden) update(); /* page opened in a background tab */
})();
