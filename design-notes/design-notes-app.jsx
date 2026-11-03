/* design-notes/design-notes-app.jsx, renders the Design Notes index or a single note based on window.CURRENT_NOTE_SLUG */

const ACCENT_OPTIONS = ['#8B1A1F', '#5A0F12', '#C8252B', '#A8243F'];

// ─── Motion ────────────────────────────────────────────────────────────────
const MOTION_OK = (() => { try { return !window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
if (MOTION_OK) document.documentElement.classList.add('motion');

/* photographs drifting slowly toward you in depth, kept clear of the headline */
const DRIFT_IMAGES = [
  'assets/where-creativity-comes-from-cover.jpg',
  '../cases/assets/audi-myaudi-maintenance-onboarding-cover.jpg',
  'assets/breakdown-01-amazon-highlight.jpg',
  '../cases/assets/coca-cola-ko-boss-cover.png',
  'assets/creativity-urban-sketch-cusco.jpg',
  '../cases/assets/kraft-heinz-sales-tech-ecosystem-cover.jpg',
  'assets/alignment-business-model-canvas.jpg',
  '../cases/assets/pharosgraph-cover.png',
  'assets/creativity-vinicunca-rainbow-mountain.jpg',
  '../cases/assets/rhi-magnesita-ladle-slag-model-cover.jpg',
];
function DriftGallery() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const box = ref.current; if (!box) return;
    const cards = [].slice.call(box.querySelectorAll('.drift-card'));
    const N = cards.length, RANGE = 2200, NEAR = 260;
    const items = cards.map((el, i) => ({ el, z: -RANGE + ((i + 0.5) / N) * RANGE, x: ((i * 0.61803) % 1) * 2 - 1, y: ((i * 0.37 + 0.2) % 1) * 2 - 1 }));
    const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    let W = box.clientWidth, H = box.clientHeight, mx = 0, my = 0, cx = 0, cy = 0, raf = 0, tp = 0, vis = true;
    const place = () => items.forEach((it) => {
      const a = sm(-RANGE, -RANGE + 500, it.z) * (1 - sm(NEAR - 420, NEAR, it.z));
      it.el.style.transform = 'translate(-50%,-50%) translate3d(' + (it.x * W * 0.4 + cx * 36).toFixed(1) + 'px,' + (it.y * H * 0.34 + cy * 22).toFixed(1) + 'px,' + it.z.toFixed(1) + 'px)';
      it.el.style.opacity = (a * 0.7).toFixed(3);
    });
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (t - tp) / 1000 || 0); tp = t;
      cx += (mx - cx) * 0.03; cy += (my - cy) * 0.03;
      items.forEach((it) => { it.z += 70 * dt; if (it.z > NEAR) it.z -= RANGE; });
      place();
    };
    const start = () => { if (!MOTION_OK || raf || !vis || document.hidden) return; tp = performance.now(); raf = requestAnimationFrame(loop); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const onMove = (e) => { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; };
    const onResize = () => { W = box.clientWidth; H = box.clientHeight; if (!raf) place(); };
    const onVis = () => (document.hidden ? stop() : start());
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => { vis = es[0].isIntersecting; vis ? start() : stop(); }) : null;
    if (io) io.observe(box);
    place(); box.classList.add('ready'); start();
    return () => { stop(); if (io) io.disconnect(); window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis); };
  }, []);
  return (
    <div className="notes-drift" ref={ref} aria-hidden="true">
      {DRIFT_IMAGES.map((src, i) => <div key={i} className="drift-card"><img src={src} alt="" loading="lazy" decoding="async" /></div>)}
    </div>
  );
}

function useHeadlineMotion() {
  React.useEffect(() => {
    const hs = document.querySelectorAll('.mh');
    hs.forEach((h) => h.querySelectorAll('.mw > span').forEach((w, i) => w.style.setProperty('--i', i)));
    const t = setTimeout(() => hs.forEach((h) => h.classList.add('in')), 120);
    return () => clearTimeout(t);
  }, []);
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
        <a href="../index.html" className="nav-brand">
          <img src="../assets/felix-benito-logo.png?v=2" alt="Felix Benito, design and brand lead, home" className="nav-logo" />
        </a>
        <div className="nav-links">
          <a href="../index.html#work" onClick={() => setOpen(false)}>Cases</a>
          <a href="../index.html#practice" onClick={() => setOpen(false)}>How I work</a>
          <a href="../index.html#cv" onClick={() => setOpen(false)}>CV</a>
          <a href="../index.html#me" onClick={() => setOpen(false)}>Me</a>
          <a href="index.html" className="active" onClick={() => setOpen(false)}>Design Notes</a>
          <a href="../index.html#contact" onClick={() => setOpen(false)}>Contact</a>
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

// ─── Footer (mirrors cases/case-app.jsx Footer, Medium replaced with Design Notes) ──
function Footer() {
  return (
    <section id="contact" className="section footer">
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
              <li><a href="index.html">Design Notes ↗</a></li>
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
          <span>© 2007 / {new Date().getFullYear()} Felix Benito</span>
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
        </div>
      </div>
    </section>
  );
}

// ─── Filters ───────────────────────────────────────────────────────────────
function NoteFilters({ active, onChange }) {
  return (
    <div className="notes-filters reveal">
      {NOTE_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={'notes-filter' + (active === cat.id ? ' active' : '')}
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

// ─── Note card ─────────────────────────────────────────────────────────────
function NoteCard({ note, i }) {
  return (
    <a href={note.slug + '.html'} className="note-card reveal" style={{ '--rd': `${i * 60}ms` }}>
      <div className="note-card-img">
        <img src={note.cover} alt={note.coverAlt} width="1200" height="630" loading="lazy" />
      </div>
      <div className="note-card-body">
        <span className="note-tag">{note.categoryLabel}</span>
        <h3>{note.title}</h3>
        <p>{note.excerpt}</p>
        <span className="note-card-meta">{note.dateLabel} · {note.readTime}</span>
      </div>
    </a>
  );
}

// ─── Index (listing) ───────────────────────────────────────────────────────
function NotesIndex() {
  const [active, setActive] = React.useState('all');
  useReveal();
  useHeadlineMotion();

  React.useEffect(() => {
    /* page <title> is set in the HTML for SEO */
  }, []);

  const notes = NOTE_ORDER.map((slug) => NOTES[slug]);
  const filtered = active === 'all' ? notes : notes.filter((n) => n.category === active);

  return (
    <div className="page-mount">
      <Nav />
      <header className="notes-hero notes-hero-drift">
        <DriftGallery />
        <div className="shell">
          <div className="reveal">
            <span className="eyebrow no-dot">Design Notes</span>
            <h1 className="notes-title mh">{['Strategy,', 'craft,', 'AI', 'and'].map((w, i) => <React.Fragment key={i}><span className="mw"><span>{w}</span></span> </React.Fragment>)}<span className="mw"><span>creativity<em>.</em></span></span></h1>
            <p className="notes-sub">Notes on how I lead design and brand work day to day, written to stay useful longer than a news cycle.</p>
          </div>
        </div>
      </header>

      <section className="section notes-list">
        <div className="shell">
          <NoteFilters active={active} onChange={setActive} />

          {filtered.length > 0 ? (
            <div className="notes-grid">
              {filtered.map((note, i) => <NoteCard key={note.slug} note={note} i={i} />)}
            </div>
          ) : (
            <div className="notes-empty reveal">
              <p>0 results</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ─── Article (single note) ─────────────────────────────────────────────────
function renderBlock(b, i) {
  switch (b.type) {
    case 'h2':
      return <h2 key={i} className="note-h2 reveal">{b.text}</h2>;
    case 'h3':
      return <h3 key={i} className="note-h3 reveal">{b.text}</h3>;
    case 'p':
      return <p key={i} className="note-p reveal">{b.text}</p>;
    case 'image':
      return (
        <figure key={i} className="note-image reveal">
          <div className="note-image-frame">
            <img src={b.src} alt={b.alt} width={b.w} height={b.h} loading="lazy" decoding="async" />
          </div>
          {b.caption && <figcaption>{b.caption}</figcaption>}
        </figure>
      );
    case 'video':
      return (
        <figure key={i} className="note-image note-video reveal">
          <div className="note-image-frame">
            <video src={b.src} poster={b.poster} width={b.w} height={b.h} controls playsInline preload="metadata" aria-label={b.label} />
          </div>
          {b.caption && <figcaption>{b.caption}</figcaption>}
        </figure>
      );
    case 'note':
      return <p key={i} className="note-p note-disclaimer reveal">{b.text}</p>;
    default:
      return null;
  }
}

function NoteArticle({ note }) {
  useReveal();

  React.useEffect(() => {
    /* page <title> is set in the HTML for SEO */
  }, [note.title]);

  return (
    <div className="page-mount">
      <Nav />
      <header className="notes-hero note-hero">
        <div className="shell">
          <div className="notes-hero-top">
            <a href="index.html" className="back-link">
              <span>←</span> Back to Design Notes
            </a>
            <span className="note-tag">{note.categoryLabel}</span>
          </div>
          <div className="reveal">
            <h1 className="note-title">{note.title}</h1>
            <p className="note-sub">{note.subtitle}</p>
            <span className="note-meta">{note.dateLabel} · {note.readTime}</span>
          </div>
        </div>
        <div className="shell note-cover-wrap">
          <div className="note-cover reveal">
            <img src={note.cover} alt={note.coverAlt} width="1200" height="630" fetchpriority="high" />
          </div>
        </div>
      </header>

      <main className="note-main">
        <div className="shell note-article">
          {note.body.map((b, i) => renderBlock(b, i))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
function DesignNotesApp() {
  const slug = window.CURRENT_NOTE_SLUG;
  if (!slug) return <NotesIndex />;
  const note = NOTES[slug];
  if (!note) return <div style={{ padding: 60 }}>Note not found.</div>;
  return <NoteArticle note={note} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DesignNotesApp />);
