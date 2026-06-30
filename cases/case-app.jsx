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

// ─── Reveal-on-scroll ──────────────────────────────────────────────────────
function useReveal() {
  React.useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ─── Nav ───────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="nav">
      <div className="shell nav-inner">
        <a href="../" className="nav-brand">
          <img src="../assets/logo-felix-color.svg" alt="Felix Benito" className="nav-logo" />
        </a>
        <div className="nav-links">
          <a href="../#work" className="active">Work</a>
          <a href="../#practice">Leadership &amp; AI</a>
          <a href="../#cv">CV</a>
          <a href="../#me">Me</a>
          <a href="../#contact">Contact</a>
        </div>
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
          <a href="../#work" className="back-link">
            <span>←</span> Back to work
          </a>
          <span className="eyebrow no-dot">
            {c.company} · {c.year}
          </span>
        </div>
        <div className="reveal">
          <h1 className="case-title">{c.title}</h1>
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
    <div className="case-section-head reveal">
      <span className="case-section-n">{n}</span>
      <h2>{title}</h2>
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
                <figure key={i} className={'case-image reveal' + (img.wide ? ' wide' : '') + (img.narrow ? ' narrow' : '') + (img.flush ? ' flush' : '')}
                        style={{ '--rd': `${i * 50}ms`, ...(img.maxWidth ? { maxWidth: img.maxWidth, marginLeft: 'auto', marginRight: 'auto' } : {}) }}>
                  {img.caption && <figcaption>{img.caption}</figcaption>}
                  <div className="case-image-frame">
                    <img src={img.src} alt={imgAltFor(s.title, img)} loading="lazy" />
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
            <figure className="case-image case-image-wide reveal" style={{ marginTop: 40, ...(s.image.maxWidth ? { maxWidth: s.image.maxWidth, marginLeft: 'auto', marginRight: 'auto' } : {}) }}>
              {s.image.caption && <figcaption>{s.image.caption}</figcaption>}
              <div className="case-image-frame">
                <img src={s.image.src} alt={imgAltFor(s.title, s.image)} loading="lazy" />
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
                <h4>{it.k}</h4>
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
        <h4>{c.title}</h4>
      </div>
    </a>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────
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
              <li><a href="https://medium.com/@felixbenito13" target="_blank" rel="noreferrer">Medium ↗</a></li>
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

// ─── App ───────────────────────────────────────────────────────────────────
function CaseApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useReveal();

  const c = CASES[window.CURRENT_CASE_SLUG];
  if (!c) return <div style={{ padding: 60 }}>Case not found.</div>;
  __caseLabel = c.company || '';

  React.useEffect(() => {
    document.title = c.title + ' · Felix Benito';
    const r = document.documentElement;
    r.setAttribute('data-direction', 'quiet');
    r.setAttribute('data-density', t.density);
    r.setAttribute('data-dark', t.dark ? '1' : '0');
    r.style.setProperty('--accent', t.accent);
  }, [t.density, t.dark, t.accent, c.title]);

  return (
    <div className="page-mount">
      <Nav />
      <CaseHero c={c} />
      <main className="case-main">
        {c.sections.map((s, i) => renderSection(s, i))}
      </main>
      <CaseNav c={c} />
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
