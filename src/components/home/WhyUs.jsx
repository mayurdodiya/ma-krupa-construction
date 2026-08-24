import { Link } from 'react-router-dom';
import {
  ShieldCheck, CalendarCheck, HardHat, Eye, Recycle, Users, ArrowRight,
} from 'lucide-react';
import { about, site } from '@/lib/site';
import { SectionHeading } from '@/components/common/SectionHeading';
import { RevealGroup, RevealItem, Parallax } from '@/components/common/Reveal';

const ICONS = { ShieldCheck, CalendarCheck, HardHat, Eye, Recycle, Users };

export function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-white py-16 dark:bg-ink-950 sm:py-20 lg:py-24">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Sticky intro column */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                align="left"
                eyebrow="Why Ma Krupa"
                title="Six things we refuse to compromise on"
                subtitle={about.mission}
              />

              <Parallax speed={26} className="mt-8 hidden lg:block">
                <div className="relative overflow-hidden rounded-2xl border border-ink-100 bg-ink-950 p-6 dark:border-ink-800">
                  <div aria-hidden="true" className="absolute inset-0 bg-grid-lines bg-[size:40px_40px] opacity-20" />
                  <div className="relative">
                    <p className="font-display text-4xl font-extrabold text-white">2.4</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand-400">
                      Months ahead, on average
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">
                      Across 48 delivered projects, our average handover has landed ahead of the
                      date written into the registered agreement.
                    </p>
                  </div>
                </div>
              </Parallax>

              <Link to="/about" className="btn-outline mt-6">
                Read our story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Value grid */}
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:col-span-8" stagger={0.07}>
            {about.values.map((v) => {
              const Icon = ICONS[v.icon] ?? ShieldCheck;
              return (
                <RevealItem key={v.title} className="h-full">
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 transition-all duration-400 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-glow dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-700">
                    {/* Gold wash that sweeps in from the corner on hover. */}
                    <span
                      aria-hidden="true"
                      className="absolute -end-16 -top-16 h-32 w-32 rounded-full bg-brand-500/10 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-150"
                    />
                    <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-all duration-400 group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950 dark:text-brand-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="relative mt-4 font-display text-base font-extrabold text-ink-900 dark:text-white">
                      {v.title}
                    </h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400">{v.text}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>

        {/* USP marquee */}
        <div className="mt-14 overflow-hidden rounded-xl border border-ink-100 bg-ink-50 py-3.5 dark:border-ink-800 dark:bg-ink-900/60">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
            {[...site.usp, ...site.usp].map((u, i) => (
              <span key={`${u}-${i}`} className="inline-flex items-center gap-3 text-sm font-semibold text-ink-600 dark:text-ink-300">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                {u}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
