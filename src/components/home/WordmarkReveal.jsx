import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { site } from '@/lib/site';
import { useMotionPreference } from '@/hooks/useMotionPreference';

/**
 * The brand moment: the company name rendered at display scale with a real
 * project photograph showing *through* the letterforms (background-clip: text).
 *
 * Scroll drives a slow push-in on the artwork inside the letters, so the type
 * stays fixed while the image behind it breathes. On an ivory panel this is the
 * hinge between the dark hero and the dark project sections.
 *
 * `background-clip: text` is supported everywhere we target, but the fallback
 * matters: without it the text would be transparent and vanish. The `@supports`
 * guard in the style block keeps solid ink type as the floor.
 */
export function WordmarkReveal() {
  const ref = useRef(null);
  const reduce = useMotionPreference();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rawSize = useTransform(scrollYProgress, [0, 1], [140, 108]);
  const size = useSpring(rawSize, { stiffness: 80, damping: 26, mass: 0.7 });
  const bgSize = useTransform(size, (v) => `${v}% auto`);

  const rawPos = useTransform(scrollYProgress, [0, 1], [20, 78]);
  const pos = useSpring(rawPos, { stiffness: 80, damping: 26, mass: 0.7 });
  const bgPos = useTransform(pos, (v) => `50% ${v}%`);

  const image = site.hero?.wordmark ?? site.hero?.slides?.[0];
  const words = site.shortName.split(' ');

  return (
    <section
      ref={ref}
      id="wordmark"
      className="panel-light curtain-top relative -mt-10 overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      {/* Faint blueprint grid keeps the ivory from reading as empty. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(64 56 48 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(64 56 48 / 0.06) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(80% 60% at 50% 50%, black, transparent)',
        }}
      />

      <div className="container-x relative">
        <motion.p
          className="mb-8 text-center text-[11px] font-bold uppercase tracking-[0.32em] text-ink-500 sm:mb-12"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8 }}
        >
          Est. {site.foundedYear} &nbsp;·&nbsp; Surat, Gujarat
        </motion.p>

        <h2 className="sr-only">{site.name}</h2>

        {/*
          `whileInView` has to live on THIS wrapper, not on the individual word
          spans below. Each word starts translated 105% out of its own
          `overflow-hidden` box (that's the reveal mask), which means it starts
          with ~0% actually visible. An IntersectionObserver's ratio is clipped
          by ancestor overflow, so a `whileInView` placed directly on a
          self-clipped element can never see it cross the visibility threshold
          — it stays permanently hidden. Watching this unclipped wrapper instead
          and letting Framer cascade the variants down to each word sidesteps
          that deadlock entirely.
        */}
        <motion.div
          aria-hidden="true"
          className="flex flex-col items-center leading-[0.85]"
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
        >
          {words.map((word) => (
            <div key={word} className="overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <motion.span
                className="block bg-cover bg-center bg-clip-text font-display text-[19vw] font-semibold leading-[1.08] tracking-[-0.02em] text-transparent sm:text-[17vw] lg:text-[15vw]"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: reduce ? '120% auto' : bgSize,
                  backgroundPosition: reduce ? '50% 50%' : bgPos,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                variants={{
                  hidden: { y: '105%' },
                  show: { y: '0%', transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                {word}
              </motion.span>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mx-auto mt-10 max-w-2xl text-center sm:mt-14"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.35 }}
        >
          <p className="font-display text-xl italic text-ink-700 sm:text-2xl">&ldquo;{site.slogan}&rdquo;</p>
          <div className="mx-auto mt-6 h-px w-24 bg-brand-500/60" />
        </motion.div>
      </div>
    </section>
  );
}
