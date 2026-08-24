import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { getCategory } from '@/lib/site';

/**
 * Editorial project card: the photograph carries the card, and the metadata
 * sits under a hairline rule the way a printed brochure plate would.
 *
 * The whole card is one link (`data-cursor="view"` swaps the custom cursor to
 * its labelled disc), so the hit target is the full surface rather than a
 * small "View details" button.
 */
export function ProjectCard({ project, index = 0 }) {
  const reduce = useReducedMotion();
  const category = getCategory(project.category);
  const isLive = project.status === 'ongoing';

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay: Math.min(index * 0.07, 0.35), ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-full"
    >
      <Link
        to={`/projects/${project.id}`}
        data-cursor="view"
        data-cursor-label="View"
        className="flex h-full flex-col overflow-hidden rounded-[1.15rem] border border-white/10 bg-ink-900/60 transition-all duration-[600ms] ease-[var(--ease-lux)] hover:-translate-y-1.5 hover:border-brand-500/45 hover:shadow-glow"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={project.cover}
            alt={project.name}
            loading="lazy"
            decoding="async"
            className="img-lux h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />

          <span className="absolute start-3.5 top-3.5 flex flex-wrap gap-1.5">
            <StatusBadge status={project.status} />
            <span className="inline-flex items-center rounded-md border border-white/20 bg-ink-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/85 backdrop-blur-sm">
              {category?.shortName}
            </span>
          </span>

          {/* Live construction progress, read straight off the photo. */}
          {isLive && (
            <span className="absolute inset-x-3.5 bottom-3.5">
              <span className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-white/75">
                <span>Construction</span>
                <span className="text-brand-300">{project.progress}%</span>
              </span>
              <span className="mt-1.5 block h-[3px] w-full overflow-hidden rounded-full bg-white/20">
                <motion.span
                  className="block h-full rounded-full bg-brand-400"
                  initial={reduce ? false : { width: 0 }}
                  whileInView={{ width: `${project.progress}%` }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1.2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  style={reduce ? { width: `${project.progress}%` } : undefined}
                />
              </span>
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-[1.35rem] leading-snug text-white transition-colors duration-300 group-hover:text-brand-200">
            {project.name}
          </h3>

          <p className="mt-2 flex items-center gap-1.5 text-[13px] text-ink-300/70">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-400" />
            <span className="truncate">{project.location}</span>
          </p>

          <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-ink-300/60">{project.tagline}</p>

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-4">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-ink-400">
                {project.areaRange}
              </p>
              <p className="mt-1 truncate font-display text-[15px] text-brand-300">{project.priceLabel}</p>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/70 transition-colors duration-300 group-hover:text-brand-300">
              Explore
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
