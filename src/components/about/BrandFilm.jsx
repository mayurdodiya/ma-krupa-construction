import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { reels } from '@/lib/site';
import { SectionHeading } from '@/components/common/SectionHeading';
import { RevealGroup, RevealItem } from '@/components/common/Reveal';

/**
 * One reel: a real render or shot from the client, not stock footage. Plays
 * muted and loops automatically once it scrolls into view, and pauses again
 * once it leaves — so nothing is burning CPU or bandwidth off-screen.
 *
 * `useReducedMotion` visitors never get autoplay: the poster sits still until
 * they explicitly press play, which is also the fallback for browsers that
 * decline autoplay outright.
 */
function ReelCard({ reel, index }) {
  const reduce = useMotionPreference();
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const inView = useInView(wrapRef, { amount: 0.5, margin: '0px 0px -10% 0px' });

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduce) return undefined;

    if (inView) {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
    return undefined;
  }, [inView, reduce]);

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const toggleSound = (e) => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  return (
    <RevealItem className="h-full">
      <div
        ref={wrapRef}
        className="group relative aspect-square overflow-hidden rounded-[1.25rem] border border-white/10 bg-ink-900"
      >
        <video
          ref={videoRef}
          src={reel.video}
          poster={reel.poster}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setReady(true)}
          className="h-full w-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />

        {/* Loading/poster state — visible until the frame is actually decoded. */}
        {!ready && (
          <img
            src={reel.poster}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        )}

        <button
          type="button"
          onClick={toggle}
          data-cursor="view"
          data-cursor-label={playing ? 'Pause' : 'Play'}
          aria-label={playing ? `Pause ${reel.title}` : `Play ${reel.title}`}
          className="absolute inset-0 grid place-items-center"
        >
          <motion.span
            className="grid h-14 w-14 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-md transition-all duration-300 group-hover:bg-brand-500 group-hover:text-ink-950 group-hover:ring-brand-400"
            animate={{ opacity: playing ? 0 : 1, scale: playing ? 0.85 : 1 }}
            transition={{ duration: 0.25 }}
          >
            <Play className="ms-0.5 h-5 w-5 fill-current" />
          </motion.span>
        </button>

        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="absolute end-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-ink-950/50 text-white/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 hover:text-brand-300 group-hover:opacity-100"
        >
          {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>

        {playing && (
          <button
            type="button"
            onClick={toggle}
            aria-label={`Pause ${reel.title}`}
            className="absolute bottom-3 start-3 grid h-8 w-8 place-items-center rounded-full bg-ink-950/50 text-white/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 hover:text-brand-300 group-hover:opacity-100"
          >
            <Pause className="h-3.5 w-3.5" />
          </button>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
          <span className="sec-index">0{index + 1}</span>
          <h3 className="mt-1 font-display text-lg text-white">{reel.title}</h3>
          <p className="mt-1 text-[12px] leading-relaxed text-white/60">{reel.note}</p>
        </div>
      </div>
    </RevealItem>
  );
}

export function BrandFilm() {
  if (!reels.length) return null;

  return (
    <section className="relative overflow-hidden bg-ink-950 py-14 sm:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-lines bg-[size:56px_56px] opacity-[0.12]" />
      <div aria-hidden="true" className="pointer-events-none absolute -end-32 top-1/3 h-96 w-96 rounded-full bg-brand-600/10 blur-3xl" />

      <div className="container-x relative">
        <SectionHeading
          light
          eyebrow="Brand Film"
          title="Real renders, real footage"
          subtitle="Straight from our own design and marketing team — no stock photography here."
        />

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {reels.map((reel, i) => (
            <ReelCard key={reel.id} reel={reel} index={i} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
