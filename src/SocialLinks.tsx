import { ArrowUpRight, Facebook, Instagram, Twitter } from 'lucide-react';
import { identity } from './content';

export default function SocialLinks() {
  return <>
    <a className="social-link" href={identity.instagram} target="_blank" rel="noopener noreferrer">
      <Instagram size={18} aria-hidden="true" /><span>Instagram</span><ArrowUpRight size={17} aria-hidden="true" />
    </a>
    <a className="social-link" href={identity.facebook} target="_blank" rel="noopener noreferrer">
      <Facebook size={18} aria-hidden="true" /><span>Facebook</span><ArrowUpRight size={17} aria-hidden="true" />
    </a>
    <a className="social-link" href={identity.x} target="_blank" rel="noopener noreferrer">
      <Twitter size={18} aria-hidden="true" /><span>X / Twitter</span><ArrowUpRight size={17} aria-hidden="true" />
    </a>
  </>;
}
