import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { ArrowRight } from 'lucide-react';
import { site, about } from '@/lib/site';
import { Reveal, WordReveal } from '@/components/common/Reveal';

/**
 * Full-bleed legacy statement — a single photograph running the width of the
 * viewport with the brand story set over it.
 *
 * The plate is over-sized and moved on a spring against scroll, so the picture
 * drifts behind stationary type. That parallax is the whole effect; everything
 * else is contrast management so the copy stays readable over a photo.
 */
export function LegacyBanner() {
  const ref = useRef(null);
  const reduce = useMotionPreference();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rawY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const y = useSpring(rawY, { stiffness: 80, damping: 26, mass: 0.7 });

  const image = about.images?.site ?? site.hero?.slides?.[1];

  return (
    <section id="legacy" ref={ref} className="curtain-top relative -mt-10 overflow-hidden bg-ink-950">
      {/* Plate */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-[125%] w-full object-cover"
          style={reduce ? { height: '100%' } : { y }}
        />
        <div className="absolute inset-0 bg-ink-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-ink-950/40" />
      </div>

      <div className="container-x relative grid gap-12 py-24 sm:py-32 lg:grid-cols-2 lg:gap-16 lg:py-40">
        <div>
          <Reveal>
            <p className="eyebrow">
              <span className="h-px w-10 bg-brand-500" />
              About {site.shortName}
            </p>
          </Reveal>

          <h2 className="mt-7 h-section">
            <WordReveal text="Where Engineering" inView />
            <br />
            <span className="italic text-brand-300">
              <WordReveal text="Meets Legacy" inView delay={0.2} />
            </span>
          </h2>

          <Reveal delay={0.25}>
            <Link to="/about" className="btn-outline group mt-10">
              Our Story
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="lg:pt-6">
          {/* `about.story` is an array of paragraphs; the banner shows the opening one. */}
          <Reveal delay={0.1}>
            <p className="text-[15px] leading-[1.95] text-white/75 sm:text-[17px]">
              {Array.isArray(about.story) ? about.story[0] : (about.story ?? site.intro)}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <blockquote className="mt-8 border-s-2 border-brand-500 ps-5">
              <p className="text-[14px] leading-[1.9] text-white/60 sm:text-[15px]">
                With projects across Surat, Kamrej, Navsari and the surrounding belt, we keep building
                environments that outlast the people who commissioned them.
              </p>
            </blockquote>
          </Reveal>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {[
              { title: 'Our Vision', body: about.vision },
              { title: 'Our Mission', body: about.mission },
            ]
              .filter((b) => b.body)
              .map((block, i) => (
                <Reveal key={block.title} delay={0.24 + i * 0.08}>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-400">
                    {block.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-[1.85] text-white/60">{block.body}</p>
                </Reveal>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
