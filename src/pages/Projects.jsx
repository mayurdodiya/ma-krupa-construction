import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, FolderOpen } from 'lucide-react';
import { categories, statuses, filterProjects, site } from '@/lib/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHero } from '@/components/common/PageHero';
import { ProjectCard } from '@/components/projects/ProjectCard';

const ALL = '';

function FilterGroup({ label, options, value, onPick }) {
  const chip = (active) =>
    `rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
      active
        ? 'border-brand-600 bg-brand-600 text-white'
        : 'border-ink-200 text-ink-600 hover:border-brand-500 hover:text-brand-600 dark:border-ink-700 dark:text-ink-300'
    }`;

  return (
    <div>
      <p className="field-label">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" onClick={() => onPick(ALL)} className={chip(value === ALL)}>
          All
        </button>
        {options.map((o) => (
          <button key={o.id} type="button" onClick={() => onPick(o.id)} className={chip(value === o.id)}>
            {o.shortName ?? o.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  // The URL is the source of truth for filters, so chatbot deep links, footer
  // links and the nav dropdown all land on a correctly pre-filtered page, and
  // the visitor can share or bookmark the result.
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? ALL;
  const status = params.get('status') ?? ALL;

  const [search, setSearch] = useState(params.get('q') ?? '');
  const [debounced, setDebounced] = useState(search);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const results = useMemo(
    () => filterProjects({ category, status, search: debounced }),
    [category, status, debounced],
  );

  const total = filterProjects({}).length;
  const activeCount = [category, status, debounced].filter(Boolean).length;

  const clearAll = () => {
    setSearch('');
    setParams(new URLSearchParams(), { replace: true });
  };

  usePageMeta(
    `Projects — ${site.name}`,
    'Browse running, upcoming and completed commercial, industrial, residential and farmhouse projects by Ma Krupa Construction.',
  );

  return (
    <>
      <PageHero
        image="/images/projects/krupa-residency/cover.jpg"
        eyebrow="Portfolio"
        title="Every project, in one place"
        subtitle="Filter by segment or by stage. Each card carries the committed possession date, the price entry point and, for live sites, the current construction percentage."
        breadcrumbs={[{ label: 'Projects' }]}
      >
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:max-w-md">
          {statuses.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setFilter('status', status === s.id ? ALL : s.id)}
              className={`px-3 py-3 text-center transition-colors ${
                status === s.id ? 'bg-brand-600' : 'bg-ink-950/70 hover:bg-ink-900'
              }`}
            >
              <span className="block font-display text-xl font-extrabold text-white">
                {filterProjects({ status: s.id }).length}
              </span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wide text-white/55">
                {s.shortName}
              </span>
            </button>
          ))}
        </div>
      </PageHero>

      <section className="bg-white py-10 dark:bg-ink-950 sm:py-14">
        <div className="container-x">
          <div className="rounded-2xl border border-ink-100 bg-ink-50/60 p-4 dark:border-ink-800 dark:bg-ink-900/40 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, location, configuration or amenity..."
                  aria-label="Search projects"
                  className="field !ps-10"
                />
              </div>

              <button
                type="button"
                onClick={() => setFiltersOpen((o) => !o)}
                aria-expanded={filtersOpen}
                className="btn-outline !py-3 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeCount > 0 && (
                  <span className="rounded bg-brand-600 px-1.5 text-[10px] text-white">{activeCount}</span>
                )}
              </button>

              {activeCount > 0 && (
                <button type="button" onClick={clearAll} className="btn-ghost hidden !py-3 lg:inline-flex">
                  <X className="h-4 w-4" />
                  Clear
                </button>
              )}
            </div>

            <div className={`mt-5 gap-6 sm:grid-cols-2 ${filtersOpen ? 'grid' : 'hidden lg:grid'}`}>
              <FilterGroup
                label="Segment"
                options={categories}
                value={category}
                onPick={(v) => setFilter('category', v)}
              />
              <FilterGroup
                label="Stage"
                options={statuses}
                value={status}
                onPick={(v) => setFilter('status', v)}
              />
            </div>
          </div>

          <p className="mt-6 text-sm muted">
            Showing <span className="font-bold text-ink-800 dark:text-ink-100">{results.length}</span> of {total} projects
          </p>

          <AnimatePresence mode="wait">
            {results.length > 0 ? (
              <motion.div
                key={`${category}-${status}-${debounced}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {results.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-5 grid place-items-center rounded-2xl border border-dashed border-ink-200 py-20 text-center dark:border-ink-700"
              >
                <FolderOpen className="h-10 w-10 text-ink-300" />
                <p className="mt-4 font-display text-lg font-extrabold text-ink-800 dark:text-ink-100">
                  Nothing matches those filters
                </p>
                <p className="mt-1 max-w-sm text-sm muted">
                  Try a broader search, or clear the filters to see the full portfolio.
                </p>
                <button type="button" onClick={clearAll} className="btn-primary mt-6">
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
