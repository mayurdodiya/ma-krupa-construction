import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, CalendarClock, Maximize2, Building, Layers, ShieldCheck, Check,
  Phone, MessageCircle, CalendarCheck, Calculator, ArrowRight, Images, Navigation,
} from 'lucide-react';
import {
  getProject, getCategory, relatedProjects, site, telLink, waLink,
  projectEnquiry, formatINRShort,
} from '@/lib/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Reveal, RevealGroup, RevealItem } from '@/components/common/Reveal';
import { Lightbox } from '@/components/common/Lightbox';
import { ProjectCard } from '@/components/projects/ProjectCard';

function FactTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-white/45">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const project = getProject(id);
  const [lightbox, setLightbox] = useState(-1);

  usePageMeta(
    project ? `${project.name} — ${project.location} | ${site.name}` : `Project not found — ${site.name}`,
    project?.description,
  );

  if (!project) return <Navigate to="/projects" replace />;

  const category = getCategory(project.category);
  const related = relatedProjects(project);
  const images = [project.cover, ...project.gallery];
  const isLive = project.status === 'ongoing';

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950 pt-[68px] text-white">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          initial={{ scale: 1.08, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={project.cover} alt="" className="h-full w-full object-cover" />
        </motion.div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-ink-950/55" />

        <div className="container-x relative py-12 sm:py-16 lg:py-20">
          <Reveal y={12}>
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-white/45">
              <Link to="/" className="hover:text-brand-300">Home</Link>
              <span>/</span>
              <Link to="/projects" className="hover:text-brand-300">Projects</Link>
              <span>/</span>
              <Link to={`/projects?category=${project.category}`} className="hover:text-brand-300">
                {category?.name}
              </Link>
              <span>/</span>
              <span className="text-white/75">{project.name}</span>
            </nav>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <StatusBadge status={project.status} />
              <span className="inline-flex items-center rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white/80">
                {category?.name}
              </span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {project.name}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-white/60">
              <MapPin className="h-4 w-4 text-brand-400" />
              {project.address}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">{project.tagline}</p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <FactTile icon={Maximize2} label="Area range" value={project.areaRange} />
              <FactTile icon={CalendarClock} label="Possession" value={project.possession} />
              <FactTile icon={Building} label="Total units" value={project.totalUnits} />
              <FactTile icon={Layers} label="Land area" value={project.landArea} />
            </div>
          </Reveal>

          {isLive && (
            <Reveal delay={0.18} className="mt-6 max-w-md rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <ProgressBar value={project.progress} label="Construction progress" />
            </Reveal>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="bg-white py-12 dark:bg-ink-950 sm:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-12 lg:col-span-8">
            {/* Overview */}
            <Reveal>
              <h2 className="h-section !text-2xl">About this project</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-600 text-pretty dark:text-ink-300">
                {project.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {project.highlights.map((h) => (
                  <div
                    key={h}
                    className="flex items-start gap-2.5 rounded-xl border border-ink-100 bg-ink-50/60 p-3.5 dark:border-ink-800 dark:bg-ink-900/40"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                    <span className="text-sm leading-relaxed text-ink-700 dark:text-ink-200">{h}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Gallery */}
            <Reveal>
              <div className="flex items-end justify-between gap-4">
                <h2 className="h-section !text-2xl">Gallery</h2>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold muted">
                  <Images className="h-4 w-4" />
                  {images.length} images
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setLightbox(i)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-ink-100 dark:border-ink-800"
                    aria-label={`Open image ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${project.name} ${i + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className="absolute inset-0 bg-ink-950/0 transition-colors duration-300 group-hover:bg-ink-950/25" />
                    <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-ink-950">
                        <Maximize2 className="h-4 w-4" />
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </Reveal>

            {/* Configurations */}
            <Reveal>
              <h2 className="h-section !text-2xl">Configurations</h2>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {project.configurations.map((c) => (
                  <span
                    key={c}
                    className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-bold text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* Specifications */}
            <Reveal>
              <h2 className="h-section !text-2xl">Specifications</h2>
              <p className="mt-2 text-sm muted">
                This is the schedule that goes into your registered agreement, not a wish list.
              </p>
              <dl className="mt-5 overflow-hidden rounded-2xl border border-ink-100 dark:border-ink-800">
                {project.specifications.map((s, i) => (
                  <div
                    key={s.label}
                    className={`grid gap-1 px-5 py-4 sm:grid-cols-3 sm:gap-4 ${
                      i % 2 === 0 ? 'bg-ink-50/60 dark:bg-ink-900/40' : 'bg-white dark:bg-ink-950'
                    }`}
                  >
                    <dt className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                      {s.label}
                    </dt>
                    <dd className="text-sm text-ink-700 sm:col-span-2 dark:text-ink-200">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* Amenities */}
            <Reveal>
              <h2 className="h-section !text-2xl">Amenities</h2>
              <RevealGroup className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4" stagger={0.04}>
                {project.amenities.map((a) => (
                  <RevealItem key={a} y={14}>
                    <div className="group flex h-full items-center gap-2 rounded-xl border border-ink-100 bg-white px-3.5 py-3 transition-colors hover:border-brand-300 hover:bg-brand-50 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-700 dark:hover:bg-brand-950">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500 transition-transform group-hover:scale-150" />
                      <span className="text-[13px] font-semibold text-ink-700 dark:text-ink-200">{a}</span>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </Reveal>

            {/* Location */}
            <Reveal>
              <h2 className="h-section !text-2xl">Location and connectivity</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <ul className="space-y-2.5">
                  {project.nearby.map((n) => (
                    <li
                      key={n.name}
                      className="flex items-center justify-between gap-3 rounded-xl border border-ink-100 bg-white px-4 py-3 dark:border-ink-800 dark:bg-ink-900"
                    >
                      <span className="flex items-center gap-2 text-sm text-ink-700 dark:text-ink-200">
                        <Navigation className="h-3.5 w-3.5 shrink-0 text-brand-500" />
                        {n.name}
                      </span>
                      <span className="shrink-0 text-xs font-bold text-brand-600 dark:text-brand-400">
                        {n.distance}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="overflow-hidden rounded-2xl border border-ink-100 dark:border-ink-800">
                  <iframe
                    title={`Map of ${project.name}`}
                    src={site.mapEmbed}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full min-h-[240px] w-full"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft dark:border-ink-800 dark:bg-ink-900">
                <div className="bg-gradient-to-br from-ink-900 to-ink-950 px-6 py-5 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-400">Price</p>
                  <p className="mt-1 font-display text-2xl font-extrabold">{project.priceLabel}</p>
                  <p className="mt-1 text-xs text-white/50">
                    {project.status === 'completed'
                      ? 'This project is fully delivered and sold out.'
                      : `On RERA carpet area, ${project.areaRange}`}
                  </p>
                </div>

                <div className="space-y-2.5 p-5">
                  <Link to="/book-meeting" className="btn-primary w-full">
                    <CalendarCheck className="h-4 w-4" />
                    Book a Site Visit
                  </Link>
                  <a
                    href={waLink(projectEnquiry(project))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn w-full bg-[#25D366] text-white hover:brightness-95"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enquire on WhatsApp
                  </a>
                  <a href={telLink} className="btn-outline w-full">
                    <Phone className="h-4 w-4" />
                    {site.phone}
                  </a>

                  {project.priceFrom > 0 && project.status !== 'completed' && (
                    <Link
                      to="/calculators?tab=emi"
                      className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-ink-100 bg-ink-50/60 px-4 py-3 transition-colors hover:border-brand-300 dark:border-ink-800 dark:bg-ink-900/50"
                    >
                      <span className="flex items-center gap-2.5">
                        <Calculator className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                        <span>
                          <span className="block text-[11px] font-bold uppercase tracking-wide text-ink-400">
                            Plan your EMI
                          </span>
                          <span className="block text-xs font-semibold text-ink-700 dark:text-ink-200">
                            From {formatINRShort(project.priceFrom)}
                          </span>
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-ink-400" />
                    </Link>
                  )}
                </div>
              </div>

              {/* RERA */}
              <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5 dark:border-brand-800 dark:bg-brand-950/50">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-700 dark:text-brand-300">
                  <ShieldCheck className="h-4 w-4" />
                  RERA Registration
                </p>
                <p className="mt-2 break-all font-mono text-[11px] leading-relaxed text-ink-700 dark:text-ink-200">
                  {project.reraNumber}
                </p>
                <Link
                  to="/rera"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline dark:text-brand-300"
                >
                  How to verify this
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Investment snapshot */}
              <div className="rounded-2xl border border-ink-100 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Investment snapshot</p>
                <dl className="mt-3 space-y-2.5 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="muted">Expected rent</dt>
                    <dd className="font-bold text-ink-800 dark:text-ink-100">
                      Rs. {project.expectedRentPerSqftMonth}/sq.ft./mo
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="muted">Appreciation</dt>
                    <dd className="font-bold text-emerald-600 dark:text-emerald-400">
                      {project.appreciationRate}% p.a.
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="muted">Storeys</dt>
                    <dd className="font-bold text-ink-800 dark:text-ink-100">{project.storeys}</dd>
                  </div>
                </dl>
                <Link to="/calculators?tab=roi" className="btn-dark mt-4 w-full !py-2.5">
                  Calculate my return
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-ink-50 py-14 dark:bg-ink-900/40 sm:py-16">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow">
                  <span className="h-px w-6 bg-brand-600 dark:bg-brand-400" />
                  More in {category?.name}
                </span>
                <h2 className="mt-3 h-section !text-2xl">You may also like</h2>
              </div>
              <Link to={`/projects?category=${project.category}`} className="btn-outline !py-2.5">
                View all {category?.shortName}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Lightbox images={images} index={lightbox} onClose={() => setLightbox(-1)} onIndexChange={setLightbox} />
    </>
  );
}
