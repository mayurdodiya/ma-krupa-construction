import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { Reveal } from '@/components/common/Reveal';

/**
 * Horizontal project rail with a gold scrub bar — the pattern the client's
 * reference sites use for each project stage.
 *
 * Scroll position is the single source of truth: the arrows and the progress
 * bar both read from the scroll container rather than keeping their own index,
 * so native touch/trackpad swiping stays perfectly in sync with the controls.
 */
export function ProjectRail({ title, subtitle, projects, viewAllTo, index = '01' }) {
  const railRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    // A rail that fits entirely shows a full bar and disabled arrows.
    if (max <= 1) {
      setProgress(1);
      setAtStart(true);
      setAtEnd(true);
      return;
    }
    const p = el.scrollLeft / max;
    setProgress(p);
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return undefined;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      el.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const nudge = (dir) => {
    const el = railRef.current;
    if (!el) return;
    // Step by one card + gap, derived from the first child so it stays correct
    // across every breakpoint without hardcoding widths.
    const card = el.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  if (!projects?.length) return null;

  return (
    <div className="py-10 sm:py-12">
      <Reveal className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="flex items-start gap-4">
            <span className="sec-index mt-2.5">{index}</span>
            <div>
              <h3 className="font-display text-[1.75rem] leading-tight text-white sm:text-[2.1rem]">{title}</h3>
              {subtitle && <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-300/65">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label={`Scroll ${title} left`}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-all duration-300 hover:border-brand-400 hover:bg-brand-500 hover:text-ink-950 disabled:pointer-events-none disabled:opacity-25"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label={`Scroll ${title} right`}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-all duration-300 hover:border-brand-400 hover:bg-brand-500 hover:text-ink-950 disabled:pointer-events-none disabled:opacity-25"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Reveal>

      {/* The rail's first card must line up with the heading above it, while the
          last card still bleeds off the right edge. Sitting inside `container-x`
          gives the left alignment; the negative end-margin (cancelled by an equal
          end-padding) reclaims the right gutter for the overflow. */}
      <div className="container-x">
        <div
          ref={railRef}
          className="no-scrollbar -me-5 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 pe-5 sm:-me-7 sm:pe-7 lg:-me-10 lg:pe-10"
        >
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="w-[80vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[380px]"
            >
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </div>

      <div className="container-x mt-7 flex items-center gap-6">
        <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300 transition-[width] duration-200 ease-out"
            style={{ width: `${Math.max(progress * 100, 8)}%` }}
          />
        </div>

        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="group inline-flex shrink-0 items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-brand-300"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
