import { Reveal } from './Reveal';

export function SectionHeading({ eyebrow, title, subtitle, align = 'center', light = false }) {
  const centered = align === 'center';
  return (
    <Reveal className={`max-w-3xl ${centered ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <span className={`eyebrow ${light ? 'text-brand-300' : ''}`}>
          <span className={`h-px w-6 ${light ? 'bg-brand-300' : 'bg-brand-600 dark:bg-brand-400'}`} />
          {eyebrow}
        </span>
      )}
      <h2 className={`mt-3 h-section text-balance ${light ? 'text-white dark:text-white' : ''}`}>{title}</h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed text-pretty ${light ? 'text-white/70' : 'muted'}`}>{subtitle}</p>
      )}
    </Reveal>
  );
}
