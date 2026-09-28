import { ArrowUpRight, Facebook, Instagram, Twitter } from 'lucide-react';
import { identity } from './content';
import type { Language } from './content';

export default function SocialLinks({ language }: { language: Language }) {
  return <>
    <a className="social-link" href={identity.instagram} target="_blank" rel="noopener noreferrer">
      <Instagram size={18} aria-hidden="true" /><span>Instagram<small>{identity.instagramHandle}</small></span><ArrowUpRight size={17} aria-hidden="true" />
    </a>
    <a className="social-link" href={identity.facebookSearch} target="_blank" rel="noopener noreferrer">
      <Facebook size={18} aria-hidden="true" /><span>Facebook<small>{identity.name} / {language === 'id' ? 'Cari profil' : 'Find profile'}</small></span><ArrowUpRight size={17} aria-hidden="true" />
    </a>
    <a className="social-link" href={identity.x} target="_blank" rel="noopener noreferrer">
      <Twitter size={18} aria-hidden="true" /><span>X / Twitter<small>{identity.xHandle}</small></span><ArrowUpRight size={17} aria-hidden="true" />
    </a>
  </>;
}
