import { Link } from 'react-router-dom';
import { ShieldCheck, Landmark, FileCheck2, CalendarClock, Ruler, Scale, ArrowRight } from 'lucide-react';
import { rera, site } from '@/lib/site';
import { SectionHeading } from '@/components/common/SectionHeading';
import { RevealGroup, RevealItem, Reveal } from '@/components/common/Reveal';

const ICONS = { ShieldCheck, Landmark, FileCheck2, CalendarClock, Ruler, Scale };

export function ReraStrip() {
  return (
    <section className="relative overflow-hidden bg-white py-16 dark:bg-ink-950 sm:py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Compliance"
          title={rera.headline}
          subtitle={rera.intro}
        />

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {rera.commitments.map((c) => {
            const Icon = ICONS[c.icon] ?? ShieldCheck;
            return (
              <RevealItem key={c.title} className="h-full">
                <div className="group flex h-full gap-4 rounded-2xl border border-ink-100 bg-white p-5 transition-all duration-400 hover:-translate-y-1 hover:border-brand-300 hover:shadow-soft dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-700">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-400 group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950 dark:text-brand-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-ink-900 dark:text-white">{c.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">{c.text}</p>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal className="mt-10" delay={0.1}>
          <div className="relative overflow-hidden rounded-2xl bg-ink-950 p-7 sm:p-9">
            <div aria-hidden="true" className="absolute inset-0 bg-grid-lines bg-[size:44px_44px] opacity-[0.16]" />
            <div aria-hidden="true" className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full bg-brand-600/20 blur-3xl" />

            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-400">
                  {rera.authority}
                </p>
                <p className="mt-2 font-display text-xl font-extrabold text-white sm:text-2xl">
                  Promoter Registration {rera.promoterRegistration}
                </p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
                  Do not take our word for it. Search that number on the authority portal and read
                  our filings for yourself, before you pay anyone a rupee.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-2.5 sm:items-end">
                <a
                  href={rera.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary whitespace-nowrap"
                >
                  Verify on GujRERA
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  to="/rera"
                  className="text-center text-xs font-bold text-white/60 transition-colors hover:text-brand-300 sm:text-end"
                >
                  See all {rera.certificates.length} project registrations
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
