import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, Check, ChevronDown, Copy, Download, ExternalLink, Github, Linkedin, MapPin, Menu, Pause, Play, X } from 'lucide-react';
import { capabilities, copy, experiences, identity, projects, text } from './content';
import type { Language, Localized, Project, ProjectCategory } from './content';

const NetworkScene = lazy(() => import('./NetworkScene'));
const sections = ['profile', 'work', 'experience', 'contact'] as const;

function preference(key: string) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function savePreference(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { return; }
}

function ProjectDialog({ project, language, onClose }: { project: Project | null; language: Language; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const translate = (value: Localized) => value[language];
  useEffect(() => {
    if (!project || !dialog.current) return;
    const element = dialog.current;
    const focused = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      focused?.focus({ preventScroll: true });
    };
  }, [project]);

  return <dialog ref={dialog} className="case-dialog" aria-labelledby="case-title" onCancel={onClose} onClick={event => {
    if (event.target !== dialog.current) return;
    const bounds = dialog.current.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }}>
    {project && <>
      <div className="dialog-toolbar"><span className="mono">CASE FILE / {project.number}</span><button className="icon-button" onClick={onClose} aria-label={translate(copy.close)} title={translate(copy.close)} autoFocus><X size={22} /></button></div>
      <div className="dialog-content">
        <span className="eyebrow">{translate(project.subtitle)}</span>
        <h2 id="case-title">{translate(project.title)}</h2>
        <img src={`/assets/${project.id}.webp`} alt={translate(text(`Illustrative diagram: ${project.subtitle.en}`, `Diagram ilustratif: ${project.subtitle.id}`))} width="1100" height="650" />
        <div className="case-context"><span className="mono">{translate(copy.scope)}</span><p>{translate(project.context)}</p></div>
        <h3>{translate(copy.challenge)}</h3><p>{translate(project.challenge)}</p>
        <h3>{translate(copy.contribution)}</h3><ul>{project.contributions.map((point, index) => <li key={index}>{translate(point)}</li>)}</ul>
        <h3>{translate(copy.outcome)}</h3><p>{translate(project.outcome)}</p>
        <h3>{translate(copy.tools)}</h3><div className="tags">{project.tools.map(tool => <span key={tool}>{tool}</span>)}</div>
        {project.link && <a className="button button-dark" href={project.link} target="_blank" rel="noopener noreferrer"><Github size={18} />{translate(copy.source)}<ArrowUpRight size={18} /></a>}
      </div>
    </>}
  </dialog>;
}

function Resume() {
  useEffect(() => { document.title = 'Ricko Prayudha | Professional CV'; }, []);
  return <main className="resume-page">
    <h1>Ricko Prayudha</h1>
    <p className="resume-role">IT Operations | Infrastructure | Network Engineering | Governance</p>
    <p>Jakarta, Indonesia | {identity.email}<br />linkedin.com/in/ricko-prayudha | github.com/rickopra | rickopra.github.io</p>
    <h2>Professional Profile</h2>
    <p>IT Operations professional with experience spanning ISP and field network engineering, enterprise infrastructure, operational supervision, and compliance support. Supported 500+ users, delivered BGP routing across 7 sites, and coordinated 24/7 operations. Hands-on with monitoring, virtualization, Windows administration, ITSM/ITAM, and internal workflow systems.</p>
    <h2>Core Capabilities</h2>
    {capabilities.map(capability => <p key={capability.title.en}><strong>{capability.title.en}:</strong> {capability.tools.join(', ')}</p>)}
    <h2>Professional Experience</h2>
    {experiences.map((experience, index) => <section key={experience.role} className={`resume-job ${index === 2 ? 'resume-new-page' : ''}`}>
      {index === 2 && <h2 className="resume-continuation">Professional Experience (continued)</h2>}
      <h3>{experience.role} | {experience.company}</h3><p className="resume-period">{experience.period.en} | {experience.location}</p>
      <ul>{experience.points.map(point => <li key={point.en}>{point.en}</li>)}</ul>
    </section>)}
    <h2>Selected Work</h2>
    <p><strong>ATLAS:</strong> Self-hosted asset tracking and lifecycle administration. Next.js, Fastify, PostgreSQL, Docker. github.com/rickopra/ATLAS</p>
    <p><strong>SHIFT & CHECKLIST:</strong> Internal shift handover and recurring operational-control workspaces.</p>
    <p><strong>CyberArk L2 Rolebook:</strong> Independent learning and operational-runbook project. Not a certification or employment claim. rickopra.github.io/cyberark-l2-rolebook</p>
    <h2>Education & Languages</h2>
    <p>{copy.educationValue.en}</p><p>{copy.languagesValue.en}</p>
  </main>;
}

function Portfolio() {
  const [language, setLanguage] = useState<Language>(() => preference('portfolio-language') === 'id' ? 'id' : 'en');
  const [motion, setMotion] = useState(() => {
    const stored = preference('portfolio-motion');
    return stored ? stored === 'on' : !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all');
  const [project, setProject] = useState<Project | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const menuButton = useRef<HTMLButtonElement>(null);
  const translate = (value: Localized) => value[language];

  useEffect(() => {
    document.documentElement.lang = language;
    savePreference('portfolio-language', language);
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.motion = motion ? 'on' : 'off';
  }, [motion]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = () => { if (!preference('portfolio-motion')) setMotion(!media.matches); };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    let queued = false;
    const update = () => {
      queued = false;
      let current = 'profile';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.getBoundingClientRect().top < window.innerHeight * 0.4) current = section;
      }
      setActiveSection(current);
    };
    const onScroll = () => {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (copyStatus === 'idle') return;
    const timeout = window.setTimeout(() => setCopyStatus('idle'), 3500);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(identity.email); setCopyStatus('copied'); }
    catch { setCopyStatus('failed'); }
  };

  const closeMenu = () => setMenuOpen(false);
  const visibleProjects = projects.filter(item => filter === 'all' || item.category === filter);

  return <>
    <a className="skip-link" href="#main">{translate(copy.skip)}</a>
    <header className="site-header">
      <a className="wordmark" href="#profile" aria-label="Ricko Prayudha, home" onClick={closeMenu}>RP<span className="wordmark-slash">/</span><span className="wordmark-small">RICKO<br />PRAYUDHA</span></a>
      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label={translate(text('Main navigation', 'Navigasi utama'))} id="main-navigation" onKeyDown={event => {
        if (event.key === 'Escape') { closeMenu(); menuButton.current?.focus(); }
      }}>
        {sections.map((section, index) => <a key={section} href={`#${section}`} className={activeSection === section ? 'active' : ''} aria-current={activeSection === section ? 'location' : undefined} onClick={closeMenu}><span className="nav-number">0{index + 1}</span>{translate(copy[section])}</a>)}
      </nav>
      <div className="header-tools">
        <div className="language-control" role="group" aria-label="Language / Bahasa">
          <button aria-pressed={language === 'en'} lang="en" onClick={() => setLanguage('en')}>EN</button><span aria-hidden="true">/</span><button aria-pressed={language === 'id'} lang="id" onClick={() => setLanguage('id')}>ID</button>
        </div>
        <button className="icon-button motion-button" title={translate(motion ? copy.pause : copy.play)} aria-label={translate(motion ? copy.pause : copy.play)} aria-pressed={motion} onClick={() => { savePreference('portfolio-motion', motion ? 'off' : 'on'); setMotion(!motion); }}>{motion ? <Pause size={17} /> : <Play size={17} />}</button>
        <a className="header-cv" href="/ricko-prayudha-cv.pdf" download><Download size={16} /><span>CV</span></a>
        <button ref={menuButton} className="icon-button mobile-menu" aria-expanded={menuOpen} aria-controls="main-navigation" aria-label={translate(menuOpen ? copy.closeMenu : copy.menu)} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </header>

    <main id="main">
      <section className="hero" id="profile" aria-labelledby="hero-title">
        <div className="hero-plane" aria-hidden="true" />
        <div className="hero-plane-light" aria-hidden="true" />
        <Suspense fallback={null}><NetworkScene motion={motion} /></Suspense>
        <div className="hero-index mono" aria-hidden="true">PERSONAL PORTFOLIO <span>VOL. 01 / 2026</span></div>
        <div className="hero-photo"><img src="/assets/ricko-portrait.webp" alt="Ricko Prayudha" width="354" height="577" fetchPriority="high" /><div className="photo-caption mono"><span>RICKO PRAYUDHA</span><span>IT OPERATIONS</span></div></div>
        <div className="hero-content">
          <p className="hero-eyebrow mono"><span className="tiny-cross" aria-hidden="true">+</span> {translate(copy.heroTag)}</p>
          <h1 id="hero-title"><span>RICKO</span><span>PRAYUDHA<span className="name-period">.</span></span></h1>
          <p className="hero-description">{translate(copy.intro)}</p>
          <p className="hero-detail">{translate(copy.introDetail)}</p>
          <div className="hero-actions"><a className="button button-white" href="#work">{translate(copy.explore)}<ArrowUpRight size={21} /></a><a className="hero-cv" href="/ricko-prayudha-cv.pdf" download><Download size={17} />{translate(copy.cv)}</a></div>
        </div>
        <div className="hero-bottom"><span className="mono"><MapPin size={13} />{translate(copy.based)}</span><a href="#work" aria-label={translate(copy.work)} className="scroll-link"><span className="mono">01 / 04</span><ArrowDown size={18} /></a></div>
        <span className="hero-side-label mono" aria-hidden="true">ENGINEERED WITH INTENT.</span>
      </section>

      <section className="stats-band" aria-label={translate(text('Career scope', 'Lingkup pengalaman'))}>
        <div className="stat"><strong>500<span>+</span></strong><span>{translate(copy.users)}</span></div>
        <div className="stat"><strong>07</strong><span>{translate(copy.sites)}</span></div>
        <div className="stat"><strong>24<span>/</span>7</strong><span>{translate(copy.operations)}</span></div>
        <div className="stat-note mono"><span>HANDS-ON ENGINEERING.</span><span>HUMAN-CENTERED OPERATIONS.</span><ArrowUpRight size={26} aria-hidden="true" /></div>
      </section>

      <section className="work-section section-padding" id="work" aria-labelledby="work-title">
        <div className="section-kicker"><span className="mono">01 / {translate(copy.work)}</span><span className="mono muted">2021 - 2026</span></div>
        <div className="section-heading"><h2 id="work-title">{translate(copy.workTitle)}</h2><p>{translate(copy.workIntro)}</p></div>
        <div className="work-filters" role="group" aria-label={translate(text('Filter projects', 'Filter proyek'))}>
          {(['all', 'infrastructure', 'systems', 'governance'] as const).map(item => <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{translate(copy[item])}<span>{item === 'all' ? '04' : item === 'systems' ? '02' : '01'}</span></button>)}
        </div>
        <div className="project-grid" aria-live="polite">
          {visibleProjects.map(item => <article className={`project project-${item.id}`} key={item.id}>
            <button className="project-visual" onClick={() => setProject(item)} aria-label={`${translate(copy.caseStudy)}: ${translate(item.title)}`}>
              <img src={`/assets/${item.id}.webp`} alt={translate(text(`Illustrative diagram: ${item.subtitle.en}`, `Diagram ilustratif: ${item.subtitle.id}`))} width="1100" height="650" loading="lazy" />
              <span className="project-open" aria-hidden="true"><ArrowUpRight size={23} /></span>
            </button>
            <div className="project-meta"><span className="mono">{translate(copy[item.category])}</span><span className="mono">/{item.number}</span></div>
            <h3><button onClick={() => setProject(item)}>{translate(item.title)}<ArrowUpRight size={22} /></button></h3>
            <p>{translate(item.subtitle)}</p>
            <div className="project-tags">{item.tools.slice(0, 3).map(tool => <span key={tool}>{tool}</span>)}</div>
          </article>)}
        </div>
      </section>

      <section className="experience-section section-padding" id="experience" aria-labelledby="experience-title">
        <div className="section-kicker"><span className="mono">02 / {translate(copy.experience)}</span><span className="mono muted">THE JOURNEY SO FAR</span></div>
        <div className="career-layout"><div className="career-intro"><h2 id="experience-title">{translate(copy.careerTitle)}</h2><p>{translate(copy.careerIntro)}</p><span className="career-mark" aria-hidden="true">RP /</span><a className="text-link" href="/ricko-prayudha-cv.pdf" download><Download size={17} />{translate(copy.cv)}<ArrowUpRight size={18} /></a></div>
          <div className="timeline">{experiences.map((experience, index) => <details key={experience.role} open={index === 0}>
            <summary><span className="timeline-dot" /><span className="experience-info"><span className="mono period">{translate(experience.period)}</span><span className="experience-role">{experience.role}</span><span className="company">{experience.company}<span className="company-location"> / {experience.location}</span></span></span><ChevronDown size={19} className="details-chevron" /></summary>
            <div className="experience-description"><p>{translate(experience.summary)}</p><ul>{experience.points.map((point, pointIndex) => <li key={pointIndex}>{translate(point)}</li>)}</ul></div>
          </details>)}</div>
        </div>
      </section>

      <section className="about-section section-padding" aria-labelledby="about-title">
        <div className="section-kicker"><span className="mono">03 / {translate(text('The perspective', 'Perspektif'))}</span><span className="mono">PEOPLE. SYSTEMS. PROCESS.</span></div>
        <div className="about-layout"><div><h2 id="about-title">{translate(copy.aboutTitle)}</h2><p>{translate(copy.about)}</p><p className="approach">{translate(copy.approach)}</p><div className="about-facts"><div><span className="mono">{translate(copy.education)}</span><p>{translate(copy.educationValue)}</p></div><div><span className="mono">{translate(copy.languages)}</span><p>{translate(copy.languagesValue)}</p></div></div></div>
          <div className="capabilities">{capabilities.map((capability, index) => <div className="capability" key={capability.title.en}><span className="mono">0{index + 1}</span><div><h3>{translate(capability.title)}</h3><p>{capability.tools.join(' / ')}</p></div><ArrowUpRight size={20} aria-hidden="true" /></div>)}</div>
        </div>
        <div className="learning-row"><span className="mono">{translate(copy.learning)}</span><div><h3>CyberArk L2 Rolebook</h3><p>{translate(copy.rolebook)}</p></div><a className="text-link" href="https://rickopra.github.io/cyberark-l2-rolebook/" target="_blank" rel="noopener noreferrer">{translate(copy.openRolebook)}<ExternalLink size={17} /></a></div>
      </section>

      <section className="contact-section section-padding" id="contact" aria-labelledby="contact-title">
        <div className="section-kicker"><span className="mono">04 / {translate(copy.contact)}</span><MapPin size={18} /><span className="mono">JAKARTA, ID</span></div>
        <div className="contact-layout"><h2 id="contact-title">{translate(copy.contactTitle)}</h2><div className="contact-content"><p>{translate(copy.contactIntro)}</p><a className="button button-white" href={`mailto:${identity.email}`}>{translate(copy.email)}<ArrowUpRight size={22} /></a><div className="email-row"><a href={`mailto:${identity.email}`}>{identity.email}</a><button className="icon-button" title={translate(copy.copyEmail)} aria-label={translate(copy.copyEmail)} onClick={copyEmail}>{copyStatus === 'copied' ? <Check size={17} /> : <Copy size={17} />}</button></div><p className="copy-status" role="status">{copyStatus === 'copied' ? translate(copy.copied) : copyStatus === 'failed' ? translate(copy.copyFailed) : ''}</p></div></div>
        <div className="contact-links"><a href={identity.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={18} />LinkedIn<ArrowUpRight size={17} /></a><a href={identity.github} target="_blank" rel="noopener noreferrer"><Github size={18} />GitHub<ArrowUpRight size={17} /></a><a href="/ricko-prayudha-cv.pdf" download><Download size={18} />{translate(copy.cv)}<ArrowDown size={17} /></a></div>
      </section>
    </main>
    <footer className="site-footer"><a className="footer-name" href="#profile">RICKO PRAYUDHA<span> / 2026</span></a><span>{translate(copy.footer)}</span><a href="#profile" className="icon-button" title={translate(copy.back)} aria-label={translate(copy.back)}><ArrowUp size={18} /></a></footer>
    <ProjectDialog project={project} language={language} onClose={() => setProject(null)} />
  </>;
}

export default function App() {
  return new URLSearchParams(window.location.search).has('resume') ? <Resume /> : <Portfolio />;
}
