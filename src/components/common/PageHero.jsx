import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Reveal, WordReveal } from './Reveal';
import { site } from '@/lib/site';

/**
 * Shared banner for every inner page: breadcrumb, title, lede.
 *
 * Optionally takes a background photograph (`image`). Without one it falls back
 * to the blueprint grid, so pages that have no natural hero art still get a
 * composed masthead rather than an empty band.
 */
export function PageHero({ eyebrow, title, subtitle, breadcrumbs = [], image, children }) {
  const plate = image ?? site.hero?.slides?.[1];

  return (
    <section className="relative overflow-hidden bg-ink-950 pt-[70px] text-white">
      {plate && (
        <div aria-hidden="true" className="absolute inset-0">
          <img src={plate} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-ink-950/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/55" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-950 to-transparent" />
        </div>
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-grid-lines bg-[size:56px_56px] opacity-[0.1]" />
      <div aria-hidden="true" className="pointer-events-none absolute -end-24 -top-16 h-72 w-72 rounded-full bg-brand-600/15 blur-3xl" />

      <div className="container-x relative pb-10 pt-14 sm:pb-12 sm:pt-20 lg:pb-14 lg:pt-24">
        {breadcrumbs.length > 0 && (
          <Reveal y={12}>
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[11px] uppercase tracking-[0.1em] text-white/40">
              <Link to="/" className="transition-colors hover:text-brand-300">Home</Link>
              {breadcrumbs.map((b) => (
                <span key={b.label} className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3" />
                  {b.to ? (
                    <Link to={b.to} className="transition-colors hover:text-brand-300">{b.label}</Link>
                  ) : (
                    <span className="text-white/70">{b.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </Reveal>
        )}

        <Reveal delay={0.05}>
          {eyebrow && (
            <span className="eyebrow mt-6">
              <span className="h-px w-10 bg-brand-500" />
              {eyebrow}
            </span>
          )}
        </Reveal>

        <h1 className="mt-5 font-display text-[2.1rem] font-medium leading-[1.08] tracking-[-0.015em] text-balance sm:text-5xl lg:text-[3.6rem]">
          <WordReveal text={title} inView />
        </h1>

        {subtitle && (
          <Reveal delay={0.18}>
            <p className="mt-5 max-w-2xl text-[15px] leading-[1.9] text-white/60 text-pretty">{subtitle}</p>
          </Reveal>
        )}

        {children && <Reveal delay={0.24} className="mt-9">{children}</Reveal>}
      </div>
    </section>
  );
}
