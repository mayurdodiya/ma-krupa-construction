import {
  HardHat, Factory, Building, Sofa, Map, ClipboardList, Wrench, Truck,
  Check, ArrowRight, MessageCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { products, site, waLink, productEnquiry } from '@/lib/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHero } from '@/components/common/PageHero';
import { RevealGroup, RevealItem } from '@/components/common/Reveal';
import { SectionHeading } from '@/components/common/SectionHeading';

const ICONS = { HardHat, Factory, Building, Sofa, Map, ClipboardList, Wrench, Truck };

export default function Products() {
  usePageMeta(
    `Services and Products — ${site.name}`,
    'Turnkey construction, PEB industrial sheds, RCC structure works, interior fit-out, land development and project management by Ma Krupa Construction.',
  );

  return (
    <>
      <PageHero
        image="/images/products/turnkey-construction.jpg"
        eyebrow="What We Offer"
        title="Beyond our own developments"
        subtitle="The same site teams that deliver Ma Krupa projects are available for your project, whether you want a single turnkey contract or only the discipline to run your own build."
        breadcrumbs={[{ label: 'Services' }]}
      />

      <section className="bg-white py-12 dark:bg-ink-950 sm:py-16">
        <div className="container-x">
          <RevealGroup className="grid gap-6 md:grid-cols-2" stagger={0.08}>
            {products.map((p) => {
              const Icon = ICONS[p.icon] ?? HardHat;
              return (
                <RevealItem key={p.id} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-400 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-glow dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-700">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={p.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
                      <span className="absolute start-4 top-4 grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white shadow-lift transition-transform duration-500 group-hover:rotate-6">
                        <Icon className="h-5 w-5" />
                      </span>
                      {p.featured && (
                        <span className="absolute end-4 top-4 rounded-md bg-brand-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-950 backdrop-blur-sm">
                          Most Requested
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="font-display text-xl font-extrabold text-ink-900 dark:text-white">{p.name}</h2>
                      <p className="mt-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400">
                        {p.shortDescription}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed muted">{p.description}</p>

                      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-[13px] text-ink-600 dark:text-ink-300">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-ink-100 pt-5 dark:border-ink-800">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-ink-400">Starting at</p>
                          <p className="font-display text-base font-extrabold text-ink-900 dark:text-white">
                            {p.startingPrice}
                          </p>
                        </div>
                        <a
                          href={waLink(productEnquiry(p))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3.5 py-2 text-xs font-bold text-ink-700 transition-colors hover:border-brand-600 hover:bg-brand-600 hover:text-white dark:border-ink-700 dark:text-ink-200"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          Get a quote
                        </a>
                      </div>
                    </div>
                  </article>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-ink-50 py-14 dark:bg-ink-900/40 sm:py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Not sure which fits"
            title="Tell us the requirement, we will tell you the right route"
            subtitle="Some clients want a single turnkey contract. Others already have a contractor and want only our quality and billing discipline. Both are fine."
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/book-meeting" className="btn-primary">
              Book a consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn-outline">
              Send an enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
