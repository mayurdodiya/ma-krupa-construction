import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { statuses, projectsByStatus } from '@/lib/site';
import { ProjectRail } from '@/components/projects/ProjectRail';
import { Reveal } from '@/components/common/Reveal';

/**
 * The portfolio, split the way the client asked for it: running, upcoming and
 * past projects each get their own rail rather than being flattened into one
 * grid — the stage is the thing a buyer filters on first.
 */
export function ProjectShowcase() {
  return (
    <section id="projects" className="relative overflow-hidden bg-ink-950 pb-16 pt-24 sm:pt-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-24 h-[28rem] w-[28rem] rounded-full bg-brand-600/[0.07] blur-3xl" />

      <div className="container-x relative">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">
              <span className="h-px w-10 bg-brand-500" />
              Our Portfolio
            </p>
            <h2 className="mt-6 h-section">
              Landmarks at every
              <br />
              <span className="italic text-brand-300">stage of life.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <Link to="/projects" className="btn-outline group">
              All Projects
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>

      <div className="relative mt-6 divide-y divide-white/[0.07]">
        {statuses.map((status, i) => (
          <ProjectRail
            key={status.id}
            index={`0${i + 1}`}
            title={status.name}
            subtitle={status.description}
            projects={projectsByStatus(status.id)}
            viewAllTo={`/projects?status=${status.id}`}
          />
        ))}
      </div>
    </section>
  );
}
