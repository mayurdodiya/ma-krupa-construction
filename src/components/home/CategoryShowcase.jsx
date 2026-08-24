import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { ArrowUpRight, Building2, Factory, Home, Trees } from 'lucide-react';
import { categories, countByCategory } from '@/lib/site';
import { Reveal, Tilt3D } from '@/components/common/Reveal';

const ICONS = { Building2, Factory, Home, Trees };

/**
 * The client's home-page requirement: Commercial | Industrial | Residential |
 * Farmhouse, given equal weight and a way in.
 *
 * Each card is a genuine 3D object — `Tilt3D` rotates the card toward the
 * pointer while the photo, the frame and the label sit at different translateZ
 * depths, so they separate as it turns instead of sliding as one flat image.
 */
export function CategoryShowcase() {
  const reduce = useMotionPreference();
  const [active, setActive] = useState(null);

  return (
    <section id="segments" className="relative overflow-hidden bg-ink-950 py-24 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold-line opacity-40" />

      <div className="container-x relative">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal className="max-w-xl">
            <p className="eyebrow">
              <span className="h-px w-10 bg-brand-500" />
              What We Build
            </p>
            <h2 className="mt-6 h-section">
              Four segments,
              <br />
              <span className="italic text-brand-300">one standard.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="max-w-sm text-sm leading-relaxed text-ink-300/70">
              From Ring Road showrooms to gated farm estates — the same engineering discipline,
              documentation and handover promise applies to every square foot.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => {
            const Icon = ICONS[cat.icon] ?? Building2;
            const count = countByCategory(cat.id);
            const isActive = active === cat.id;

            return (
              <motion.div
                key={cat.id}
                initial={reduce ? false : { opacity: 0, y: 44 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setActive(cat.id)}
                onMouseLeave={() => setActive(null)}
              >
                <Tilt3D max={8} scale={1.03}>
                  <Link
                    to={`/projects?category=${cat.id}`}
                    data-cursor="view"
                    data-cursor-label="View"
                    className="group relative block h-[400px] overflow-hidden rounded-[1.25rem] border border-white/10 bg-ink-900"
                  >
                    {/* Photo stays on the card's own plane (Z=0). A negative Z here
                        would be scaled up by the perspective AND escape the rounded
                        `overflow-hidden`, because 3D-transformed descendants are not
                        clipped by an ancestor in a preserve-3d context. Depth comes
                        from the inset layers below, which cannot overflow. */}
                    <div className="absolute inset-0">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        loading="lazy"
                        decoding="async"
                        className="img-lux h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/10" />
                      <motion.div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(to top, ${cat.accent}55, transparent 60%)` }}
                        animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>

                    {/* Inner hairline frame, lifted forward. */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-3 rounded-2xl border border-white/15 transition-colors duration-500 group-hover:border-brand-400/60"
                      style={{ transform: 'translateZ(14px)' }}
                    />

                    {/* Content plane, lifted furthest forward. */}
                    <div
                      className="absolute inset-0 flex flex-col justify-between p-6"
                      style={{ transform: 'translateZ(26px)' }}
                    >
                      <div className="flex items-start justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-ink-950/50 text-brand-300 backdrop-blur-sm transition-all duration-500 group-hover:border-brand-400 group-hover:bg-brand-500 group-hover:text-ink-950">
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="sec-index pt-1">0{i + 1}</span>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-300/90">
                          {count} {count === 1 ? 'Project' : 'Projects'}
                        </p>
                        <h3 className="mt-2 font-display text-2xl text-white">{cat.name}</h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-white/60">{cat.tagline}</p>

                        {/* Reveals on hover without shifting the card's height. */}
                        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[var(--ease-lux)] group-hover:grid-rows-[1fr]">
                          <div className="overflow-hidden">
                            <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-300">
                              Explore
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Tilt3D>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
