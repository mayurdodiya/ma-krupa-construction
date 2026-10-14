import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '@/lib/site';
import { SectionHeading } from '@/components/common/SectionHeading';

const AUTOPLAY_MS = 6500;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((delta) => {
    setIndex((i) => (i + delta + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, go]);

  const active = testimonials[index];

  return (
    <section
      className="relative overflow-hidden bg-ink-50 py-16 dark:bg-ink-900/40 sm:py-20 lg:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -start-20 top-1/3 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Client Voices"
          title="What owners say after possession"
          subtitle="Not launch-day enthusiasm. These are people who have lived with or operated out of the building for years."
        />

        <div className="relative mx-auto mt-12 max-w-3xl">
          <Quote aria-hidden="true" className="absolute -top-6 start-0 h-16 w-16 text-brand-500/15" />

          <div className="relative min-h-[280px] sm:min-h-[240px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active.id}
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-ink-100 bg-white p-7 text-center shadow-soft dark:border-ink-800 dark:bg-ink-900 sm:p-9"
              >
                <div className="flex justify-center gap-0.5">
                  {Array.from({ length: active.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-brand-500 text-brand-500" />
                  ))}
                </div>

                <p className="mt-5 text-base leading-relaxed text-ink-700 text-pretty dark:text-ink-200 sm:text-lg">
                  {active.text}
                </p>

                <footer className="mt-6 flex items-center justify-center gap-3">
                  <img src={active.avatar} alt="" loading="lazy" className="h-11 w-11 rounded-full object-cover ring-1 ring-brand-500/25" />
                  <div className="text-start">
                    <p className="text-sm font-bold text-ink-900 dark:text-white">{active.name}</p>
                    <p className="text-xs muted">{active.role}</p>
                    <p className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">{active.project}</p>
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 bg-white text-ink-600 transition-colors hover:border-brand-500 hover:text-brand-600 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex gap-1.5">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-7 bg-brand-600' : 'w-1.5 bg-ink-300 hover:bg-brand-400 dark:bg-ink-700'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 bg-white text-ink-600 transition-colors hover:border-brand-500 hover:text-brand-600 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
