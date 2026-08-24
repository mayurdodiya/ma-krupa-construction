import { Link } from 'react-router-dom';
import {
  ShieldCheck, Landmark, FileCheck2, CalendarClock, Ruler, Scale,
  ExternalLink, Check, ArrowRight, BadgeCheck,
} from 'lucide-react';
import { rera, site } from '@/lib/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHero } from '@/components/common/PageHero';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Reveal, RevealGroup, RevealItem } from '@/components/common/Reveal';

const ICONS = { ShieldCheck, Landmark, FileCheck2, CalendarClock, Ruler, Scale };

export default function Rera() {
  usePageMeta(
    `RERA Certification — ${site.name}`,
    'Gujarat RERA registration numbers for every Ma Krupa Construction project, our compliance commitments, and how to verify us on the regulator portal.',
  );

  return (
    <>
      <PageHero
        image="/images/about/craft.jpg"
        eyebrow="Compliance"
        title={rera.headline}
        subtitle={rera.intro}
        breadcrumbs={[{ label: 'RERA' }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <a href={rera.verifyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Verify on GujRERA
            <ExternalLink className="h-4 w-4" />
          </a>
          <span className="rounded-lg border border-white/12 bg-white/[0.05] px-4 py-3 text-xs font-semibold text-white/70 backdrop-blur-sm">
            Promoter Reg. <span className="font-mono text-brand-300">{rera.promoterRegistration}</span>
          </span>
        </div>
      </PageHero>

      <section className="bg-white py-14 dark:bg-ink-950 sm:py-16">
        <div className="container-x">
          <SectionHeading
            align="left"
            eyebrow="Our Commitments"
            title="What registration obliges us to do"
            subtitle="These are not marketing promises. Each one is a statutory obligation under the Act, and each one is auditable against our filings."
          />

          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {rera.commitments.map((c) => {
              const Icon = ICONS[c.icon] ?? ShieldCheck;
              return (
                <RevealItem key={c.title} className="h-full">
                  <div className="group h-full rounded-2xl border border-ink-100 bg-white p-6 transition-all duration-400 hover:-translate-y-1 hover:border-brand-300 hover:shadow-soft dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-700">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950 dark:text-brand-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-sm font-extrabold text-ink-900 dark:text-white">{c.title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed muted">{c.text}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-ink-50 py-14 dark:bg-ink-900/40 sm:py-16">
        <div className="container-x">
          <SectionHeading
            align="left"
            eyebrow="Project Register"
            title="Every registration number, published"
            subtitle="Copy any number below into the GujRERA portal search and read the filings for yourself."
          />

          <Reveal className="mt-8 overflow-hidden rounded-2xl border border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-ink-50 text-[10px] uppercase tracking-wide text-ink-500 dark:bg-ink-800 dark:text-ink-400">
                  <tr>
                    <th className="px-5 py-3 text-left font-bold">Project</th>
                    <th className="px-5 py-3 text-left font-bold">Registration number</th>
                    <th className="px-5 py-3 text-left font-bold">Valid till</th>
                    <th className="px-5 py-3 text-left font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                  {rera.certificates.map((c) => (
                    <tr key={c.number} className="transition-colors hover:bg-brand-50/40 dark:hover:bg-ink-800/50">
                      <td className="px-5 py-3.5">
                        <Link
                          to={`/projects/${c.projectId}`}
                          className="font-semibold text-ink-800 transition-colors hover:text-brand-600 dark:text-ink-100 dark:hover:text-brand-400"
                        >
                          {c.project}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-ink-600 dark:text-ink-300">{c.number}</td>
                      <td className="px-5 py-3.5 text-ink-600 dark:text-ink-300">{c.validTill}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${
                            c.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-ink-100 text-ink-600 ring-ink-300/40 dark:bg-ink-800 dark:text-ink-300'
                          }`}
                        >
                          <BadgeCheck className="h-3 w-3" />
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-14 dark:bg-ink-950 sm:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Know Your Rights"
              title="Six checks to run on any builder, including us"
              subtitle="If a developer resists any of these, that resistance is your answer."
            />
          </Reveal>

          <RevealGroup className="space-y-3" stagger={0.07}>
            {rera.buyerRights.map((r, i) => (
              <RevealItem key={r}>
                <div className="flex items-start gap-3.5 rounded-xl border border-ink-100 bg-ink-50/60 p-4 dark:border-ink-800 dark:bg-ink-900/40">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-600 text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-ink-700 dark:text-ink-200">{r}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink-950 py-14 text-white sm:py-16">
        <div aria-hidden="true" className="absolute inset-0 bg-grid-lines bg-[size:48px_48px] opacity-[0.14]" />
        <div className="container-x relative text-center">
          <Reveal>
            <Check className="mx-auto h-10 w-10 text-brand-400" />
            <h2 className="mx-auto mt-5 max-w-2xl font-display text-2xl font-extrabold text-balance sm:text-3xl">
              Verified us? Now come and see the concrete
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/55">
              Paperwork tells you a builder is legitimate. A site visit tells you whether they are
              any good. Book one and judge for yourself.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/book-meeting" className="btn-primary">
                Book a site visit
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/projects" className="btn border border-white/25 text-white hover:bg-white/10">
                See the projects
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
