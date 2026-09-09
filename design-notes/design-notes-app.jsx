/* design-notes/design-notes-app.jsx, renders the Design Notes index or a single note based on window.CURRENT_NOTE_SLUG */

const ACCENT_OPTIONS = ['#8B1A1F', '#5A0F12', '#C8252B', '#A8243F'];

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
          <img src="../assets/felix-benito-logo.png" alt="Felix Benito, design lead, home" className="nav-logo" />
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
          <span>Hand-built with coffee</span>
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

  React.useEffect(() => {
    document.title = 'Design Notes · Felix Benito, Design Lead';
  }, []);

  const notes = NOTE_ORDER.map((slug) => NOTES[slug]);
  const filtered = active === 'all' ? notes : notes.filter((n) => n.category === active);

  return (
    <div className="page-mount">
      <Nav />
      <header className="notes-hero">
        <div className="shell">
          <div className="reveal">
            <span className="eyebrow no-dot">Design Notes</span>
            <h1 className="notes-title">Strategy, craft, AI and creativity<em>.</em></h1>
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
            <img src={b.src} alt={b.alt} loading="lazy" />
          </div>
          {b.caption && <figcaption>{b.caption}</figcaption>}
        </figure>
      );
    default:
      return null;
  }
}

function NoteArticle({ note }) {
  useReveal();

  React.useEffect(() => {
    document.title = note.title + ' · Design Notes · Felix Benito';
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
