/* portfolio-app.jsx, page assembly + tweaks wiring */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "quiet",
  "accent": "#8B1A1F",
  "dark": false,
  "density": "regular"
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = [
  '#8B1A1F', // burgundy (default)
  '#5A0F12', // oxblood deep
  '#C8252B', // brighter signal red
  '#A8243F', // berry
];

const DIRECTION_OPTIONS = [
  { value: 'quiet',     label: 'Quiet' },
  { value: 'system',    label: 'System' },
  { value: 'statement', label: 'Statement' },
  { value: 'mix',       label: 'Mix · System hero + Quiet work' },
];

const DENSITY_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'regular', label: 'Regular' },
  { value: 'comfy',   label: 'Comfy' },
];

// ─── Reveal-on-scroll hook ─────────────────────────────────────────────────
function useReveal() {
  React.useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ─── Smooth scroll for in-page anchors ─────────────────────────────────────
function useAnchorScroll() {
  React.useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      const el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}

// ─── Active-section observer for nav highlight ─────────────────────────────
function useActiveSection(setActive) {
  React.useEffect(() => {
    const ids = ['work', 'practice', 'cv', 'me', 'contact'];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [setActive]);
}

// ─── Nav ───────────────────────────────────────────────────────────────────
function Nav({ active }) {
  const [open, setOpen] = React.useState(false);

  // close the menu on resize back to desktop
  React.useEffect(() => {
    const onResize = () => { if (window.innerWidth > 880) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // lock body scroll while the mobile menu is open
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <nav className={'nav' + (open ? ' nav-open' : '')}>
      <div className="shell nav-inner">
        <a href="#top" className="nav-brand" onClick={close}>
          <img src="assets/logo-felix-color.png" alt="Felix Benito" className="nav-logo" />
        </a>
        <div className="nav-links">
          <a href="#work" className={active === 'work' ? 'active' : ''} onClick={close}>Cases</a>
          <a href="#practice" className={active === 'practice' ? 'active' : ''} onClick={close}>How I work</a>
          <a href="#cv" className={active === 'cv' ? 'active' : ''} onClick={close}>CV</a>
          <a href="#me" className={active === 'me' ? 'active' : ''} onClick={close}>Me</a>
          <a href="#contact" className={active === 'contact' ? 'active' : ''} onClick={close}>Contact</a>
        </div>
        <button
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="top" className="section hero">
      <div className="shell">
        <div className="hero-split">
          <div className="hero-portrait reveal">
            <img src="assets/felix-benito-design-lead-home-office.jpg" alt="Felix Benito, design lead, working at his home-office desk with a laptop, tablet, globe, books and his cat" width="1400" height="1266" fetchpriority="high" />
          </div>
          <div className="hero-body">
            <div className="reveal">
              <h1>
                Design lead<br/>
                shipping <em>AI products</em><br/>
                for global teams.
              </h1>
              <p className="hero-credential">
                <span className="hero-credential-mark"></span>
                18 years designing for Audi, Coca-Cola and Kraft Heinz.
              </p>
            </div>
          </div>
        </div>
        <div className="cta-row reveal" style={{ '--rd': '300ms' }}>
          <a className="btn primary" href="#work">
            See selected work
            <span className="btn-ico" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 4V3.1c0-.55.45-1 1-1h3c.55 0 1 .45 1 1V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <rect x="2" y="4" width="12" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M2 8h12" stroke="currentColor" strokeWidth="1.4"/>
              </svg>
            </span>
          </a>
          <a className="btn" href={PROFILE.cv} target="_blank" rel="noreferrer">
            Download CV <span className="arrow">↓</span>
          </a>
          <a className="btn" href={`mailto:${PROFILE.email}`}>
            {PROFILE.email}
            <span className="btn-ico" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="3.5" width="12" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M2.4 4.3 8 8.6l5.6-4.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>
        </div>
        <div className="hero-meta">
          <div className="item reveal" style={{ '--rd': '60ms' }}>
            <span data-n="01">Currently</span>
            <p>
              Design Lead.
            </p>
          </div>
          <div className="item reveal" style={{ '--rd': '120ms' }}>
            <span data-n="02">Experience</span>
            <p>18+ years across consumer, enterprise B2B, automotive and industrial product.</p>
          </div>
          <div className="item reveal" style={{ '--rd': '180ms' }}>
            <span data-n="03">Practice</span>
            <p>Design strategy, AI product design, design systems, team leadership.</p>
          </div>
          <div className="item reveal" style={{ '--rd': '240ms' }}>
            <span data-n="04">Based</span>
            <p>Working with teams across LATAM, EU and US.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section header ────────────────────────────────────────────────────────
function SectionHead({ num, eyebrow, title, lede }) {
  return (
    <div className="section-head reveal">
      <div className="label">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <p>{lede}</p>
    </div>
  );
}
// ─── Work ──────────────────────────────────────────────────────────────────
function WorkCard({ p, i }) {
  const invertClass = (i % 2 === 0) ? '' : ' invert'; // used only in Statement
  return (
    <a className={'work-card reveal' + invertClass} href={p.href}
       style={{ '--rd': `${i * 70}ms`, color: 'inherit', display: 'grid' }}>
      <div className="meta">
        <div>
          <div className="meta-top">
            <span>{p.n} · {p.company}</span>
            <span>{p.year}</span>
          </div>
          <h3>{p.title}</h3>
          <p className="summary">{p.summary}</p>
          <div className="tags">
            {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>
        <div className="meta-bottom">
          <span>{p.role}</span>
          <span className="open">Open case <span>→</span></span>
        </div>
      </div>
      <div className="visual">
        {p.video
          ? <video src={p.video} poster={p.img} width="1200" height="800" autoPlay muted loop playsInline preload="metadata" aria-label={p.imgAlt || p.title}></video>
          : <img src={p.img} alt={p.imgAlt || p.title} width="1200" height="800" loading="lazy" />}
      </div>
    </a>
  );
}

function Work() {
  return (
    <section id="work" className="section">
      <div className="shell">
        <SectionHead
          num="01"
          eyebrow="Cases"
          title="Five projects that shaped how I lead."
          lede="From global B2B platforms at Coca-Cola and Audi to industrial software and consumer apps, I led these projects end to end, applying AI in several of them to move faster from research to a shipped decision."
        />
        <div className="work-list">
          {PROJECTS.map((p, i) => <WorkCard key={p.n} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Practice (merged Leadership + AI) ─────────────────────────────────────
function Practice() {
  return (
    <section id="practice" className="section">
      <div className="shell">
        <SectionHead
          num="02"
          eyebrow="How I work"
          title={<>How I work,<br/>end to end.</>}
          lede="From the first survey to the launch email, one design voice across the whole thing."
        />
        <div className="split">
          <div className="split-stack">
            {LEADERSHIP.map((l, i) => (
              <div key={l.n} className="lead-card reveal" style={{ '--rd': `${i * 80}ms` }}>
                <div className="num">{l.n} &middot; {l.tag}</div>
                <h4>{l.title}</h4>
                <p>{l.body}</p>
              </div>
            ))}
          </div>
          <div className="callout reveal" style={{ '--rd': '160ms' }}>
            <h3>The AI proposes, I refine.</h3>
            <p>AI is a junior teammate. Fast at first drafts, useless without research and judgment. At PharosGraph I built the design system as markdown so Claude Code could consume it directly, and content production went from 18 hours to 75 minutes. But the speed was never the interesting part. It is the contract between a model's suggestion and a person's decision, and that contract is the design.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Formation (coda to CV) ────────────────────────────────────────────────
function Formation() {
  return (
    <section id="formation" className="section formation">
      <div className="shell">
        <div className="formation-inner reveal">
          <span className="eyebrow">Education</span>
          <h2 className="formation-title">Always learning, always shipping</h2>
          <p className="formation-body">
            It started with a <em>degree in advertising</em>, where audience, narrative and brand are the entire craft. A <em>postgraduate degree in design</em> turned that craft into systems and products. An <em>MBA in strategic communication</em> added the business lens, positioning, framing, the discipline of saying no. Right now I am working toward my <em>NN/g UX Certification</em>, and I keep studying English, Spanish and Portuguese so the work lands wherever the team happens to be.
          </p>
          <div className="formation-gallery">
            <figure><img src="assets/felix-benito-nng-ux-leader-course.jpg" alt="Felix Benito attending the NN/g UX Leader course on a video call, viewing the Essential Skills for Any UX Practitioner session" width="1200" height="674" loading="lazy" /></figure>
            <figure><img src="assets/felix-benito-google-ux-certificate.jpg" alt="Google Foundations of User Experience (UX) Design course certificate issued to Felix Benito through Coursera" width="1200" height="927" loading="lazy" /></figure>
            <figure><img src="assets/felix-benito-product-discovery-notes.jpg" alt="Handwritten study notes on product discovery beside an open copy of Inspired, on product-discovery principles" width="1200" height="700" loading="lazy" /></figure>
          </div>
          <p className="formation-note">I stay in constant development: taking courses and workshops, reading and summarizing books by hand, which is how I hold on to what I learn.</p>
        </div>
      </div>
    </section>
  );
}

// ─── Me ────────────────────────────────────────────────────────────────────
function Me() {
  return (
    <section id="me" className="section me-section">
      <div className="shell">
        <SectionHead
          num="06"
          eyebrow="Me"
          title={<>Where the <em>creativity</em> comes from.</>}
          lede="The interesting design decisions don't arrive at a desk. They show up on a road, in a museum room, in a café across the world."
        />
        <div className="me-gallery reveal">
          <figure className="me-card me-card-tall">
            <div className="me-image"><img src="assets/felix-benito-hiking-trails-nature.jpg" alt="Felix Benito hiking a trail in nature while traveling, the off-screen thinking time that informs design decisions" width="800" height="1000" loading="lazy" /></div>
            <figcaption>
              <span className="me-tag">On the road</span>
              <p>Exploring countries by road and on foot, hiking trails and staying as close to nature as I can, looking for the light, the color, the angle.</p>
            </figcaption>
          </figure>
          <figure className="me-card me-card-tall">
            <div className="me-image"><img src="assets/felix-benito-museum-exhibition.jpg" alt="Studying composition and light at a Rembrandt exhibition" width="800" height="1000" loading="lazy" /></div>
            <figcaption>
              <span className="me-tag">In the museum</span>
              <p>Exhibitions are where I study composition, contrast and restraint, the master of light and shadow, still teaching.</p>
            </figcaption>
          </figure>
          <figure className="me-card me-card-tall">
            <div className="me-image"><img className="desat" src="assets/felix-benito-working-from-cafe.jpg" alt="Working from a café, the ambient noise and rotating light that ends up in the work" width="800" height="1000" loading="lazy" /></div>
            <figcaption>
              <span className="me-tag">From a café</span>
              <p>I work from cafés all over the world. The ambient noise, the rotating light, the strangers, all of it ends up in the work.</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────
function Quotes() {
  return (
    <section className="section">
      <div className="shell">
        <SectionHead
          num="04"
          eyebrow="What people say"
          title="From the people I&rsquo;ve worked alongside."
          lede="Designers, developers, PMs and clients who&rsquo;ve seen my work close-up. Pulled from LinkedIn recommendations."
        />
        <div className="quotes">
          {TESTIMONIALS.map((q, i) => (
            <div key={i} className="quote reveal" style={{ '--rd': `${i * 90}ms` }}>
              <div className="mk">&ldquo;</div>
              <p>{q.text}</p>
              <div className="who">
                <img src={q.img} alt={`Portrait of ${q.name}`} width="72" height="72" loading="lazy" />
                <div>
                  <div className="name">{q.name}</div>
                  <div className="at">{q.at}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CV ────────────────────────────────────────────────────────────────────
function CVSection() {
  return (
    <section id="cv" className="section">
      <div className="shell">
        <SectionHead
          num="03"
          eyebrow="Experience"
          title="Eighteen years, one through-line."
          lede={<>The full CV lives <a href={PROFILE.cv} target="_blank" rel="noreferrer" style={{ borderBottom: '1px solid currentColor', color: 'var(--accent)' }}>here</a>. This is the shape of it.</>}
        />
        <div className="cv reveal">
          {CV.map((row, i) => (
            <div key={i} className="cv-row">
              <span className="year">{row.year}</span>
              <span className="role">{row.role}</span>
              <span className="org">{row.org}</span>
              <span className="place">{row.place}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Clients ───────────────────────────────────────────────────────────────
function Clients() {
  return (
    <section id="clients" className="section">
      <div className="shell">
        <SectionHead
          num="05"
          eyebrow="Companies"
          title="Worked with."
          lede="Selected global, regional and startup clients across automotive, FMCG, agriculture, retail and biotech."
        />
        <div className="clients reveal">
          {CLIENTS.map((c) => (
            <div key={c.name} className="cell" title={c.name}>
              <img src={c.src} alt={c.name} loading="lazy" style={c.scale ? { maxHeight: `${64 * c.scale}px`, maxWidth: `${c.scale * 100}%` } : undefined} />
            </div>
          ))}
        </div>
      </div>
    </section>
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
            <h2>
              Hiring a <em>design lead?</em><br/>
              Let&rsquo;s talk.
            </h2>
            <a className="btn primary" href={`mailto:${PROFILE.email}`} style={{ marginTop: 28 }}>
              {PROFILE.email}
              <span className="btn-ico" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="3.5" width="12" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M2.4 4.3 8 8.6l5.6-4.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
          </div>
          <div className="reveal" style={{ '--rd': '120ms' }}>
            <div className="col-h">Elsewhere</div>
            <ul>
              <li><a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
              <li><a href={PROFILE.medium} target="_blank" rel="noreferrer">Medium ↗</a></li>
              <li><a href={PROFILE.cv} target="_blank" rel="noreferrer">CV (PDF) ↗</a></li>
            </ul>
          </div>
          <div className="reveal" style={{ '--rd': '180ms' }}>
            <div className="col-h">Open to</div>
            <ul className="open-to">
              <li>Design lead &amp; head of design roles</li>
              <li>AI product design engagements</li>
              <li>Design audits &amp; recommendations</li>
              <li>Speaking &amp; workshops</li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>© 2007 / {new Date().getFullYear()} Felix Benito</span>
          <span className="footer-coffee">
            <span className="btn-ico" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 5.5h9v4a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3v-4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M11.5 6.5h1.4a1.6 1.6 0 0 1 0 3.2h-1.4" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M5 1.6c-.5.7-.5 1.3 0 2M8 1.6c-.5.7-.5 1.3 0 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </span>
            Hand-built with coffee
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [active, setActive] = React.useState('work');
  const [shifting, setShifting] = React.useState(false);
  const lastDirRef = React.useRef(t.direction);

  useReveal();
  useAnchorScroll();
  useActiveSection(setActive);

  // crossfade when direction changes
  React.useEffect(() => {
    if (lastDirRef.current === t.direction) return;
    lastDirRef.current = t.direction;
    setShifting(true);
    const id = setTimeout(() => setShifting(false), 380);
    return () => clearTimeout(id);
  }, [t.direction]);

  // apply tweaks to the documentElement
  React.useEffect(() => {
    const r = document.documentElement;
    r.setAttribute('data-direction', t.direction);
    r.setAttribute('data-density', t.density);
    r.setAttribute('data-dark', t.dark ? '1' : '0');
    r.style.setProperty('--accent', t.accent);
  }, [t.direction, t.density, t.dark, t.accent]);

  return (
    <div className={'page-mount dir-shift' + (shifting ? ' shifting' : '')}>
      <Nav active={active} />
      <Hero />
      <Work />
      <Practice />
      <CVSection />
      <Formation />
      <Quotes />
      <Clients />
      <Me />
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Direction" />
        <TweakRadio
          label="Aesthetic"
          value={t.direction}
          options={DIRECTION_OPTIONS}
          onChange={(v) => setTweak('direction', v)}
        />
        <TweakSection label="Theme" />
        <TweakToggle
          label="Dark mode"
          value={t.dark}
          onChange={(v) => setTweak('dark', v)}
        />
        <TweakColor
          label="Accent red"
          value={t.accent}
          options={ACCENT_OPTIONS}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={DENSITY_OPTIONS}
          onChange={(v) => setTweak('density', v)}
        />
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
