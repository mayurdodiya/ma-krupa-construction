import { Link } from 'react-router-dom';
import { Phone, CalendarCheck, MessageCircle } from 'lucide-react';
import { site, telLink, waLink, generalEnquiry } from '@/lib/site';
import { Reveal } from '@/components/common/Reveal';

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-brand-700 py-16 sm:py-20">
      <div aria-hidden="true" className="absolute inset-0 bg-grid-lines bg-[size:48px_48px] opacity-20" />
      <div aria-hidden="true" className="pointer-events-none absolute -start-24 -top-24 h-72 w-72 rounded-full bg-brand-400/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 end-0 h-80 w-80 rounded-full bg-ink-950/25 blur-3xl" />

      <div className="container-x relative text-center">
        <Reveal>
          <p className="eyebrow justify-center text-brand-100">
            <span className="h-px w-6 bg-brand-100" />
            Next Step
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-tight text-white text-balance sm:text-4xl">
            Come and see a site before you decide anything
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75">
            Walk a slab with our engineer, look at the specification sheet next to the actual
            finish, and ask the hard questions. No booking pressure, no registration fee.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/book-meeting" className="btn-light">
            <CalendarCheck className="h-4 w-4" />
            Book a Meeting
          </Link>
          <a href={telLink} className="btn bg-ink-950 text-white hover:bg-ink-900 hover:-translate-y-0.5">
            <Phone className="h-4 w-4" />
            {site.phone}
          </a>
          <a
            href={waLink(generalEnquiry)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn border border-white/30 text-white hover:bg-white/10 hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}
