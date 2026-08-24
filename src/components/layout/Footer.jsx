import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Instagram, Facebook, Linkedin, Youtube, ArrowRight } from 'lucide-react';
import { site, categories, statuses, telLink, mailLink } from '@/lib/site';
import { Reveal } from '@/components/common/Reveal';

const SOCIAL = [
  { key: 'instagram', Icon: Instagram, label: 'Instagram' },
  { key: 'facebook', Icon: Facebook, label: 'Facebook' },
  { key: 'linkedin', Icon: Linkedin, label: 'LinkedIn' },
  { key: 'youtube', Icon: Youtube, label: 'YouTube' },
];

const QUICK_LINKS = [
  { label: 'All Projects', to: '/projects' },
  { label: 'Services', to: '/products' },
  { label: 'EMI Calculator', to: '/calculators?tab=emi' },
  { label: 'ROI Calculator', to: '/calculators?tab=roi' },
  { label: 'RERA Certification', to: '/rera' },
  { label: 'Book a Meeting', to: '/book-meeting' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="curtain-top relative -mt-8 overflow-hidden border-t border-white/[0.07] bg-ink-900 text-white">
      {/* Blueprint grid, faint enough to read as texture rather than pattern. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-lines bg-[size:56px_56px] opacity-[0.16]" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 end-0 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl" />

      <div className="container-x relative">
        <div className="grid gap-10 py-14 lg:grid-cols-12 lg:gap-8 lg:py-16">
          {/* Brand column */}
          <Reveal className="lg:col-span-4">
            {/* The full client lockup (icon + "Maa Krupa Developers" wordmark)
                gets its one prominent placement here, on a white card since the
                source art ships on a white canvas. The header uses the icon-only
                mark instead, paired with the site's own typeset name. */}
            <Link to="/" aria-label={`${site.name} home`} className="inline-block">
              <span className="inline-flex items-center rounded-xl bg-white px-4 py-3 shadow-soft ring-1 ring-black/5">
                <img src={site.logo} alt={site.name} className="h-14 w-auto sm:h-16" />
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">{site.intro}</p>

            <div className="mt-5 inline-flex items-start gap-2.5 rounded-lg border border-brand-500/25 bg-brand-500/10 p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              <span className="text-[11px] leading-relaxed text-white/70">
                <span className="font-bold text-brand-300">GujRERA Registered Promoter</span>
                <br />
                {site.reraNumber}
              </span>
            </div>

            <div className="mt-5 flex gap-2">
              {SOCIAL.map(({ key, Icon, label }) => (
                <a
                  key={key}
                  href={site.social[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-white/70 transition-all hover:-translate-y-0.5 hover:border-brand-500 hover:bg-brand-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </Reveal>

          {/* Link columns */}
          <Reveal delay={0.05} className="lg:col-span-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-400">Segments</h3>
            <ul className="mt-4 space-y-2.5">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link to={`/projects?category=${c.id}`} className="text-sm text-white/60 transition-colors hover:text-brand-300">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="mt-7 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-400">Status</h3>
            <ul className="mt-4 space-y-2.5">
              {statuses.map((s) => (
                <li key={s.id}>
                  <Link to={`/projects?status=${s.id}`} className="text-sm text-white/60 transition-colors hover:text-brand-300">
                    {s.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-400">Quick Links</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 lg:grid-cols-1">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/60 transition-colors hover:text-brand-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-400">Reach Us</h3>
            <ul className="mt-4 space-y-3.5 text-sm text-white/60">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span className="leading-relaxed">{site.address.full}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>
                  <a href={telLink} className="block transition-colors hover:text-brand-300">{site.phone}</a>
                  <span className="text-white/40">{site.phoneAlt}</span>
                </span>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <a href={mailLink} className="break-all transition-colors hover:text-brand-300">{site.email}</a>
              </li>
              <li className="flex gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>{site.hours}</span>
              </li>
            </ul>

            <Link to="/book-meeting" className="btn-primary mt-5 w-full !py-2.5">
              Book a Site Visit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="rule-gold" />

        <div className="flex flex-col gap-3 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.legalName}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>CIN: {site.cin}</span>
            <span className="hidden sm:inline">|</span>
            <span>GSTIN: {site.gstin}</span>
          </p>
        </div>

        <p className="border-t border-white/5 py-4 text-[11px] leading-relaxed text-white/30">
          Disclaimer: The imagery, plans and specifications on this website are indicative and for
          representation only. Nothing here constitutes an offer or contract. Prices, areas and
          amenities are subject to change without notice. Please refer to the registered agreement
          and the RERA filings for the binding position on any project.
        </p>
      </div>
    </footer>
  );
}
