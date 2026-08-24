import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { ArrowRight, Layers, Ruler, HardHat, ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { site } from '@/lib/site';

/**
 * "How a Ma Krupa tower goes up" — a real CSS 3D model, not a picture of one.
 *
 * The stage is an isometric camera (`rotateX` + `rotateZ`) over a `preserve-3d`
 * scene; every floor is a plate pushed along Z. Scrolling the section drives
 * two things at once:
 *   - `built`  — how many plates have been placed (the tower assembles)
 *   - `orbit`  — the camera swings a few degrees, so the model has parallax
 *
 * Plates above the build line render as gold wireframe (designed, not yet
 * poured), which is what makes the model read as *construction* rather than
 * decoration. Reduced-motion users get the finished tower, no assembly.
 */

const FLOORS = 16;
const PLATE = 17; // px of Z between floors

const PHASES = [
  { icon: Ruler, title: 'Design & Approvals', body: 'Structural drawings, RERA filing and municipal sanction before a single foundation is dug.' },
  { icon: HardHat, title: 'Foundation & RCC', body: 'Piling, raft and the RCC frame — poured to grade-tested mix designs with third-party cube testing.' },
  { icon: Layers, title: 'Finishing & MEP', body: 'Blockwork, plaster, electricals, plumbing and fit-out, floor by floor, on a published schedule.' },
  { icon: ShieldCheck, title: 'Handover', body: 'Snag-free possession with the completion certificate and every warranty document in hand.' },
];

export function Tower3D() {
  const ref = useRef(null);
  const reduce = useMotionPreference();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.35'] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.7 });

  // Camera orbit + the build line.
  const orbit = useTransform(p, [0, 1], [36, -14]);
  const lift = useTransform(p, [0, 1], [96, 26]);
  const built = useTransform(p, [0.05, 0.9], [0, FLOORS]);

  const floors = Array.from({ length: FLOORS }, (_, i) => i);

  return (
    <section id="process" ref={ref} className="relative overflow-hidden bg-ink-950 py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-lines bg-[size:64px_64px] opacity-[0.12]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-brand-600/10 blur-3xl" />

      <div className="container-x relative grid items-center gap-16 lg:grid-cols-2 lg:gap-10">
        {/* ---------------- Copy ---------------- */}
        <div className="order-2 lg:order-1">
          <Reveal>
            <p className="eyebrow">
              <span className="h-px w-10 bg-brand-500" />
              The Build Process
            </p>
            <h2 className="mt-6 h-section">
              Engineered upward,
              <br />
              <span className="italic text-brand-300">floor by floor.</span>
            </h2>
            <p className="lead mt-6 max-w-lg">
              Every {site.shortName} address follows the same four-stage discipline. Nothing starts
              before the stage before it is signed off — which is how possession dates hold.
            </p>
          </Reveal>

          <div className="mt-10 space-y-1">
            {PHASES.map((phase, i) => (
              <Reveal key={phase.title} delay={0.08 * i}>
                <div className="group flex gap-5 rounded-xl border border-transparent p-4 transition-colors duration-500 hover:border-white/10 hover:bg-white/[0.03]">
                  <div className="relative">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 transition-colors duration-500 group-hover:bg-brand-500 group-hover:text-ink-950">
                      <phase.icon className="h-[18px] w-[18px]" />
                    </span>
                    {i < PHASES.length - 1 && (
                      <span className="absolute inset-x-0 top-11 mx-auto h-[calc(100%-1rem)] w-px bg-gradient-to-b from-brand-500/40 to-transparent" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="flex items-baseline gap-3">
                      <span className="sec-index">0{i + 1}</span>
                      <span className="font-display text-lg text-white">{phase.title}</span>
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-300/70">{phase.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <Link to="/products" className="btn-primary group mt-6">
              See What We Build
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* ---------------- 3D stage ---------------- */}
        <div className="order-1 lg:order-2">
          <div className="perspective-far relative mx-auto grid h-[460px] w-full max-w-lg place-items-center sm:h-[560px]">
            {/* Ground shadow anchors the model in space. */}
            <div
              aria-hidden="true"
              className="absolute bottom-16 h-24 w-72 rounded-[50%] bg-black/50 blur-2xl"
            />

            <motion.div
              className="preserve-3d relative h-[260px] w-[260px]"
              style={
                reduce
                  ? { transform: 'translateY(56px) rotateX(62deg) rotateZ(24deg)' }
                  : { rotateX: 62, rotateZ: orbit, y: lift, transformStyle: 'preserve-3d' }
              }
            >
              {/* Site plot — the ground the massing sits on. */}
              <div
                className="absolute -inset-4 rounded-sm border border-brand-500/30 bg-brand-500/[0.05]"
                style={{ transform: 'translateZ(0px)' }}
              />
              <div
                className="absolute -inset-4 rounded-sm bg-grid-lines"
                style={{ transform: 'translateZ(0.5px)', backgroundSize: '22px 22px' }}
              />

              {floors.map((i) => (
                <Plate key={i} index={i} built={built} reduce={reduce} />
              ))}

              {/* Tower crane: mast, jib and counter-jib, drawn at the top of the
                  stack so the model reads as a site rather than a finished block. */}
              <div
                className="absolute left-[8%] top-[8%]"
                style={{ transform: `translateZ(${FLOORS * PLATE + 26}px)` }}
              >
                <span className="absolute -left-[70px] top-0 block h-[3px] w-[120px] rounded-full bg-gradient-to-r from-brand-600/40 via-brand-400 to-brand-300" />
                <span className="absolute -left-[70px] -top-[7px] block h-[7px] w-px bg-brand-400/70" />
                <span className="absolute left-[46px] top-[3px] block h-[26px] w-px bg-brand-300/70" />
                <span className="absolute left-[43px] top-[27px] block h-[7px] w-[7px] rounded-[1px] bg-brand-300" />
                <span className="absolute -left-1 -top-1 block h-2 w-2 rotate-45 bg-brand-200" />
              </div>
            </motion.div>

            {/* Read-out chips, drawn flat over the 3D stage. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-2">
              {[
                { k: 'Storeys', v: `${FLOORS}` },
                { k: 'Structure', v: 'RCC' },
                { k: 'Seismic', v: 'Zone III' },
              ].map((chip) => (
                <span
                  key={chip.k}
                  className="rounded-lg border border-white/10 bg-ink-900/80 px-3 py-2 text-center backdrop-blur-sm"
                >
                  <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-ink-400">{chip.k}</span>
                  <span className="block font-display text-sm text-brand-300">{chip.v}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * One floor plate. Its own opacity/scale is derived from the shared `built`
 * motion value, so 16 plates animate off a single scroll subscription rather
 * than 16 independent listeners.
 */
function Plate({ index, built, reduce }) {
  // Plates taper slightly toward the top, which reads as a real massing model.
  const inset = 7 + index * 0.22;
  const z = index * PLATE;

  const opacity = useTransform(built, [index - 0.6, index + 0.4], [0, 1]);
  // 0 = just placed (gold wireframe), 1 = poured and finished (solid slab).
  const poured = useTransform(built, [index + 0.2, index + 1.6], [0, 1]);
  const bg = useTransform(poured, (v) => `rgba(52, 43, 36, ${0.45 + v * 0.5})`);
  const border = useTransform(poured, (v) => `rgba(225, 193, 119, ${0.9 - v * 0.42})`);
  const dropZ = useTransform(built, [index - 0.6, index + 0.4], [z + 90, z]);

  const shared = {
    inset: `${inset}%`,
    // A hard top highlight + dark drop reads as slab thickness in isometric.
    boxShadow: '0 1px 0 rgba(255,255,255,0.07), 0 6px 10px -6px rgba(0,0,0,0.8)',
  };

  if (reduce) {
    return (
      <div
        className="absolute rounded-[2px] border"
        style={{
          ...shared,
          transform: `translateZ(${z}px)`,
          background: 'rgba(52, 43, 36, 0.9)',
          borderColor: 'rgba(225, 193, 119, 0.48)',
        }}
      />
    );
  }

  return (
    <motion.div
      className="absolute rounded-[2px] border"
      style={{ ...shared, translateZ: dropZ, opacity, background: bg, borderColor: border }}
    />
  );
}
