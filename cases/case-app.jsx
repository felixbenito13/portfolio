/* cases/case-app.jsx, renders a single case study based on window.CURRENT_CASE_SLUG */

const ACCENT_OPTIONS = ['#8B1A1F', '#5A0F12', '#C8252B', '#A8243F'];
const DENSITY_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'regular', label: 'Regular' },
  { value: 'comfy',   label: 'Comfy' },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#8B1A1F",
  "dark": false,
  "density": "regular"
}/*EDITMODE-END*/;

// ─── Motion helpers ────────────────────────────────────────────────────────
const MOTION_OK = (() => { try { return !window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
if (MOTION_OK) document.documentElement.classList.add('motion');

/* words that rise out of their own mask, like the home headlines */
function SplitWords({ text }) {
  const words = String(text).split(/\s+/).filter(Boolean);
  return words.map((w, i) => (
    <React.Fragment key={i}>
      <span className="mw"><span style={{ '--i': i }}>{w}</span></span>{i < words.length - 1 ? ' ' : ''}
    </React.Fragment>
  ));
}

/* image entrances: a short rise for most images, a centre-out reveal for the few highlights
   (data-highlight, hero gallery, cover). Galleries enter as one block. Headlines rise when visible. */
const ENTER_SEL = '.case-image-frame, .case-hero-gallery-cell, .case-cover, .cg';
function useCaseMotion() {
  React.useEffect(() => {
    if (!MOTION_OK || !('IntersectionObserver' in window)) {
      document.querySelectorAll(ENTER_SEL + ', .mh').forEach((el) => el.classList.add('in'));
      return;
    }
    /* when the reader is flying past, skip the movement and just fade in */
    let lastY = window.pageYOffset, lastT = performance.now(), speed = 0;
    const onScroll = () => {
      const y = window.pageYOffset, t = performance.now(), dt = t - lastT;
      speed = (Math.abs(y - lastY) / Math.max(dt, 16)) * 1000;
      lastY = y; lastT = t;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const show = (el) => {
      const idle = performance.now() - lastT > 150;
      /* px per second above which the effect could not finish before the image reaches mid screen */
      const limit = el.classList.contains('clip-hero') ? 900 : 1800;
      if (!idle && speed > limit && !el.classList.contains('clip-quick')) el.classList.add(speed > 2500 ? 'instant' : 'fast');
      el.classList.add('in');
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && (e.intersectionRatio >= 0.05 || e.intersectionRect.height >= 60)) { show(e.target); io.unobserve(e.target); }
        /* skipped past in one jump: show it so it is never blank on the way back up */
        else if (!e.isIntersecting && e.boundingClientRect.bottom < 0) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: [0, 0.05], rootMargin: '0px 0px -8% 0px' });
    const ioHead = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { show(e.target); ioHead.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
    let first = true;
    const bind = () => {
      document.querySelectorAll('.mh:not(.bound)').forEach((el) => { el.classList.add('bound'); ioHead.observe(el); });
      document.querySelectorAll(ENTER_SEL).forEach((el) => {
        if (el.hasAttribute('data-enter')) return;
        if (el.classList.contains('case-image-frame') && el.closest('.cg')) { el.setAttribute('data-enter', 'gallery'); return; }
        const r = el.getBoundingClientRect();
        if (first && r.top < window.innerHeight && r.bottom > 0) {
          /* already on screen at load: a 200 ms fade at most */
          el.setAttribute('data-enter', 'quick');
          el.classList.add('clip-quick');
          requestAnimationFrame(() => requestAnimationFrame(() => show(el)));
          return;
        }
        const hero = el.hasAttribute('data-highlight') || el.classList.contains('case-hero-gallery-cell') || el.classList.contains('case-cover');
        el.setAttribute('data-enter', hero ? 'hero' : 'rise');
        el.classList.add(hero ? 'clip-hero' : 'clip');
        io.observe(el);
      });
      first = false;
    };
    bind();
    const t = setTimeout(bind, 800);
    return () => { clearTimeout(t); io.disconnect(); ioHead.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);
}

/* slim bar under the nav: which case and which section you are reading */
function CaseProgress({ c }) {
  const [state, setState] = React.useState({ show: false, label: '', n: '', p: 0 });
  React.useEffect(() => {
    let tick = false;
    const update = () => {
      tick = false;
      const hero = document.querySelector('.case-hero');
      const heads = [].slice.call(document.querySelectorAll('.case-section-head'));
      const show = hero ? hero.getBoundingClientRect().bottom < 64 : false;
      let n = '', label = '';
      heads.forEach((h) => {
        if (h.getBoundingClientRect().top < window.innerHeight * 0.4) {
          n = h.getAttribute('data-n') || n; label = h.getAttribute('data-title') || label;
        }
      });
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, (window.pageYOffset || 0) / max));
      setState((s) => (s.show === show && s.n === n && s.label === label && Math.abs(s.p - p) < 0.002) ? s : { show, n, label, p });
    };
    const req = () => { if (!tick) { tick = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req, { passive: true });
    req();
    return () => { window.removeEventListener('scroll', req); window.removeEventListener('resize', req); };
  }, []);
  return (
    <div className={'case-progress' + (state.show ? ' on' : '')} aria-hidden="true">
      <div className="shell case-progress-inner">
        <span className="case-progress-case">{c.company}</span>
        <span className="case-progress-sec">{state.n ? state.n + ' · ' : ''}{state.label}</span>
      </div>
      <span className="case-progress-bar" style={{ transform: 'scaleX(' + state.p.toFixed(4) + ')' }} />
    </div>
  );
}

// ─── Reveal-on-scroll ──────────────────────────────────────────────────────
function useReveal() {
  React.useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    const nodes = () => document.querySelectorAll('.reveal:not(.in)');
    const sweep = () => {
      nodes().forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) el.classList.add('in');
      });
    };
    const revealAll = () => {
      io.disconnect();
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
      document.querySelectorAll('.page-mount').forEach((el) => { el.style.opacity = '1'; el.style.animation = 'none'; });
    };

    nodes().forEach((el) => io.observe(el));
    sweep();
    const timers = [200, 800, 2000, 4000].map((t) => setTimeout(sweep, t));
    const failsafe = setTimeout(revealAll, 6000);
    const onHide = () => { if (document.hidden) revealAll(); };

    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep, { passive: true });
    window.addEventListener('load', sweep);
    document.addEventListener('visibilitychange', onHide);

    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      clearTimeout(failsafe);
      window.removeEventListener('scroll', sweep);
      window.removeEventListener('resize', sweep);
      window.removeEventListener('load', sweep);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, []);
}

// ─── Nav ───────────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open]);
  return (
    <nav className={open ? 'nav nav-open' : 'nav'}>
      <div className="shell nav-inner">
        <a href="/" className="nav-brand">
          <img src="../assets/felix-benito-logo.png?v=2" alt="Felix Benito, design and brand lead, home" className="nav-logo" />
        </a>
        <div className="nav-links">
          <a href="/#work" className="active" onClick={() => setOpen(false)}>Cases</a>
          <a href="/#practice" onClick={() => setOpen(false)}>How I work</a>
          <a href="/#cv" onClick={() => setOpen(false)}>CV</a>
          <a href="/#me" onClick={() => setOpen(false)}>Me</a>
          <a href="/design-notes/" onClick={() => setOpen(false)}>Design Notes</a>
          <a href="/#contact" onClick={() => setOpen(false)}>Contact</a>
        </div>
        <button className="nav-toggle" type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>
          <svg width="26" height="26" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────
/* Headline results in the first fold, linking down to the full results section */
function CaseImpact({ impact }) {
  React.useEffect(() => {
    const head = [].slice.call(document.querySelectorAll('.case-section-head')).find((h) => h.getAttribute('data-title') === impact.to);
    const sec = head && head.closest('section');
    if (sec && !document.getElementById('results')) sec.id = 'results';
  }, []);
  const go = (e) => {
    const t = document.getElementById('results');
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: MOTION_OK ? 'smooth' : 'auto', block: 'start' });
    /* lazy images above can load during the jump and push the section down: correct until it settles */
    let stop = false;
    const cancel = () => { stop = true; };
    window.addEventListener('wheel', cancel, { once: true, passive: true });
    window.addEventListener('touchstart', cancel, { once: true, passive: true });
    const margin = parseFloat(getComputedStyle(t).scrollMarginTop) || 0;
    [700, 1200, 1800, 2600].forEach((ms) => setTimeout(() => {
      if (stop) return;
      if (Math.abs(t.getBoundingClientRect().top - margin) > 8) t.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, ms));
    const h = t.querySelector('h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    if (history.replaceState) history.replaceState(null, '', '#results');
  };
  return (
    <div className="case-impact reveal" style={{ '--rd': '120ms' }}>
      <h2 className="sr-only">Impact at a glance</h2>
      <ul className="case-impact-list" role="list">
        {impact.items.map((k, i) => (
          <li key={i} className="case-impact-item">
            <span className="case-impact-value">{k.value}</span>
            <span className="case-impact-label">{k.label}</span>
          </li>
        ))}
      </ul>
      <a className="case-impact-link" href="#results" onClick={go}>See all results <span aria-hidden="true">↓</span></a>
    </div>
  );
}

function CaseHero({ c }) {
  return (
    <header className="case-hero">
      <div className="shell">
        <div className="case-hero-top">
          <a href="/#work" className="back-link">
            <span>←</span> Back to work
          </a>
          <span className="eyebrow no-dot">
            {c.company} · {c.year}
          </span>
        </div>
        <div className="reveal">
          <h1 className="case-title mh"><SplitWords text={c.title} /></h1>
          <p className="case-sub">{c.subtitle}</p>
        </div>
        {c.impact && <CaseImpact impact={c.impact} />}
      </div>
      <div className="shell case-cover-wrap">
        {c.heroGallery ? (
          <div className="case-hero-gallery">
            {c.heroGallery.map((src, i) => (
              <div key={i} className="case-hero-gallery-cell">
                <img src={src} alt={c.heroGalleryAlt && c.heroGalleryAlt[i] ? c.heroGalleryAlt[i] : ''} width="800" height="600" loading="eager" />
              </div>
            ))}
          </div>
        ) : c.cover ? (
          <div className="case-cover" style={c.coverBg ? { background: c.coverBg } : undefined}>
            <img src={c.cover} alt={c.coverAlt || c.title} width="1600" height="900" fetchpriority="high" />
          </div>
        ) : null}
      </div>
      <div className="shell">
        <div className="case-meta">
          {c.meta.map((m, i) => (
            <div key={m.label} className="case-meta-item reveal" style={{ '--rd': `${i * 60}ms` }}>
              <span className="case-meta-label">{m.label}</span>
              <p>{m.value}</p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

// ─── Section types ─────────────────────────────────────────────────────────
function SectionHeader({ n, title }) {
  return (
    <div className="case-section-head reveal" data-n={n || ''} data-title={title || ''}>
      <span className="case-section-n">{n}</span>
      {title ? <h2>{title}</h2> : null}
    </div>
  );
}

function TextSection({ s }) {
  return (
    <section className="case-section">
      <div className="shell">
        <SectionHeader n={s.n} title={s.title} />
        <div className="case-section-body reveal">
          {s.body && s.body.map((p, i) => <p key={i} className="case-p">{p}</p>)}
          {s.bullets && (
            <ul className="case-bullets">
              {s.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Gallery: tabs, one image at a time, full screen with zoom ─────────── */
const ICON_PREV = <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ICON_NEXT = <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ICON_CLOSE = <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
const ICON_ZOOM_IN = <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.7" /><path d="M12.6 12.6 17 17M6 8.5h5M8.5 6v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
const ICON_ZOOM_OUT = <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.7" /><path d="M12.6 12.6 17 17M6 8.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;

function useSwipe(onSwipe, enabled = true) {
  const st = React.useRef(null);
  return {
    onPointerDown: (e) => { if (!enabled || e.pointerType === 'mouse') return; st.current = { x: e.clientX, y: e.clientY }; },
    onPointerUp: (e) => {
      const s0 = st.current; st.current = null;
      if (!s0 || !enabled) return;
      const dx = e.clientX - s0.x, dy = e.clientY - s0.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) onSwipe(dx < 0 ? 1 : -1);
    },
    onPointerCancel: () => { st.current = null; },
  };
}

function preloadImg(src) { if (src) { const im = new Image(); im.decoding = 'async'; im.src = src; } }

function GalleryLightbox({ imgs, index, label, onIndex, onClose }) {
  const ref = React.useRef(null);
  const viewRef = React.useRef(null);
  const [zoom, setZoom] = React.useState(false);
  const [zoomW, setZoomW] = React.useState(0);
  const focal = React.useRef(null);
  const drag = React.useRef(null);
  const img = imgs[index];
  const N = imgs.length;

  React.useEffect(() => {
    const d = ref.current;
    if (d && !d.open) { try { d.showModal(); } catch (e) { d.setAttribute('open', ''); } }
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = prev; };
  }, []);
  React.useEffect(() => { setZoom(false); preloadImg(imgs[(index + 1) % N].src); preloadImg(imgs[(index - 1 + N) % N].src); }, [index]);

  /* keep the point under the cursor in place when zooming in */
  React.useLayoutEffect(() => {
    const v = viewRef.current;
    if (!v) return;
    if (zoom && focal.current) {
      const im = v.querySelector('img');
      const f = focal.current;
      v.scrollLeft = Math.max(0, f.px * im.offsetWidth - f.vx);
      v.scrollTop = Math.max(0, f.py * im.offsetHeight - f.vy);
    } else { v.scrollLeft = 0; v.scrollTop = 0; }
  }, [zoom, index]);

  const go = (d) => onIndex((index + d + N) % N);
  const toggleZoom = (e) => {
    const v = viewRef.current, im = v && v.querySelector('img');
    if (!im) return;
    if (!zoom) {
      const r = im.getBoundingClientRect(), vr = v.getBoundingClientRect();
      const cx = e && e.clientX != null && e.detail ? e.clientX : r.left + r.width / 2;
      const cy = e && e.clientY != null && e.detail ? e.clientY : r.top + r.height / 2;
      focal.current = { px: (cx - r.left) / r.width, py: (cy - r.top) / r.height, vx: cx - vr.left, vy: cy - vr.top };
      /* at least twice the fitted size, and never less than the file's own width */
      const tall = r.height >= vr.height - 4;   /* fitted by height: zoom to the file's width */
      setZoomW(Math.round(tall ? Math.max(img.w, r.width * 2.5) : Math.max(img.w, r.width * 2, vr.width * 1.2)));
    }
    setZoom(!zoom);
  };
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === '+' || e.key === '=') { if (!zoom) toggleZoom(); }
    else if (e.key === '-') { if (zoom) setZoom(false); }
  };
  const swipe = useSwipe(go, !zoom);
  /* drag to pan with the mouse while zoomed */
  const onDown = (e) => { swipe.onPointerDown(e); if (zoom && e.pointerType === 'mouse') { drag.current = { x: e.clientX, y: e.clientY, l: viewRef.current.scrollLeft, t: viewRef.current.scrollTop, moved: false }; } };
  const onMove = (e) => { const d = drag.current; if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y; if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true; viewRef.current.scrollLeft = d.l - dx; viewRef.current.scrollTop = d.t - dy; };
  const onUp = (e) => { swipe.onPointerUp(e); setTimeout(() => { drag.current = null; }, 0); };
  const onImgClick = (e) => { if (drag.current && drag.current.moved) return; toggleZoom(e); };

  const caption = img.caption || img.alt;
  return (
    <dialog ref={ref} className={'cg-lb' + (zoom ? ' is-zoomed' : '')} aria-label={label + ', full screen'}
            onCancel={(e) => { e.preventDefault(); onClose(); }} onKeyDown={onKey}>
      <div className="cg-lb-bar">
        <p className="cg-lb-count">{index + 1} of {N}</p>
        <div className="cg-lb-tools">
          <button type="button" className="cg-lb-btn" onClick={() => toggleZoom()} aria-pressed={zoom} aria-label={zoom ? 'Zoom out' : 'Zoom in'}>{zoom ? ICON_ZOOM_OUT : ICON_ZOOM_IN}</button>
          <button type="button" className="cg-lb-btn" onClick={onClose} aria-label="Close full screen">{ICON_CLOSE}</button>
        </div>
      </div>
      <div className="cg-lb-view" ref={viewRef} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <img key={img.src} src={img.src} alt={img.alt || caption} width={img.w} height={img.h} draggable="false"
             onClick={onImgClick} style={zoom ? { width: zoomW + 'px' } : undefined} />
      </div>
      <button type="button" className="cg-lb-btn cg-lb-prev" onClick={() => go(-1)} aria-label="Previous image">{ICON_PREV}</button>
      <button type="button" className="cg-lb-btn cg-lb-next" onClick={() => go(1)} aria-label="Next image">{ICON_NEXT}</button>
      <p className="cg-lb-caption">{caption}</p>
    </dialog>
  );
}

function CaseGallery({ s }) {
  const imgs = s.images;
  const N = imgs.length;
  const uid = 'g' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const label = s.title || s.galleryLabel || 'Gallery';
  const [i, setI] = React.useState(0);
  const [lb, setLb] = React.useState(false);
  const stageRef = React.useRef(null);
  const tabsRef = React.useRef(null);
  const openRefs = React.useRef([]);
  const prevH = React.useRef(null);

  const select = (k, focusTab) => {
    k = (k + N) % N;
    if (k === i) return;
    if (stageRef.current) prevH.current = stageRef.current.offsetHeight;
    setI(k);
    if (focusTab && tabsRef.current) { const t = tabsRef.current.querySelectorAll('[role="tab"]')[k]; if (t) t.focus(); }
  };

  /* smooth height change between images of different proportions */
  React.useLayoutEffect(() => {
    const st = stageRef.current;
    const from = prevH.current;
    prevH.current = null;
    if (st && tabsRef.current) {
      const t = tabsRef.current.querySelectorAll('[role="tab"]')[i];
      const row = tabsRef.current;
      if (t && row.scrollWidth > row.clientWidth) row.scrollTo({ left: t.offsetLeft - row.clientWidth / 2 + t.offsetWidth / 2, behavior: MOTION_OK ? 'smooth' : 'auto' });
    }
    /* switching images is a plain 200 ms fade, no height animation */
  }, [i]);

  React.useEffect(() => { preloadImg(imgs[(i + 1) % N].src); }, [i]);

  /* the side arrows cover the image only, not the caption under it */
  const arrowsRef = React.useRef(null);
  React.useLayoutEffect(() => {
    const st = stageRef.current, ar = arrowsRef.current;
    if (!st || !ar) return;
    const fit = () => { const f = st.querySelector('.cg-panel.is-on .case-image-frame'); if (f) { ar.style.height = f.offsetHeight + 'px'; ar.classList.toggle('is-tall', f.offsetHeight > window.innerHeight * 0.9); } };
    fit();
    if (!('ResizeObserver' in window)) return;
    const ro = new ResizeObserver(fit);
    ro.observe(st);
    return () => ro.disconnect();
  }, [i]);

  const onKeyDown = (e) => {
    if (lb) return;
    const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: N - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    select(map[e.key], e.target.getAttribute('role') === 'tab');
  };
  const swipe = useSwipe((d) => select(i + d));
  const img = imgs[i];

  return (
    <div className="cg" onKeyDown={onKeyDown}>
      <div className="cg-tabs" role="tablist" aria-label={label} ref={tabsRef}>
        {imgs.map((m, k) => (
          <button key={k} type="button" role="tab" id={uid + '-t' + k} aria-controls={uid + '-p' + k}
                  aria-selected={k === i} tabIndex={k === i ? 0 : -1} className="cg-tab"
                  onClick={() => select(k)}>{m.tab}</button>
        ))}
      </div>
      <div className="cg-stage" ref={stageRef} {...swipe}>
        {imgs.map((m, k) => {
          const cap = m.caption || m.alt;
          const imgStyle = { maxWidth: m.maxWidth && /px$/.test(m.maxWidth) ? m.maxWidth : Math.min(m.w, 1800) + 'px' };
          return (
            <div key={k} role="tabpanel" id={uid + '-p' + k} aria-labelledby={uid + '-t' + k}
                 className={'cg-panel' + (k === i ? ' is-on' : '')} aria-hidden={k === i ? undefined : 'true'}>
              <figure className={'case-image' + (m.flush ? ' flush' : '')}>
                <div className="case-image-frame">
                  <button type="button" className="cg-open" ref={(el) => (openRefs.current[k] = el)}
                          tabIndex={k === i ? 0 : -1} onClick={() => setLb(true)}>
                    {withWebp(m, <img src={m.src} alt={imgAltFor(s.title, m)} width={m.w} height={m.h}
                         loading={k === 0 ? undefined : 'lazy'} decoding="async" style={imgStyle} />)}
                    <span className="sr-only">, open full screen</span>
                  </button>
                </div>
                <figcaption className="cg-foot">
                  <span className="cg-caption">{cap}</span>
                  <span className="cg-count">{k + 1} of {N}</span>
                </figcaption>
                {m.note && <p className="case-image-note">{m.note}</p>}
              </figure>
            </div>
          );
        })}
        <div className="cg-arrows" ref={arrowsRef}>
          <div className="cg-arrows-in">
            <button type="button" className="cg-arrow" onClick={() => select(i - 1)} aria-label="Previous image" aria-controls={uid + '-p' + ((i - 1 + N) % N)}>{ICON_PREV}</button>
            <button type="button" className="cg-arrow" onClick={() => select(i + 1)} aria-label="Next image" aria-controls={uid + '-p' + ((i + 1) % N)}>{ICON_NEXT}</button>
          </div>
        </div>
      </div>
      {lb && (
        <GalleryLightbox imgs={imgs} index={i} label={label}
                         onIndex={(k) => setI(k)}
                         onClose={() => { setLb(false); setTimeout(() => { const b = openRefs.current[i]; if (b) b.focus(); }, 0); }} />
      )}
    </div>
  );
}

function ImageRowSection({ s }) {
  if (s.gallery && s.images && s.images.length > 1) {
    return (
      <section className="case-section">
        <div className="shell">
          <SectionHeader n={s.n} title={s.title} />
          <div className="case-section-body">
            {s.body && <p className="case-p case-lede reveal">{s.body}</p>}
            {s.bullets && (
              <ul className="case-bullets reveal">
                {s.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            )}
            <CaseGallery s={s} />
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="case-section">
      <div className="shell">
        <SectionHeader n={s.n} title={s.title} />
        <div className="case-section-body">
          {s.body && <p className="case-p case-lede reveal">{s.body}</p>}
          {s.bullets && (
            <ul className="case-bullets reveal">
              {s.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
          {s.images && (
            <div className={'case-image-grid' + (s.cols === 2 ? ' cols-2' : s.cols === 3 ? ' cols-3' : '')}
                 style={s.gridCols ? { display: 'grid', gridTemplateColumns: s.gridCols, alignItems: 'center' } : undefined}>
              {s.images.map((img, i) => (
                <figure key={i} className={'case-image' + (img.wide ? ' wide' : '') + (img.narrow ? ' narrow' : '') + (img.flush ? ' flush' : '')}
                        style={img.maxWidth ? { maxWidth: img.maxWidth, marginLeft: 'auto', marginRight: 'auto' } : undefined}>
                  {img.caption && <figcaption>{img.caption}</figcaption>}
                  <div className="case-image-frame" data-highlight={img.highlight ? '' : undefined}>
                    {withWebp(img, <img src={img.src} alt={imgAltFor(s.title, img)} width={img.w} height={img.h} loading="lazy" decoding="async" />)}
                  </div>
                  {img.note && <p className="case-image-note">{img.note}</p>}
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function KpisSection({ s }) {
  return (
    <section className="case-section">
      <div className="shell">
        <SectionHeader n={s.n} title={s.title} />
        <div className="case-section-body">
          {s.body && <p className="case-p case-lede reveal">{s.body}</p>}
          <div className="case-kpis">
            {s.kpis.map((k, i) => (
              <div key={i} className="case-kpi reveal" style={{ '--rd': `${i * 60}ms` }}>
                <span className="case-kpi-label">{k.label}</span>
                <div className="case-kpi-value">{k.value}</div>
                {k.desc && <p className="case-kpi-desc">{k.desc}</p>}
              </div>
            ))}
          </div>
          {s.closing && <p className="case-p case-closing reveal">{s.closing}</p>}
          {s.image && (
            <figure className="case-image case-image-wide" style={{ marginTop: 40, ...(s.image.maxWidth ? { maxWidth: s.image.maxWidth, marginLeft: 'auto', marginRight: 'auto' } : {}) }}>
              {s.image.caption && <figcaption>{s.image.caption}</figcaption>}
              <div className="case-image-frame">
                <img src={s.image.src} alt={imgAltFor(s.title, s.image)} width={s.image.w} height={s.image.h} loading="lazy" decoding="async" />
              </div>
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}

function PrinciplesSection({ s }) {
  return (
    <section className="case-section">
      <div className="shell">
        <SectionHeader n={s.n} title={s.title} />
        <div className="case-section-body reveal">
          <div className="case-principles">
            {s.items.map((it, i) => (
              <div key={i} className="case-principle reveal" style={{ '--rd': `${i * 60}ms` }}>
                {it.img && withWebp({ src: it.img, webp: true }, <img className="case-principle-img" src={it.img} alt={it.imgAlt || ''} width="262" height="168" loading="lazy" decoding="async" />)}
                <span className="case-principle-n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{it.k}</h3>
                <p>{it.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CalloutSection({ s }) {
  const isLead = s.kind === 'leadership';
  const isAi = s.kind === 'ai';
  const isPh = s.kind === 'placeholder';
  const tag = s.noTag ? '' : (isLead ? 'Leadership' : isAi ? 'AI · Design decision' : isPh ? 'Note' : '');
  return (
    <section className="case-section case-callout-wrap">
      <div className="shell">
        <div className={'case-callout ' + s.kind + ' reveal'}>
          {tag && <span className="case-callout-tag">{tag}</span>}
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </div>
      </div>
    </section>
  );
}

function TestimonialSection({ s }) {
  return (
    <section className="case-section case-testimonial-wrap">
      <div className="shell">
        <div className="case-testimonial reveal">
          <div className="case-testimonial-quote">“</div>
          <p className="case-testimonial-text">{s.text}</p>
          <div className="case-testimonial-person">
            <img src={s.img} alt={s.name} width="72" height="72" loading="lazy" />
            <div>
              <div className="case-testimonial-name">{s.name}</div>
              <div className="case-testimonial-at">{s.at}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Build a descriptive, unique alt from case + section context (keeps caption visible separately)
let __caseLabel = '';
/* WebP first when the image has one, the original file as fallback */
function withWebp(img, el) {
  if (!img || !img.webp) return el;
  return (
    <picture>
      <source srcSet={img.src.replace(/\.(png|jpe?g)$/i, '.webp')} type="image/webp" />
      {el}
    </picture>
  );
}

function imgAltFor(sectionTitle, img) {
  if (!img) return '';
  if (img.alt) return img.alt;
  let base = [__caseLabel, sectionTitle].filter(Boolean).join(', ');
  if (img.caption) base = base ? base + ': ' + img.caption : img.caption;
  return base || '';
}

function renderSection(s, i) {
  switch (s.type) {
    case 'text':       return <TextSection      key={i} s={s} />;
    case 'imageRow':   return <ImageRowSection  key={i} s={s} />;
    case 'kpis':       return <KpisSection      key={i} s={s} />;
    case 'principles': return <PrinciplesSection key={i} s={s} />;
    case 'callout':    return <CalloutSection   key={i} s={s} />;
    case 'testimonial': return <TestimonialSection key={i} s={s} />;
    default: return null;
  }
}

// ─── Next / Prev ───────────────────────────────────────────────────────────
function CaseNav({ c }) {
  const prev = CASES[c.prev];
  const next = CASES[c.next];
  return (
    <section className="case-section case-next">
      <div className="shell">
        <span className="eyebrow no-dot" style={{ marginBottom: 24, display: 'inline-block' }}>Continue exploring</span>
        <div className="case-next-grid">
          {prev && <CaseNavCard c={prev} dir="prev" />}
          {next && <CaseNavCard c={next} dir="next" />}
        </div>
      </div>
    </section>
  );
}

function CaseNavCard({ c, dir }) {
  return (
    <a href={'/cases/' + c.slug + '.html'} className={'case-next-card reveal ' + dir}>
      <div className="case-next-img" style={c.cardBg ? { background: c.cardBg } : undefined}>
        <img src={c.card || c.cover} alt={c.coverAlt || c.title} width="1200" height="800" loading="lazy" />
      </div>
      <div className="case-next-meta">
        <span className="case-next-dir">{dir === 'prev' ? '← Previous' : 'Next →'}</span>
        <span className="case-next-company">{c.company} · {c.year}</span>
        <h3>{c.title}</h3>
      </div>
    </a>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="contact" className="section footer">
      <div className="shell">
        <div className="footer-inner">
          <div className="reveal">
            <span className="eyebrow no-dot" style={{ marginBottom: 18, display: 'inline-block' }}>Contact</span>
            <h2>Hiring a design lead<em>?</em><br/>Let&rsquo;s talk<em>.</em></h2>
            <a className="btn primary" href="mailto:contact@felixbenito.com" style={{ marginTop: 28 }}>
              contact@felixbenito.com <span className="arrow">→</span>
            </a>
          </div>
          <div className="reveal" style={{ '--rd': '120ms' }}>
            <div className="col-h">Elsewhere</div>
            <ul>
              <li><a href="https://www.linkedin.com/in/felix-benito/" target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
              <li><a href="/design-notes/">Design Notes ↗</a></li>
              <li><a href="../assets/Felix_Benito_Design_Lead_CV.pdf" target="_blank" rel="noreferrer">CV (PDF) ↗</a></li>
            </ul>
          </div>
          <div className="reveal" style={{ '--rd': '180ms' }}>
            <div className="col-h">Open to</div>
            <ul>
              <li>Design lead &amp; head of design roles</li>
              <li>AI product design engagements</li>
              <li>Design system audits</li>
              <li>Speaking &amp; workshops</li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>© 2007–{new Date().getFullYear()} Felix Benito</span>
          <span className="footer-credits">
          <span className="footer-coffee">
            <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 5.5h9v4a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3v-4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                <path d="M11.5 6.5h1.4a1.6 1.6 0 0 1 0 3.2h-1.4" stroke="currentColor" strokeWidth="1.3" />
                <path d="M5 1.6c-.5.7-.5 1.3 0 2M8 1.6c-.5.7-.5 1.3 0 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </span>
            Hand-built with coffee
          </span>
          <span className="footer-a11y">
            <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}><svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" /><circle cx="8" cy="4.5" r="1.1" fill="currentColor" /><path d="M4.6 6.5 8 7.2l3.4-.7M8 7.2v2.5m0 0-1.7 2.9M8 9.7l1.7 2.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            <span>Built and tested for <a href="/accessibility.html">accessibility</a> (WCAG 2.2 AA)</span>
          </span>
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
function CaseApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useReveal();
  useCaseMotion();

  const c = CASES[window.CURRENT_CASE_SLUG];
  if (!c) return <div style={{ padding: 60 }}>Case not found.</div>;
  __caseLabel = c.company || '';

  React.useEffect(() => {
    /* page <title> is set per case in its HTML for SEO */
    const r = document.documentElement;
    r.setAttribute('data-direction', 'quiet');
    r.setAttribute('data-density', t.density);
    r.setAttribute('data-dark', t.dark ? '1' : '0');
    r.style.setProperty('--accent', t.accent);
  }, [t.density, t.dark, t.accent, c.title]);

  return (
    <div className="page-mount">
      <Nav />
      <CaseProgress c={c} />
      <main id="main" tabIndex={-1}>
        <CaseHero c={c} />
        <div className="case-main">
          {c.sections.map((s, i) => renderSection(s, i))}
        </div>
        <CaseNav c={c} />
      </main>
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak('dark', v)} />
        <TweakColor  label="Accent red" value={t.accent} options={ACCENT_OPTIONS}
                     onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Layout" />
        <TweakRadio  label="Density" value={t.density} options={DENSITY_OPTIONS}
                     onChange={(v) => setTweak('density', v)} />
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CaseApp />);
