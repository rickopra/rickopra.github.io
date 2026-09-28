import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Download, Github, Linkedin, Mail, MapPin, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { capabilities, copy, experiences, identity, projectCover, projects, text } from './content';
import type { Language, Localized, Project, ProjectCategory } from './content';
import { ProjectDialog } from './App';
import { PortfolioAudio, soundtracks } from './audio';
import type { Soundtrack } from './audio';
import SoundDeck from './SoundDeck';
import SocialLinks from './SocialLinks';
import ScreenTransition from './ScreenTransition';
import type { PortfolioScreen } from './ScreenTransition';
import './persona.css';

const TideScene = lazy(() => import('./TideScene'));
const entries = [
  { id: 'profile', label: text('PROFILE', 'PROFIL'), sub: text('The person behind the systems.', 'Sosok di balik sistem.') },
  { id: 'work', label: text('SELECTED WORK', 'KARYA PILIHAN'), sub: text('Field evidence. Systems. Operational ownership.', 'Bukti lapangan. Sistem. Tanggung jawab operasional.') },
  { id: 'experience', label: text('EXPERIENCE', 'PENGALAMAN'), sub: text('From field engineering to enterprise operations.', 'Dari rekayasa lapangan ke operasi enterprise.') },
  { id: 'skills', label: text('CAPABILITIES', 'KAPABILITAS'), sub: text('Infrastructure. Networks. Governance.', 'Infrastruktur. Jaringan. Tata kelola.') },
  { id: 'contact', label: text('CONTACT', 'KONTAK'), sub: text('The next conversation starts here.', 'Percakapan berikutnya dimulai di sini.') },
  { id: 'credits', label: text('CREDITS', 'KREDIT'), sub: text('References, assets, and the original soundtrack.', 'Referensi, aset, dan musik orisinal.') },
] as const;
type Screen = PortfolioScreen;
function read(key: string) { try { return localStorage.getItem(key); } catch { return null; } }
function save(key: string, value: string) { try { localStorage.setItem(key, value); } catch { /* Preferences are optional. */ } }
function route(): Screen {
  const hash = window.location.hash.slice(1);
  return entries.some(entry => entry.id === hash) ? hash as Screen : 'menu';
}

export default function PersonaPortfolio() {
  const [screen, setScreen] = useState<Screen>(route);
  const [selected, setSelected] = useState(0);
  const [language, setLanguage] = useState<Language>(() => read('portfolio-language') === 'id' ? 'id' : 'en');
  const [motion, setMotion] = useState(() => read('portfolio-motion') ? read('portfolio-motion') === 'on' : !matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [sound, setSound] = useState(false);
  const [track, setTrack] = useState<Soundtrack>(() => soundtracks.find(item => item.id === read('portfolio-track'))?.id ?? 'after-hours');
  const [volume, setVolume] = useState(() => {
    const value = Number(read('portfolio-volume') ?? 30);
    return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 30;
  });
  const [audioError, setAudioError] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all');
  const [career, setCareer] = useState(0);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const audio = useRef<PortfolioAudio | null>(null);
  const audioRequest = useRef(0);
  const soundWanted = useRef(false);
  const menu = useRef<HTMLElement>(null);
  const panelTitle = useRef<HTMLHeadingElement>(null);
  const careerDetail = useRef<HTMLElement>(null);
  const lastScreen = useRef(screen);
  const t = (value: Localized) => value[language];
  const current = entries.find(entry => entry.id === screen);
  const startAudio = useCallback(async () => {
    const request = ++audioRequest.current;
    try {
      await audio.current?.start();
      if (request !== audioRequest.current || !soundWanted.current) return;
      if (document.hidden) audio.current?.pause();
      setSound(true); setAudioError(false);
    } catch {
      if (request !== audioRequest.current) return;
      soundWanted.current = false;
      setAudioError(true); setSound(false);
    }
  }, []);

  useEffect(() => {
    audio.current = new PortfolioAudio();
    return () => { audioRequest.current++; soundWanted.current = false; audio.current?.dispose(); audio.current = null; };
  }, []);
  useEffect(() => { document.documentElement.lang = language; save('portfolio-language', language); }, [language]);
  useEffect(() => { document.documentElement.dataset.motion = motion ? 'on' : 'off'; }, [motion]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { if (!read('portfolio-motion')) setMotion(!media.matches); };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => { audio.current?.volume(volume / 100); save('portfolio-volume', String(volume)); }, [volume]);
  useEffect(() => { audio.current?.selectTrack(track); save('portfolio-track', track); }, [track]);
  useEffect(() => {
    const update = () => { setScreen(route()); setProject(null); };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  useEffect(() => {
    if (lastScreen.current !== screen) {
      if (screen === 'menu') menu.current?.querySelectorAll<HTMLAnchorElement>('a')[selected]?.focus();
      else panelTitle.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
      lastScreen.current = screen;
    }
    document.title = `Ricko Prayudha | ${screen === 'menu' ? 'IT Operations & Infrastructure' : t(current!.label)}`;
  }, [screen, selected, language, current]);
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) { audioRequest.current++; audio.current?.pause(); }
      else if (soundWanted.current) void startAudio();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [startAudio]);
  useEffect(() => {
    if (copyStatus === 'idle') return;
    const timer = window.setTimeout(() => setCopyStatus('idle'), 3500);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  const go = (next: Screen) => {
    audio.current?.cue(next === 'menu' ? 'back' : 'confirm');
    window.location.hash = next;
  };
  const choose = (index: number) => { if (index !== selected) audio.current?.cue('select'); setSelected(index); };
  const toggleSound = async () => {
    if (soundWanted.current) { audioRequest.current++; soundWanted.current = false; audio.current?.pause(); setSound(false); return; }
    soundWanted.current = true;
    await startAudio();
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || project) return;
      if (event.key === 'Escape' && screen !== 'menu') { event.preventDefault(); go('menu'); }
      const target = event.target as HTMLElement;
      if (screen !== 'menu' || (target !== document.body && !menu.current?.contains(target))) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const next = (selected + (event.key === 'ArrowDown' ? 1 : -1) + entries.length) % entries.length;
        choose(next); menu.current?.querySelectorAll<HTMLAnchorElement>('a')[next]?.focus();
      }
      if (event.key === 'Enter' && target === document.body) go(entries[selected].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const gamepadAction = useRef<(key: string) => void>(() => {});
  gamepadAction.current = key => {
    if (document.hidden) return;
    if (key === 'back') { if (project) setProject(null); else go('menu'); return; }
    if (screen !== 'menu' || project) {
      const scope = project ? document.querySelector('.case-dialog') : document.querySelector('.file-screen');
      const controls = Array.from(scope?.querySelectorAll<HTMLElement>('button, a[href]') ?? []).filter(element => element.getBoundingClientRect().width > 0);
      if (key === 'confirm') { if (controls.includes(document.activeElement as HTMLElement)) (document.activeElement as HTMLElement).click(); return; }
      const index = controls.indexOf(document.activeElement as HTMLElement);
      controls[(index + (key === 'down' ? 1 : -1) + controls.length) % controls.length]?.focus();
      return;
    }
    if (key === 'confirm') { go(entries[selected].id); return; }
    const next = (selected + (key === 'down' ? 1 : -1) + entries.length) % entries.length;
    choose(next); menu.current?.querySelectorAll<HTMLAnchorElement>('a')[next]?.focus();
  };
  useEffect(() => {
    let frame = 0;
    let previous = '';
    const poll = () => {
      const pad = Array.from(navigator.getGamepads?.() ?? []).find(Boolean);
      if (!pad) { frame = 0; return; }
      const key = pad.buttons[1]?.pressed ? 'back' : pad.buttons[0]?.pressed ? 'confirm' : pad.buttons[12]?.pressed || pad.axes[1] < -0.6 ? 'up' : pad.buttons[13]?.pressed || pad.axes[1] > 0.6 ? 'down' : '';
      if (key && key !== previous) gamepadAction.current(key);
      previous = key;
      frame = requestAnimationFrame(poll);
    };
    const connect = () => { if (!frame) frame = requestAnimationFrame(poll); };
    window.addEventListener('gamepadconnected', connect);
    connect();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('gamepadconnected', connect); };
  }, []);

  const visibleProjects = projects.filter(item => filter === 'all' || item.category === filter);
  const openProject = (item: Project) => { audio.current?.cue('confirm'); setProject(item); };
  const selectCareer = (index: number) => {
    setCareer(index); audio.current?.cue('select');
    if (matchMedia('(max-width: 900px)').matches) requestAnimationFrame(() => careerDetail.current?.focus());
  };
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(identity.email); setCopyStatus('copied'); }
    catch { setCopyStatus('failed'); }
  };

  return <div className={`persona-app ${screen === 'menu' ? 'at-menu' : 'in-file'}`} data-screen={screen}>
    <a className="skip-link" href={screen === 'menu' ? '#main-menu' : '#file-content'} onClick={event => {
      event.preventDefault();
      if (screen === 'menu') menu.current?.focus();
      else document.getElementById('file-content')?.focus();
    }}>{t(copy.skip)}</a>
    <Suspense fallback={null}><TideScene motion={motion} /></Suspense>
    <div className="scene-planes" aria-hidden="true"><i /><i /><i /></div>
    <div className="portrait-stage" aria-hidden="true"><div className="portrait-echo" /><img src="/assets/ricko-portrait-menu.webp" alt="" width="354" height="1246" fetchPriority="high" /></div>
    <div className="scene-word" aria-hidden="true">RELOAD<br />YOUR PERSPECTIVE.</div>

    <header className="p-header">
      <a className="p-wordmark" href="#menu" onClick={() => audio.current?.cue('back')} aria-label="Ricko Prayudha, main menu">RP<span>/</span><small>PERSONAL<br />PORTFOLIO</small></a>
      <div className="p-tools">
        <div className="p-languages" role="group" aria-label="Language / Bahasa"><button onClick={() => setLanguage('en')} aria-pressed={language === 'en'} lang="en">EN</button><button onClick={() => setLanguage('id')} aria-pressed={language === 'id'} lang="id">ID</button></div>
        <button className="p-icon" onClick={() => { save('portfolio-motion', motion ? 'off' : 'on'); setMotion(!motion); }} aria-label={t(motion ? copy.pause : copy.play)} title={t(motion ? copy.pause : copy.play)}>{motion ? <Pause size={19} /> : <Play size={19} />}</button>
        <a className="p-cv" href="/ricko-prayudha-cv.pdf" download aria-label={t(copy.cv)}><Download size={17} /><span>CV</span></a>
      </div>
    </header>

    {screen === 'menu' ? <main className="menu-screen" key="menu">
      <div className="owner-heading"><span className="p-label">IT OPERATIONS / INFRASTRUCTURE</span><h1>RICKO<br /><span>PRAYUDHA</span></h1><span className="owner-location"><MapPin size={12} />JAKARTA, INDONESIA</span></div>
      <div className="menu-composition">
        <p className="menu-kicker"><span>PORTFOLIO</span> / 2026</p>
        <nav className="persona-menu" id="main-menu" ref={menu} tabIndex={-1} aria-label={t(text('Main menu', 'Menu utama'))}>
          {entries.map((entry, index) => <a className={`persona-option option-${index} ${selected === index ? 'selected' : ''}`} href={`#${entry.id}`} aria-label={t(entry.label)} key={entry.id} onPointerEnter={() => choose(index)} onFocus={() => choose(index)} onClick={() => audio.current?.cue('confirm')}>
            <span className="option-index" aria-hidden="true">0{index + 1}</span><span className="option-label" data-label={t(entry.label)}>{t(entry.label)}</span><ArrowRight className="option-arrow" size={25} aria-hidden="true" />
          </a>)}
        </nav>
        <p className="menu-description" aria-live="polite"><span>0{selected + 1}</span>{t(entries[selected].sub)}</p>
      </div>
      <div className="identity-strip"><span className="identity-name">RICKO PRAYUDHA</span><span>NETWORKS / SYSTEMS / PEOPLE</span></div>
      <div className="menu-metrics" aria-label={t(text('Career scope', 'Lingkup pengalaman'))}><span><strong>500+</strong>{t(text('USERS', 'PENGGUNA'))}</span><span><strong>07</strong>{t(text('BGP SITES', 'LOKASI BGP'))}</span><span><strong>24/7</strong>{t(text('OPERATIONS', 'OPERASIONAL'))}</span></div>
    </main> : <main key={screen} className={`file-screen screen-${screen}`}>
      <header className="file-heading"><button className="p-back" onClick={() => go('menu')} title={t(text('Back to menu', 'Kembali ke menu'))} aria-label={t(text('Back to menu', 'Kembali ke menu'))}><ArrowLeft size={25} /></button><div><span className="p-label">RICKO PRAYUDHA / 0{entries.findIndex(entry => entry.id === screen) + 1}</span><h1 ref={panelTitle} tabIndex={-1}>{t(current!.label)}</h1></div><a className="file-next" href={`#${entries[(entries.findIndex(entry => entry.id === screen) + 1) % entries.length].id}`} title={t(text('Next section', 'Bagian berikutnya'))} aria-label={t(text('Next section', 'Bagian berikutnya'))}><ArrowRight size={22} /></a></header>
      <div className="file-content" id="file-content" tabIndex={-1}>
        {screen === 'profile' && <div className="profile-file">
          <div className="profile-photo"><img src="/assets/ricko-portrait.webp" alt="Ricko Prayudha" width="853" height="1280" /><span>IT OPERATIONS</span></div>
          <div className="profile-copy"><span className="file-tag">JAKARTA, INDONESIA</span><h2>Ricko Prayudha</h2><p className="file-lead">{t(copy.intro)}</p><p>{t(copy.about)}</p><p>{t(copy.approach)}</p>
            <dl className="profile-facts"><div><dt>{t(copy.education)}</dt><dd>{t(copy.educationValue)}</dd></div><div><dt>{t(copy.languages)}</dt><dd>{t(copy.languagesValue)}</dd></div></dl>
            <div className="file-actions"><a className="p-command" href="#work">{t(copy.explore)}<ArrowUpRight size={18} /></a><a className="p-command secondary" href="/ricko-prayudha-cv.pdf" download><Download size={18} />{t(copy.cv)}</a></div>
          </div>
        </div>}
        {screen === 'work' && <>
          <p className="file-intro">{t(copy.workIntro)}</p>
          <div className="case-filters" role="group" aria-label={t(text('Filter projects', 'Filter proyek'))}>{(['all', 'infrastructure', 'systems', 'governance'] as const).map(category => <button key={category} aria-pressed={filter === category} onClick={() => { setFilter(category); audio.current?.cue('select'); }}>{t(copy[category])}<span>{category === 'all' ? projects.length : projects.filter(item => item.category === category).length}</span></button>)}</div>
          <div className="case-list">{visibleProjects.map(item => <article className="case-file" key={item.id}><button className="case-trigger" onClick={() => openProject(item)} aria-label={`${t(copy.caseStudy)}: ${t(item.title)}`}><img src={projectCover(item).src} alt={t(projectCover(item).alt)} width={projectCover(item).width} height={projectCover(item).height} loading="lazy" /><span className="case-number">{item.number}</span><span className="case-summary"><small>{t(copy[item.category])}</small><strong>{t(item.title)}</strong><span>{t(item.subtitle)}</span><span className="case-tools">{item.tools.slice(0, 4).join(' / ')}</span></span><ArrowUpRight className="case-arrow" size={28} /></button></article>)}</div>
        </>}
        {screen === 'experience' && <div className="career-file">
          <div className="career-list" role="group" aria-label={t(copy.experience)}>{experiences.map((item, index) => <button key={item.role} aria-pressed={career === index} aria-controls="career-detail" onClick={() => selectCareer(index)}><span className="career-number">0{index + 1}</span><span><small>{t(item.period)}</small><strong>{item.role}</strong><span>{item.company}</span></span><ArrowRight size={18} /></button>)}</div>
          <article id="career-detail" className="career-detail" key={career} ref={careerDetail} tabIndex={-1} aria-labelledby="career-title">
            <span className="file-tag">{t(experiences[career].period)}</span><h2 id="career-title">{experiences[career].role}</h2><p className="career-company">{experiences[career].company} / {experiences[career].location}</p><p className="file-lead">{t(experiences[career].summary)}</p>
            {experiences[career].sections.map(section => <section className="career-section" key={section.title.en}><h3>{t(section.title)}</h3><ul>{section.points.map(point => <li key={point.en}>{t(point)}</li>)}</ul></section>)}
            <section className="career-section"><h3>{t(copy.tools)}</h3><div className="skill-tags">{experiences[career].tools.map(tool => <span key={tool}>{tool}</span>)}</div></section>
            {experiences[career].projectIds.length > 0 && <section className="career-section career-projects"><h3>{t(text('Related case files', 'Studi kasus terkait'))}</h3>{experiences[career].projectIds.map(id => {
              const item = projects.find(item => item.id === id)!;
              return <button key={id} onClick={() => { setProject(item); audio.current?.cue('confirm'); }} aria-label={`${t(copy.caseStudy)}: ${t(item.title)}`}><span className="mono">{item.number}</span><span>{t(item.title)}</span><ArrowUpRight size={19} /></button>;
            })}</section>}
            <a className="p-command" href="/ricko-prayudha-cv.pdf" download><Download size={17} />{t(copy.cv)}</a>
          </article>
        </div>}
        {screen === 'skills' && <div className="skills-file"><div className="capability-list">{capabilities.map((item, index) => <section key={item.title.en}><span>0{index + 1}</span><div><h2>{t(item.title)}</h2><div className="skill-tags">{item.tools.map(tool => <span key={tool}>{tool}</span>)}</div></div></section>)}</div></div>}
        {screen === 'contact' && <div className="contact-file"><div><span className="file-tag">JAKARTA, INDONESIA</span><h2>{t(text("LET'S TALK.", 'MARI BICARA.'))}</h2><p className="file-lead">{t(copy.contactIntro)}</p><a className="contact-email" href={`mailto:${identity.email}`}>{identity.email}<ArrowUpRight size={22} /></a><button className="p-command secondary" onClick={copyEmail}>{copyStatus === 'copied' ? <Check size={17} /> : <Copy size={17} />}{t(copy.copyEmail)}</button><p className="p-status" role="status">{copyStatus === 'copied' ? t(copy.copied) : copyStatus === 'failed' ? t(copy.copyFailed) : ''}</p></div><div className="contact-destinations"><a href={`mailto:${identity.email}`}><Mail /><span>{t(copy.email)}</span><ArrowUpRight /></a><a href={identity.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin /><span>LinkedIn</span><ArrowUpRight /></a><a href={identity.github} target="_blank" rel="noopener noreferrer"><Github /><span>GitHub</span><ArrowUpRight /></a><SocialLinks language={language} /><a href="/ricko-prayudha-cv.pdf" download><Download /><span>{t(copy.cv)}</span><ArrowUpRight /></a></div></div>}
        {screen === 'credits' && <div className="credits-file"><section><span className="file-tag">01 / ART DIRECTION</span><h2>Persona 3 Reload</h2><p>{t(text('Visual reference: the menu design of Persona 3 Reload by ATLUS / SEGA. This is an independent professional portfolio, not an official or affiliated website.', 'Referensi visual: desain menu Persona 3 Reload oleh ATLUS / SEGA. Ini portfolio profesional independen, bukan situs resmi atau terafiliasi.'))}</p><a href="https://persona3.fayq.my.id/" target="_blank" rel="noopener noreferrer">Fawwaz / Vloits: {t(text('web reference', 'referensi web'))}<ArrowUpRight size={16} /></a><a href="https://github.com/blairxu13/persona3-website" target="_blank" rel="noopener noreferrer">blairxu13 / persona3-website<ArrowUpRight size={16} /></a><a href="https://personacentral.com/p3r-interview-menu-ui/" target="_blank" rel="noopener noreferrer">Persona Central: {t(text('UI development interview', 'wawancara pengembangan UI'))}<ArrowUpRight size={16} /></a></section><section><span className="file-tag">02 / SOUNDTRACK</span><h2>After Hours / Blue Current</h2><p>{t(text('Two original instrumental loops: electric keys, syncopated bass, drums, and a restrained lead. Composed for this portfolio. No game audio or sampled recordings.', 'Dua loop instrumental orisinal: electric keys, bass sinkopasi, drum, dan lead. Dibuat untuk portfolio ini. Tidak menggunakan audio game atau sampel rekaman.'))}</p><button className="p-command" onClick={toggleSound}>{sound ? <VolumeX size={18} /> : <Volume2 size={18} />}{t(text(sound ? 'Mute soundtrack' : 'Play soundtrack', sound ? 'Bisukan musik' : 'Putar musik'))}</button></section><section><span className="file-tag">03 / ASSETS & SOURCE</span><h2>Ricko Prayudha</h2><p>{t(text('Owner portrait and curated field photographs from the owner archive. Original illustrative project diagrams. Anton, Barlow Condensed, DM Sans, IBM Plex Mono via Fontsource. Lucide icons. React and Three.js.', 'Portrait pemilik dan foto lapangan pilihan dari arsip pemilik. Diagram proyek ilustratif orisinal. Anton, Barlow Condensed, DM Sans, IBM Plex Mono melalui Fontsource. Ikon Lucide. React dan Three.js.'))}</p><a href="https://github.com/rickopra/rickopra.github.io" target="_blank" rel="noopener noreferrer">GitHub / {t(text('source & documentation', 'kode & dokumentasi'))}<ArrowUpRight size={16} /></a></section></div>}
      </div>
    </main>}

    <footer className="p-footer"><SoundDeck audio={audio} playing={sound} motion={motion} language={language} track={track} volume={volume} onToggle={toggleSound} onTrack={setTrack} onVolume={setVolume} /><span className="audio-error" role="status">{audioError ? t(text('Audio unavailable. Try again.', 'Audio tidak tersedia. Coba lagi.')) : ''}</span><span className="footer-edition">PERSONAL ARCHIVE <b>/</b> 2026</span><a className="footer-contact" href={`mailto:${identity.email}`} aria-label={t(copy.email)} title={t(copy.email)}><Mail size={19} /></a></footer>
    <ScreenTransition screen={screen} key={`transition-${screen}`} />
    <ProjectDialog project={project} language={language} onClose={() => { audio.current?.cue('back'); setProject(null); }} />
  </div>;
}
