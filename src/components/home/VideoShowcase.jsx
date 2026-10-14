import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { site } from '@/lib/site';
import { Reveal } from '@/components/common/Reveal';

/**
 * "Watch Our Story" — the showreel's real home, replacing the old
 * popup-modal trigger from the Hero. Sits directly under the Hero carousel
 * as a dark cinematic band (`id="story"` is the Hero's "Watch Our Story"
 * scroll target), with a tilted 3D frame around the player for a bit of
 * depth on an otherwise flat light site.
 *
 * The video autoplays (muted — browsers block autoplay with sound, so this
 * is the only reliable way to "just start playing") once the player scrolls
 * into view, with a small mute/unmute toggle rather than a click-to-play
 * button. Same drop-in-file pattern as the rest of the site: probes for the
 * video with a HEAD request so an absent file never logs a media error, and
 * degrades to the poster image with a "coming soon" note instead of a
 * broken player.
 */
export function VideoShowcase() {
  const reduce = useMotionPreference();
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [videoExists, setVideoExists] = useState(false);
  const [muted, setMuted] = useState(true);
  const inView = useInView(ref, { amount: 0.4, once: false });

  useEffect(() => {
    const src = site.hero?.video;
    if (!src) return undefined;
    let alive = true;
    fetch(src, { method: 'HEAD' })
      .then((res) => {
        const type = res.headers.get('content-type') ?? '';
        if (alive && res.ok && type.startsWith('video/')) setVideoExists(true);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Play once the player is actually on screen (and pause when it scrolls
  // away, so it isn't burning cycles/bandwidth off-screen).
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoExists) return;
    if (inView) el.play().catch(() => {});
    else el.pause();
  }, [inView, videoExists]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -6]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.97]);

  return (
    <section id="story" ref={ref} className="panel-dark curtain-top relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-lines bg-[size:56px_56px] opacity-[0.14]" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 start-1/4 h-96 w-96 rounded-full bg-brand-500/20 blur-[100px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 end-1/4 h-96 w-96 rounded-full bg-sky-400/15 blur-[100px]" />

      <div className="container-x relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center !text-sky-300">
            <span className="h-px w-8 bg-sky-300" />
            Our Story
          </p>
          <h2 className="mt-4 h-section !text-white text-balance">
            A Walkthrough of How We <span className="italic text-sky-300">Build</span>
          </h2>
          <p className="mt-5 text-[15px] leading-[1.85] text-white/65 sm:text-base">
            From foundation to handover — a look inside the sites, the process and the people behind
            every {site.shortName} address.
          </p>
        </Reveal>

        <div className="perspective-far mt-14 sm:mt-16">
          <motion.div
            className="preserve-3d relative mx-auto max-w-6xl"
            style={reduce ? undefined : { rotateX, scale, transformOrigin: 'center bottom' }}
          >
            <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-white/15 bg-black shadow-glow ring-1 ring-white/5">
              {videoExists ? (
                <>
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    src={site.hero.video}
                    poster={site.hero.poster}
                    muted={muted}
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <button
                    type="button"
                    onClick={() => setMuted((m) => !m)}
                    aria-label={muted ? 'Unmute showreel' : 'Mute showreel'}
                    className="absolute end-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md ring-1 ring-white/25 transition-all duration-300 hover:bg-brand-500"
                  >
                    {muted ? <VolumeX className="h-[18px] w-[18px]" /> : <Volume2 className="h-[18px] w-[18px]" />}
                  </button>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:p-7">
                    <div>
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300">
                        <Sparkles className="h-3 w-3" />
                        Full Showreel
                      </p>
                      <p className="mt-1 font-display text-lg text-white sm:text-xl">{site.tagline}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={site.hero.poster}
                    alt=""
                    className="h-full w-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50" />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-7">
                    <div>
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300">
                        <Sparkles className="h-3 w-3" />
                        Showreel Coming Soon
                      </p>
                      <p className="mt-1 font-display text-lg text-white sm:text-xl">{site.tagline}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 3D depth accents — thin offset panels behind the frame. */}
            <div
              aria-hidden="true"
              className="absolute -inset-3 -z-10 rounded-2xl border border-white/10 opacity-60"
              style={{ transform: 'translateZ(-40px)' }}
            />
            <div
              aria-hidden="true"
              className="absolute -inset-6 -z-20 rounded-2xl border border-white/5 opacity-40"
              style={{ transform: 'translateZ(-80px)' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
