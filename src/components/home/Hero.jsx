import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Play, ArrowRight, X } from 'lucide-react';
import { site, categories } from '@/lib/site';
import { Magnetic, WordReveal } from '@/components/common/Reveal';
import { Counter } from '@/components/common/Counter';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

const SLIDE_MS = 6000;

/**
 * Cinematic background plate.
 *
 * Prefers a real looping video (`site.hero.video`). That file is intentionally
 * NOT committed — the client supplies their own showreel — so the component
 * treats video as progressive enhancement: if it cannot load, or the browser
 * refuses to autoplay it, we fall back to a Ken Burns cross-dissolve over the
 * real project stills. Both paths look deliberate; neither shows a black box.
 */
function HeroBackdrop({ onVideoReady }) {
  const reduce = useReducedMotion();
  const [videoOk, setVideoOk] = useState(false);
  const [videoExists, setVideoExists] = useState(false);
  const [index, setIndex] = useState(0);
  const slides = site.hero?.slides ?? [];

  // Probe for the showreel before mounting a <video>. Mounting one whose src is
  // absent logs a media error on every page load; a HEAD request keeps the
  // drop-in behaviour (add the file, it plays) without that noise.
  useEffect(() => {
    const src = site.hero?.video;
    if (!src) return undefined;
    let alive = true;
    fetch(src, { method: 'HEAD' })
      .then((res) => {
        const type = res.headers.get('content-type') ?? '';
        // A SPA host rewrites unknown paths to index.html, so a 200 alone is
        // not proof the file is there — it has to actually be a video.
        if (alive && res.ok && type.startsWith('video/')) setVideoExists(true);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (videoOk || reduce || slides.length < 2) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [videoOk, reduce, slides.length]);

  const handleReady = useCallback(() => {
    setVideoOk(true);
    onVideoReady?.(true);
  }, [onVideoReady]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-950">
      {/* Ken Burns stills — always mounted so there is never a blank first frame. */}
      <AnimatePresence initial={false}>
        {!videoOk && slides[index] && (
          <motion.div
            key={slides[index]}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          >
            <img
              src={slides[index]}
              alt=""
              className={`h-full w-full object-cover ${reduce ? 'scale-105' : 'animate-ken-burns'}`}
              style={reduce ? undefined : { animationDuration: `${SLIDE_MS + 3000}ms` }}
              fetchpriority={index === 0 ? 'high' : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {videoExists && (
        <video
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            videoOk ? 'opacity-100' : 'opacity-0'
          }`}
          src={site.hero.video}
          poster={site.hero.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={handleReady}
          onError={() => setVideoOk(false)}
          aria-hidden="true"
        />
      )}

      {/* Grade: warm the shot, then sink the edges so type always has contrast. */}
      <div className="absolute inset-0 bg-ink-950/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/70" />
      <div className="absolute inset-0 bg-vignette" />
    </div>
  );
}

/** Slow drifting gold motes — barely visible, but they keep the plate alive. */
function GoldDust() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  const motes = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: (i * 37) % 100,
    top: (i * 53) % 100,
    delay: (i % 7) * 1.3,
    dur: 9 + (i % 5) * 2.5,
    size: i % 3 === 0 ? 3 : 2,
  }));

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((m) => (
        <motion.span
          key={m.id}
          className="absolute rounded-full bg-brand-300/50"
          style={{ left: `${m.left}%`, top: `${m.top}%`, width: m.size, height: m.size }}
          animate={{ y: [0, -46, 0], opacity: [0, 0.85, 0] }}
          transition={{ duration: m.dur, delay: m.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/** Showreel modal — plays the client's video, or the still reel if absent. */
function ShowreelModal({ open, onClose, hasVideo }) {
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const [i, setI] = useState(0);
  const slides = site.hero?.slides ?? [];
  useEffect(() => {
    if (!open || hasVideo || slides.length < 2) return undefined;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 3200);
    return () => clearInterval(t);
  }, [open, hasVideo, slides.length]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center bg-ink-950/92 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${site.name} showreel`}
        >
          <motion.div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-glow"
            initial={{ scale: 0.94, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 12, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close showreel"
              className="absolute end-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-brand-500 hover:text-ink-950"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="aspect-video w-full">
              {hasVideo ? (
                <video className="h-full w-full object-cover" src={site.hero.video} controls autoPlay playsInline />
              ) : (
                <div className="relative h-full w-full">
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={slides[i]}
                      src={slides[i]}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: 'easeInOut' }}
                    />
                  </AnimatePresence>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-6">
                    <p className="eyebrow">Project Reel</p>
                    <p className="mt-1 font-display text-xl text-white">{site.tagline}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [reelOpen, setReelOpen] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);

  // Content drifts up and fades as the hero leaves — the section behind it
  // appears to slide over the plate rather than merely scroll past.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const rawY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const y = useSpring(rawY, { stiffness: 90, damping: 24, mass: 0.6 });
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const stats = site.stats ?? [];

  return (
    <section ref={ref} className="relative min-h-[100svh] w-full overflow-hidden">
      <HeroBackdrop onVideoReady={setHasVideo} />
      <GoldDust />

      <motion.div
        className="container-x relative flex min-h-[100svh] flex-col justify-center pb-28 pt-32 sm:pb-32"
        style={reduce ? undefined : { y, opacity }}
      >
        <div className="max-w-4xl">
          <motion.p
            className="eyebrow"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <span className="h-px w-10 bg-brand-500" />
            Welcome to {site.shortName}
          </motion.p>

          <h1 className="mt-6 h-hero">
            <WordReveal text="A New Era of" delay={0.3} />
            <br />
            <span className="italic text-brand-300">
              <WordReveal text="Building Trust" delay={0.55} />
            </span>
          </h1>

          <motion.p
            className="mt-7 max-w-xl text-[15px] leading-[1.9] text-white/70 sm:text-base"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {site.intro}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05 }}
          >
            <Magnetic>
              <button
                type="button"
                onClick={() => setReelOpen(true)}
                className="btn-outline group !px-6 !py-3"
                data-cursor="link"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-ink-950 transition-transform duration-500 group-hover:scale-110">
                  <Play className="ms-0.5 h-4 w-4 fill-current" />
                </span>
                Watch Full Video
              </button>
            </Magnetic>

            <Magnetic>
              <Link to="/projects" className="btn-primary group">
                Explore Projects
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Magnetic>
          </motion.div>

          {/* Four-segment quick jump — the client's home-page requirement. */}
          <motion.div
            className="mt-12 grid max-w-2xl grid-cols-2 gap-2.5 sm:grid-cols-4"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 1.2 } } }}
          >
            {categories.map((c) => (
              <motion.div
                key={c.id}
                variants={{
                  hidden: reduce ? {} : { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                <Link
                  to={`/projects?category=${c.id}`}
                  className="group relative flex h-full items-center justify-between gap-2 overflow-hidden rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3.5 backdrop-blur-sm transition-all duration-500 hover:border-brand-500/60 hover:bg-brand-500/10"
                >
                  <span className="text-[13px] font-semibold text-white/85 transition-colors group-hover:text-brand-200">
                    {c.name}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-brand-400 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stat rail */}
        <motion.dl
          className="mt-14 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.45 }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="font-display text-3xl text-brand-300 sm:text-4xl">
                <Counter value={s.value} suffix={s.suffix} />
              </dt>
              <dd className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                {s.label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-2"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        <span className="relative grid h-9 w-[22px] place-items-start justify-center rounded-full border border-white/30 pt-1.5">
          <span className="h-1.5 w-1.5 animate-scroll-dot rounded-full bg-brand-400" />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">Scroll</span>
      </motion.div>

      <ShowreelModal open={reelOpen} onClose={() => setReelOpen(false)} hasVideo={hasVideo} />
    </section>
  );
}
