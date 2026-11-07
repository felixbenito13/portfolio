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

/* images open from the edges as they scroll in; headlines rise when visible */
function useCaseMotion() {
  React.useEffect(() => {
    if (!MOTION_OK || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.case-image-frame, .mh').forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
    const bind = () => document.querySelectorAll('.case-image-frame:not(.clip), .mh:not(.bound)').forEach((el) => {
      el.classList.add(el.classList.contains('mh') ? 'bound' : 'clip');
      io.observe(el);
    });
    bind();
    const t = setTimeout(bind, 800);
    return () => { clearTimeout(t); io.disconnect(); };
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
        <a href="../index.html" className="nav-brand">
          <img src="../assets/felix-benito-logo.png?v=2" alt="Felix Benito, design and brand lead, home" className="nav-logo" />
        </a>
        <div className="nav-links">
          <a href="../index.html#work" className="active" onClick={() => setOpen(false)}>Cases</a>
          <a href="../index.html#practice" onClick={() => setOpen(false)}>How I work</a>
          <a href="../index.html#cv" onClick={() => setOpen(false)}>CV</a>
          <a href="../index.html#me" onClick={() => setOpen(false)}>Me</a>
          <a href="../design-notes/index.html" onClick={() => setOpen(false)}>Design Notes</a>
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

// ─── Hero ──────────────────────────────────────────────────────────────────
function CaseHero({ c }) {
  return (
    <header className="case-hero">
      <div className="shell">
        <div className="case-hero-top">
          <a href="../index.html#work" className="back-link">
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
      </div>
      <div className="shell case-cover-wrap">
        {c.heroGallery ? (
          <div className="case-hero-gallery reveal">
            {c.heroGallery.map((src, i) => (
              <div key={i} className="case-hero-gallery-cell">
                <img src={src} alt={c.heroGalleryAlt && c.heroGalleryAlt[i] ? c.heroGalleryAlt[i] : ''} width="800" height="600" loading="eager" />
              </div>
            ))}
          </div>
        ) : c.cover ? (
          <div className="case-cover reveal" style={c.coverBg ? { background: c.coverBg } : undefined}>
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

function ImageRowSection({ s }) {
  return (
    <section className="case-section">
      <div className="shell">
        <SectionHeader n={s.n} title={s.title} />
        <div className="case-section-body reveal">
          {s.body && <p className="case-p case-lede">{s.body}</p>}
          {s.bullets && (
            <ul className="case-bullets">
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
                  <div className="case-image-frame">
                    <img src={img.src} alt={imgAltFor(s.title, img)} width={img.w} height={img.h} loading="lazy" decoding="async" />
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
        <div className="case-section-body reveal">
          {s.body && <p className="case-p case-lede">{s.body}</p>}
          <div className="case-kpis">
            {s.kpis.map((k, i) => (
              <div key={i} className="case-kpi reveal" style={{ '--rd': `${i * 60}ms` }}>
                <span className="case-kpi-label">{k.label}</span>
                <div className="case-kpi-value">{k.value}</div>
                {k.desc && <p className="case-kpi-desc">{k.desc}</p>}
              </div>
            ))}
          </div>
          {s.closing && <p className="case-p case-closing">{s.closing}</p>}
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
    <a href={c.slug + '.html'} className={'case-next-card reveal ' + dir}>
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
              <li><a href="../design-notes/index.html">Design Notes ↗</a></li>
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
