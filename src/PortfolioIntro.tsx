import { useEffect, useRef } from 'react';
import { SkipForward } from 'lucide-react';
import type { Language } from './content';
import './intro.css';

export function shouldPlayIntro() {
  if (window.location.hash && window.location.hash !== '#menu') return false;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try { if (localStorage.getItem('portfolio-motion') === 'off') return false; } catch { /* Preferences are optional. */ }
  try { return sessionStorage.getItem('portfolio-intro-seen') !== '1'; } catch { return true; }
}

export default function PortfolioIntro({ onComplete }: { onComplete: (skipped?: boolean) => void }) {
  const skip = useRef<HTMLButtonElement>(null);
  let language: Language = 'en';
  try { if (localStorage.getItem('portfolio-language') === 'id') language = 'id'; } catch { /* Default to English. */ }
  const skipLabel = language === 'id' ? 'Lewati intro' : 'Skip intro';

  useEffect(() => {
    skip.current?.focus({ preventScroll: true });
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const finish = () => onComplete();
    // A bounded fallback keeps the portfolio reachable if CSS animation events never arrive.
    const timer = window.setTimeout(finish, 4000);
    media.addEventListener('change', finish);
    window.addEventListener('hashchange', finish);
    return () => {
      clearTimeout(timer);
      media.removeEventListener('change', finish);
      window.removeEventListener('hashchange', finish);
    };
  }, [onComplete]);

  return <div className="portfolio-intro" role="dialog" aria-modal="true" aria-label={language === 'id' ? 'Ricko Prayudha, pembuka portfolio' : 'Ricko Prayudha, portfolio opening'} lang={language}
    onAnimationEnd={event => { if (event.target === event.currentTarget && event.animationName === 'intro-depart') onComplete(); }}
    onKeyDown={event => {
      event.stopPropagation();
      if (event.key === 'Escape') { event.preventDefault(); onComplete(true); }
      if (event.key === 'Tab') { event.preventDefault(); skip.current?.focus(); }
    }}>
    <div className="intro-art" aria-hidden="true">
      <div className="intro-blue-plane" />
      <div className="intro-light-plane" />
      <div className="intro-portrait"><img src="/assets/ricko-portrait.webp" alt="" width="853" height="1280" fetchPriority="high" /></div>
      <div className="intro-aperture"><i /><i /></div>
      <div className="intro-slash" />
      <div className="intro-monogram"><img src="/assets/rp-monogram.svg" alt="" width="128" height="128" /></div>
      <div className="intro-identity"><p className="intro-name"><span><b>RICKO</b></span><span><b>PRAYUDHA</b></span></p><p className="intro-specialty">L2 SUPPORT / CYBERARK PAM</p></div>
      <span className="intro-signature">RP / PERSONAL PORTFOLIO</span>
      <span className="intro-location">JAKARTA, INDONESIA</span>
    </div>
    <button ref={skip} className="intro-skip" onClick={() => onComplete(true)} title={skipLabel}><span>{skipLabel}</span><SkipForward size={18} aria-hidden="true" /></button>
  </div>;
}
