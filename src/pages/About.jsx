import { Link } from 'react-router-dom';
import {
  ShieldCheck, CalendarCheck, HardHat, Eye, Recycle, Users,
  Search, PenTool, FileSignature, ClipboardCheck, KeyRound, ArrowRight, Target, Compass,
} from 'lucide-react';
import { about, site } from '@/lib/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHero } from '@/components/common/PageHero';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Reveal, RevealGroup, RevealItem } from '@/components/common/Reveal';
import { Counter } from '@/components/common/Counter';
import { BrandFilm } from '@/components/about/BrandFilm';

const VALUE_ICONS = { ShieldCheck, CalendarCheck, HardHat, Eye, Recycle, Users };
const STEP_ICONS = { Search, PenTool, FileSignature, HardHat, ClipboardCheck, KeyRound };

export default function About() {
  usePageMeta(
    `About Us — ${site.name}`,
    'Twenty-one years, 48 delivered projects and 32 lakh sq.ft. developed. The story, values and process behind Ma Krupa Construction.',
  );

  return (
    <>
      <PageHero
        image="/images/about/team.jpg"
        eyebrow={`Since ${site.foundedYear}`}
        title="Built by engineers, not by brochures"
        subtitle={site.intro}
        breadcrumbs={[{ label: 'About' }]}
      >
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-4">
          {site.stats.map((s) => (
            <div key={s.label} className="bg-ink-950/70 px-4 py-4">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/45">{s.label}</dt>
              <dd className="mt-0.5 font-display text-2xl font-extrabold text-white">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* Story */}
      <section className="bg-white py-14 dark:bg-ink-950 sm:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading align="left" eyebrow="Our Story" title="One promise, kept for twenty-one years" />
            <div className="mt-6 space-y-4">
              {about.story.map((p) => (
                <Reveal key={p.slice(0, 24)}>
                  <p className="text-base leading-relaxed text-ink-600 text-pretty dark:text-ink-300">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="space-y-4 lg:col-span-5">
            <Reveal className="rounded-2xl border border-ink-100 bg-ink-50/60 p-6 dark:border-ink-800 dark:bg-ink-900/40">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white">
                <Target className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-extrabold text-ink-900 dark:text-white">Mission</h3>
              <p className="mt-2 text-sm leading-relaxed muted">{about.mission}</p>
            </Reveal>

            <Reveal delay={0.08} className="rounded-2xl border border-ink-100 bg-ink-50/60 p-6 dark:border-ink-800 dark:bg-ink-900/40">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-900 text-brand-400 dark:bg-white dark:text-brand-600">
                <Compass className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-extrabold text-ink-900 dark:text-white">Vision</h3>
              <p className="mt-2 text-sm leading-relaxed muted">{about.vision}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-ink-50 py-14 dark:bg-ink-900/40 sm:py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Milestones"
            title="From one weaving shed to four verticals"
            subtitle="Growth here has been deliberate. We have turned down more work than we have taken, to keep the delivery promise intact."
          />

          <div className="relative mt-12">
            <span aria-hidden="true" className="absolute start-4 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-brand-500/40 to-transparent sm:block" />

            <RevealGroup className="space-y-5" stagger={0.08}>
              {about.timeline.map((t) => (
                <RevealItem key={t.year}>
                  <div className="group relative flex gap-5 sm:ps-12">
                    <span aria-hidden="true" className="absolute start-[9px] top-6 hidden h-3.5 w-3.5 rounded-full border-2 border-brand-500 bg-white transition-transform duration-300 group-hover:scale-125 sm:block dark:bg-ink-950" />
                    <div className="flex-1 rounded-2xl border border-ink-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-soft dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-700 sm:flex sm:items-start sm:gap-6">
                      <span className="font-display text-2xl font-extrabold text-brand-600 dark:text-brand-400 sm:w-20 sm:shrink-0">
                        {t.year}
                      </span>
                      <span className="mt-2 block sm:mt-0">
                        <span className="block font-display text-base font-extrabold text-ink-900 dark:text-white">{t.title}</span>
                        <span className="mt-1 block text-sm leading-relaxed muted">{t.text}</span>
                      </span>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-14 dark:bg-ink-950 sm:py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="What We Stand For"
            title="Six things we refuse to compromise on"
          />
          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {about.values.map((v) => {
              const Icon = VALUE_ICONS[v.icon] ?? ShieldCheck;
              return (
                <RevealItem key={v.title} className="h-full">
                  <div className="group h-full rounded-2xl border border-ink-100 bg-white p-6 transition-all duration-400 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-glow dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-700">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-all duration-400 group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950 dark:text-brand-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-display text-base font-extrabold text-ink-900 dark:text-white">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed muted">{v.text}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Process */}
      <section className="relative overflow-hidden bg-ink-950 py-14 text-white sm:py-16">
        <div aria-hidden="true" className="absolute inset-0 bg-grid-lines bg-[size:56px_56px] opacity-[0.14]" />
        <div className="container-x relative">
          <SectionHeading
            light
            eyebrow="How We Work"
            title="Six steps from first enquiry to handover"
            subtitle="No stage is a black box. You know what happens next, who owns it and what it costs, before it starts."
          />

          <RevealGroup className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {about.process.map((s) => {
              const Icon = STEP_ICONS[s.icon] ?? Search;
              return (
                <RevealItem key={s.step}>
                  <div className="group">
                    <div className="flex items-center gap-4">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/12 bg-ink-900 text-brand-400 transition-all duration-400 group-hover:-translate-y-1 group-hover:border-brand-500 group-hover:bg-brand-600 group-hover:text-white">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="font-display text-5xl font-extrabold leading-none text-white/[0.07] transition-colors duration-400 group-hover:text-brand-500/25">
                        {s.step}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-extrabold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{s.text}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      <BrandFilm />

      {/* Leadership */}
      <section className="bg-white py-14 dark:bg-ink-950 sm:py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="The People"
            title="Who you will actually be dealing with"
            subtitle="A deliberately small leadership team. The person who signs the design is the person you can call about it."
          />

          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {about.leadership.map((l) => (
              <RevealItem key={l.name} className="h-full">
                <div className="group h-full overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 text-center transition-all duration-400 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-soft dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-700">
                  <img
                    src={l.avatar}
                    alt=""
                    loading="lazy"
                    className="mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-brand-500/25 transition-transform duration-500 group-hover:scale-105"
                  />
                  <h3 className="mt-4 font-display text-base font-extrabold text-ink-900 dark:text-white">{l.name}</h3>
                  <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                    {l.role}
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed muted">{l.bio}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-12 text-center" delay={0.1}>
            <Link to="/book-meeting" className="btn-primary">
              Meet the team in person
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
