export type PortfolioScreen = 'menu' | 'profile' | 'work' | 'experience' | 'skills' | 'contact' | 'credits';

const variants = {
  menu: 'return',
  profile: 'portrait',
  work: 'dossier',
  experience: 'dossier',
  skills: 'signal',
  contact: 'signal',
  credits: 'signal',
} as const;

export default function ScreenTransition({ screen }: { screen: PortfolioScreen }) {
  return <div className={`screen-transition transition-${variants[screen]}`} data-variant={variants[screen]} aria-hidden="true"><i /><i /><i /></div>;
}
