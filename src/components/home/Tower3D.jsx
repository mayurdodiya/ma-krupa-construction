import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { ArrowRight, Layers, Ruler, HardHat, ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { site } from '@/lib/site';

/**
 * "How a Maa Krupa tower goes up" — a real CSS 3D construction scene, not a
 * picture of one.
 *
 * Each floor is a genuine extruded box (a top face + two visible side walls,
 * built with the standard "centre the box, rotate each face out from the
 * middle" technique). Floors taper visibly toward the top so the silhouette
 * reads as a massing model, and the tower sits on a dressed site:
 *
 *   - an excavated pit with earth strata, ringed by dashed site hoarding
 *   - material stockpiles: rebar bundles, brick stacks, a sand mound,
 *     precast slabs and a parked transit-mixer (all drawn in plan view so
 *     they sit flat in the same isometric space)
 *   - a proper tower crane (counter-jib, cab, jib ties, warning beacon)
 *     whose hook hauls a load up to the active storey and slews away when
 *     the tower completes
 *
 * Scrolling drives three linked things:
 *   - `built` — how many floors have been placed (the tower assembles)
 *   - per-floor construction state, so each floor passes through a life:
 *     exposed rebar + shuttering (just placed) → scaffolding wrap (curing)
 *     → poured, solid walls (finished)
 *   - `orbit` — the camera swings a few degrees for parallax
 *
 * Floors above the build line stay as thin gold wireframe (designed, not yet
 * poured). Live chips under the model track the stage, and reduced-motion
 * users get the finished tower in a dressed site, no assembly.
 */

const FLOORS = 16;
const FLOOR_H = 15; // px of Z extrusion per floor
const BASE = 168; // px, footprint of the ground floor
const TAPER = 5; // px shed from each side, per floor, going up
const PLOT = BASE + 64; // px, the dressed site plot

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const PHASES = [
  { icon: Ruler, title: 'Design & Approvals', body: 'Structural drawings, RERA filing and municipal sanction before a single foundation is dug.' },
  { icon: HardHat, title: 'Foundation & RCC', body: 'Piling, raft and the RCC frame — poured to grade-tested mix designs with third-party cube testing.' },
  { icon: Layers, title: 'Finishing & MEP', body: 'Blockwork, plaster, electricals, plumbing and fit-out, floor by floor, on a published schedule.' },
  { icon: ShieldCheck, title: 'Handover', body: 'Snag-free possession with the completion certificate and every warranty document in hand.' },
];

const STAGES = [
  ['Site Prep & Piling', 0.08],
  ['Foundation & Raft', 0.28],
  ['RCC Frame Rising', 0.52],
  ['Scaffolding & Blockwork', 0.78],
  ['Finishing & Cladding', 0.96],
  ['Handover Ready', 1.0],
];
const stageAt = (f) => STAGES.find(([, m]) => f <= m)?.[0] ?? 'Handover Ready';
const levelAt = (b) => {
  if (b >= FLOORS - 0.01) return 'Complete';
  if (b <= 0.4) return 'Piling';
  return `Floor ${Math.round(b)}`;
};

const MESH = 'rgba(126, 190, 158, 0.35)'; // scaffold safety mesh green
const MESH_LINE = 'rgba(151, 214, 182, 0.9)';
const STEEL = 'rgba(184, 196, 205, 0.95)'; // fresh rebar
const HOARD = 'rgba(135, 206, 235, 0.28)';

export function Tower3D() {
  const ref = useRef(null);
  const reduce = useMotionPreference();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.35'] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.7 });

  // Camera orbit + the build line.
  const orbit = useTransform(p, [0, 1], [28, -10]);
  const built = useTransform(p, [0.05, 0.9], [0, FLOORS]);

  // Live read-outs.
  const stageLabel = useTransform(p, (v) => stageAt(v));
  const levelLabel = useTransform(built, (v) => levelAt(v));

  // Crane hook hauls the load up the build line, then the load disappears
  // at handover (the hook stays, finished tower, crane idles).
  const hookY = useTransform(p, [0.1, 0.88], [76, 4]);
  const hookTransform = useTransform(hookY, (y) => `translateY(${y}px)`);
  const loadOpacity = useTransform(p, [0.82, 0.96], [1, 0]);

  const floors = Array.from({ length: FLOORS }, (_, i) => i);

  return (
    <section id="process" ref={ref} className="panel-dark curtain-btm relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-lines bg-[size:64px_64px] opacity-[0.12]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl" />

      <div className="container-x relative grid items-center gap-16 lg:grid-cols-2 lg:gap-10">
        {/* ---------------- Copy ---------------- */}
        <div className="order-2 lg:order-1">
          <Reveal>
            <p className="eyebrow !text-sky-300">
              <span className="h-px w-10 bg-sky-300" />
              The Build Process
            </p>
            <p className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300 animate-blink" />
              Live — {reduce ? 'Handover Ready' : <motion.span>{stageLabel}</motion.span>}
            </p>
            <h2 className="mt-6 h-section">
              Engineered upward,
              <br />
              <span className="italic text-sky-300">floor by floor.</span>
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-[1.85] text-white/65 sm:text-base">
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
              className="absolute bottom-[104px] h-20 w-64 rounded-[50%] bg-black/50 blur-2xl sm:bottom-[120px]"
            />

            <motion.div
              className="preserve-3d relative"
              style={
                reduce
                  ? { transform: 'translateY(30px) rotateX(56deg) rotateZ(22deg)' }
                  : { rotateX: 56, rotateZ: orbit, y: 30, transformStyle: 'preserve-3d' }
              }
            >
              <SiteDressing />

              {floors.map((i) => (
                <FloorBox key={i} index={i} built={built} reduce={reduce} />
              ))}
            </motion.div>

            {/* Tower crane — drawn as a flat 2D icon rather than living inside
                the rotated 3D scene. A "vertical" mast built from ordinary
                CSS lines gets wildly stretched once it inherits the tower's
                own rotateX/rotateZ, which is what produced the stray
                diagonal spike in the previous version. Pinning it here, next
                to the model instead of inside it, reads just as clearly as
                "a crane on site" without any of that risk. The hook + load
                are animated SVG groups that track the build line. */}
            <svg
              aria-hidden="true"
              viewBox="-10 0 150 120"
              className="animate-float pointer-events-none absolute h-28 w-32 sm:h-36 sm:w-40"
              style={{ left: '44%', top: '3%' }}
            >
              {/* Mast + turntable */}
              <line x1="30" y1="18" x2="30" y2="118" stroke="#87CEEB" strokeWidth="3" strokeLinecap="round" />
              <circle cx="30" cy="20" r="4" fill="#0B6285" stroke="#5EA3C0" strokeWidth="1.5" />
              <polygon points="24,26 30,15 36,26" fill="none" stroke="#5EA3C0" strokeWidth="1.5" strokeLinejoin="round" />
              <rect x="26" y="6" width="8" height="10" rx="1.5" fill="#0B6285" stroke="#5EA3C0" strokeWidth="1.25" />
              {/* Warning beacon */}
              <circle className="animate-blink" cx="33" cy="4" r="1.8" fill="#FBBF24" />

              {/* Jib + counter-jib */}
              <line x1="118" y1="18" x2="8" y2="18" stroke="#87CEEB" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="30" y1="18" x2="64" y2="18" stroke="#5EA3C0" strokeWidth="1" />
              <line x1="24" y1="4" x2="10" y2="-2" stroke="#5EA3C0" strokeWidth="1.25" />
              <rect x="8" y="20" width="7" height="3.5" fill="#0B6285" stroke="#87CEEB" strokeWidth="0.75" />
              <rect x="10" y="24.5" width="5" height="3.5" fill="#0B6285" stroke="#87CEEB" strokeWidth="0.75" />
              {/* Jib ties */}
              <line x1="30" y1="15" x2="62" y2="18" stroke="#5EA3C0" strokeWidth="1" />
              <line x1="30" y1="15" x2="96" y2="18" stroke="#5EA3C0" strokeWidth="1" />
              {/* Trolley */}
              <rect x="82" y="13" width="7" height="4" rx="1" fill="#9FDAEC" stroke="#5EA3C0" strokeWidth="1" />

              {!reduce && (
                <motion.g style={{ transform: hookTransform }}>
                  {/* Hoist line + hook */}
                  <line x1="85.5" y1="18" x2="85.5" y2="30" stroke="#87CEEB" strokeWidth="1.25" strokeLinecap="round" />
                  <path d="M82.5 30 h6 v3 a3.5 3.5 0 0 1 -6 0 z" fill="none" stroke="#87CEEB" strokeWidth="1.5" />
                  {/* Concrete skip */}
                  <motion.g style={{ opacity: loadOpacity }}>
                    <line x1="85.5" y1="33" x2="85.5" y2="38" stroke="#87CEEB" strokeWidth="1" strokeLinecap="round" />
                    <line x1="82" y1="34.5" x2="89" y2="34.5" stroke="#5EA3C0" strokeWidth="1" strokeLinecap="round" />
                    <rect x="81" y="39" width="9" height="7" rx="1.5" fill="#0B6285" stroke="#87CEEB" strokeWidth="1" />
                    <rect x="83" y="41" width="5" height="3" rx="0.75" fill="#9FDAEC" />
                  </motion.g>
                </motion.g>
              )}
            </svg>

            {/* Read-out chips, drawn flat over the 3D stage. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap justify-center gap-2">
              <span className="rounded-lg border border-sky-400/30 bg-ink-900/80 px-3 py-2 text-center backdrop-blur-sm">
                <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-ink-400">Stage</span>
                <span className="block font-display text-sm text-sky-300">
                  {reduce ? 'Handover Ready' : <motion.span>{stageLabel}</motion.span>}
                </span>
              </span>
              <span className="rounded-lg border border-white/10 bg-ink-900/80 px-3 py-2 text-center backdrop-blur-sm">
                <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-ink-400">Level</span>
                <span className="block font-display text-sm text-brand-300">
                  {reduce ? `${FLOORS} / ${FLOORS}` : <motion.span>{levelLabel}</motion.span>}
                </span>
              </span>
              <span className="rounded-lg border border-white/10 bg-ink-900/80 px-3 py-2 text-center backdrop-blur-sm">
                <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-ink-400">Structure</span>
                <span className="block font-display text-sm text-brand-300">RCC</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The dressed site under the tower — excavation pit, hoarding ring and the
 * plan-view material stockpile. Everything sits flat in the rotated scene's
 * X/Y plane (small translateZ lifts keep layers from z-fighting the grid),
 * and every prop is placed in the ring OUTSIDE the tower's footprint
 * (-84..84 on both axes) so nothing gets swallowed by the extruded slab.
 */
function SiteDressing() {
  const half = PLOT / 2;

  const Cone = ({ left, top }) => (
    <div
      className="absolute"
      style={{
        left, top, width: 0, height: 0,
        borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
        borderBottom: '10px solid rgba(245, 158, 11, 0.85)', transform: 'translateZ(0.5px)',
      }}
    />
  );

  return (
    <>
      {/* Boundary hoarding ring + corner posts. */}
      <div
        className="absolute rounded-sm"
        style={{
          width: PLOT + 20, height: PLOT + 20, left: -(PLOT + 20) / 2, top: -(PLOT + 20) / 2,
          transform: 'translateZ(-2px)', border: '1px dashed ' + HOARD,
        }}
      />
      {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([cx, cy]) => (
        <div
          key={`${cx}-${cy}`}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            left: -(PLOT + 20) / 2 + cx * (PLOT + 20), top: -(PLOT + 20) / 2 + cy * (PLOT + 20),
            transform: 'translateZ(-1.8px)',
            marginLeft: cx ? -6 : 0, marginTop: cy ? -6 : 0,
            background: 'rgba(135, 206, 235, 0.6)',
          }}
        />
      ))}

      {/* Ground plot / grid floor the site is drawn on. */}
      <div
        className="absolute rounded-sm border border-brand-500/30 bg-brand-500/[0.05]"
        style={{ width: PLOT, height: PLOT, left: -half, top: -half, transform: 'translateZ(-1px)' }}
      />
      <div
        className="absolute rounded-sm bg-grid-lines"
        style={{ width: PLOT, height: PLOT, left: -half, top: -half, backgroundSize: '22px 22px', transform: 'translateZ(-0.4px)' }}
      />

      {/* Excavation pit — the foundation dig, with earth strata. */}
      <div
        className="absolute overflow-hidden rounded-[3px]"
        style={{
          width: 42, height: 36, left: -half + 2, top: half - 52,
          transform: 'translateZ(-6px)',
          background: 'linear-gradient(180deg, rgba(11, 98, 133, 0.38), rgba(11, 20, 24, 0.6))',
          border: '1px solid rgba(135, 206, 235, 0.3)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent 0 7px, rgba(9, 80, 104, 0.55) 7px 9px)',
          }}
        />
      </div>
      <Cone left={-half + 10} top={half - 14} />
      <Cone left={-half + 2} top={half - 28} />

      {/* Rebar bundle — stacked pale rods with two tie loops. */}
      <div className="absolute" style={{ left: -half + 58, top: half - 24, transformStyle: 'preserve-3d' }}>
        {[0, 1, 2, 3, 4].map((k) => (
          <div
            key={k}
            className="absolute rounded-full"
            style={{
              left: 0, top: k * 2, width: 44, height: 2.5,
              background: STEEL, transform: `translateZ(${k * 1.4}px)`,
            }}
          />
        ))}
        <div className="absolute" style={{ left: 10, top: -1, width: 3, height: 11, transform: 'translateZ(2px)', background: 'rgba(184, 196, 205, 0.7)', borderRadius: 1 }} />
        <div className="absolute" style={{ left: 30, top: -1, width: 3, height: 11, transform: 'translateZ(2px)', background: 'rgba(184, 196, 205, 0.7)', borderRadius: 1 }} />
      </div>

      {/* Brick stack. */}
      <div className="absolute" style={{ left: half - 96, top: half - 102, transformStyle: 'preserve-3d' }}>
        <div
          className="absolute"
          style={{
            width: 30, height: 10, left: -15, top: 0,
            background:
              'linear-gradient(180deg, rgba(70, 40, 30, 0) 0 6px, rgba(70, 40, 30, 0.55) 6px 7px), repeating-linear-gradient(90deg, #A85A45 0 13px, #93493A 13px 17px)',
            transform: 'translateZ(1px)', borderRadius: 1,
          }}
        />
        <div
          className="absolute"
          style={{
            width: 20, height: 7, left: -10, top: -3,
            background:
              'linear-gradient(180deg, rgba(70, 40, 30, 0) 0 4px, rgba(70, 40, 30, 0.55) 4px 5px), repeating-linear-gradient(90deg, #A85A45 0 12px, #93493A 12px 15px)',
            transform: 'translateZ(2px)', borderRadius: 1,
          }}
        />
      </div>

      {/* Sand mound. */}
      <div
        className="absolute rounded-[50%]"
        style={{
          left: -half + 62, top: half - 14,
          width: 26, height: 13,
          background: 'radial-gradient(circle at 50% 40%, rgba(214, 196, 160, 0.92), rgba(198, 178, 140, 0.5) 58%, transparent 74%)',
          transform: 'translateZ(0.4px)',
        }}
      />

      {/* Precast slabs stacked by the hoarding. */}
      <div className="absolute" style={{ left: half - 132, top: half - 20, transformStyle: 'preserve-3d' }}>
        <div className="absolute" style={{ width: 26, height: 18, transform: 'translateZ(1px)', background: 'rgba(214, 227, 233, 0.22)', border: '1px solid rgba(135, 206, 235, 0.35)', borderRadius: 1 }} />
        <div className="absolute" style={{ width: 20, height: 13, left: 3, top: 3, transform: 'translateZ(2.6px)', background: 'rgba(214, 227, 233, 0.3)', border: '1px solid rgba(135, 206, 235, 0.4)', borderRadius: 1 }} />
      </div>

      {/* Transit-mixer, parked (plan view: cab + drum + chute). */}
      <div className="absolute" style={{ left: half - 54, top: half - 26, transformStyle: 'preserve-3d' }}>
        <div className="absolute" style={{ width: 48, height: 17, transform: 'translateZ(0.4px)', background: 'rgba(0, 0, 0, 0.28)', borderRadius: 4, top: 2, left: 1 }} />
        <div className="absolute" style={{ width: 48, height: 17, transform: 'translateZ(1px)', background: 'rgba(135, 206, 235, 0.14)', border: '1px solid rgba(135, 206, 235, 0.4)', borderRadius: 3 }} />
        <div
          className="absolute"
          style={{
            width: 13, height: 13, left: 5, top: 2,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 38%, rgba(135, 206, 235, 0.65), rgba(11, 98, 133, 0.35) 70%)',
            border: '1px solid rgba(135, 206, 235, 0.65)', transform: 'translateZ(3px)',
          }}
        />
        <div className="absolute" style={{ width: 12, height: 9, left: 34, top: 4, transform: 'translateZ(2px)', background: 'rgba(244, 251, 253, 0.35)', border: '1px solid rgba(135, 206, 235, 0.55)', borderRadius: 2 }} />
        <div className="absolute" style={{ width: 9, height: 3.5, left: 27, top: 5, transform: 'translateZ(2px) rotate(-8deg)', background: 'rgba(159, 218, 236, 0.7)', borderRadius: 1.5 }} />
      </div>
      <Cone left={half - 22} top={half - 6} />

      {/* Stacked column / pile storage along the top edge. */}
      <div className="absolute" style={{ left: -half + 44, top: -half + 14, transformStyle: 'preserve-3d' }}>
        {[0, 1, 2, 3].map((k) => (
          <div
            key={k}
            className="absolute rounded-full"
            style={{
              left: 0, top: 0, width: 30, height: 2.5,
              background: STEEL, transform: `translateZ(${k * 1.3}px)`, borderRadius: 1,
            }}
          />
        ))}
      </div>
    </>
  );
}

/**
 * One floor, rendered as a real extruded box: a top face plus the two side
 * walls a front-right isometric camera actually sees (the far walls are
 * never visible, so they are skipped rather than wastefully rendered).
 *
 * The wrapper is translated to the box's own centre — every face is then
 * built by centring itself on that same point (negative half-extent
 * left/top) and pushing straight out along its rotated Z axis by half the
 * box's depth in that direction.
 *
 * Each floor passes through three construction states driven by the shared
 * `built` motion value (one scroll subscription, not one per floor):
 *
 *   placed  — the box drops in as a thin wireframe
 *   active  — exposed rebar ring + pulsing beacon on the slab (being poured)
 *   curing  — scaffolding mesh wraps the two visible faces
 *   poured  — walls flood solid, the floor is finished
 */
function FloorBox({ index, built, reduce }) {
  const size = BASE - index * TAPER * 2;
  const half = size / 2;
  const centerZ = index * FLOOR_H + FLOOR_H / 2;

  const opacity = useTransform(built, [index - 0.6, index + 0.4], [0, 1]);
  // 0 = just placed (thin wireframe), 1 = poured and finished (solid box).
  const poured = useTransform(built, [index + 0.2, index + 1.6], [0, 1]);
  const dropZ = useTransform(built, [index - 0.6, index + 0.4], [centerZ + 70, centerZ]);

  // Construction-state transforms (callback forms so one pass computes both).
  const active = useTransform(built, (b) => {
    const placed = clamp01((b - (index - 0.6)) / 1.0);
    const solidified = clamp01((b - (index + 0.2)) / 1.4);
    return placed * (1 - solidified);
  });
  const scaffold = useTransform(built, (b) => {
    const placed = clamp01((b - (index - 0.6)) / 1.0);
    const on = clamp01((b - (index + 0.2)) / 0.5);
    const gone = clamp01((b - (index + 1.6)) / 0.8);
    return placed * on * (1 - gone);
  });

  const topBg = useTransform(poured, (v) => `rgba(120, 188, 216, ${0.06 + v * 0.16})`);
  const topBorder = useTransform(poured, (v) => `rgba(135, 206, 235, ${0.85 - v * 0.35})`);
  const wallBg = useTransform(poured, (v) => `rgba(21, 33, 40, ${0.5 + v * 0.42})`);
  const wallBorder = useTransform(poured, (v) => `rgba(120, 188, 216, ${0.6 - v * 0.24})`);

  if (reduce) {
    const staticZ = centerZ;
    return (
      <div style={{ transformStyle: 'preserve-3d', position: 'absolute', transform: `translateZ(${staticZ}px)` }}>
        <div
          className="absolute rounded-[1px] border"
          style={{
            left: -half, top: -half, width: size, height: size,
            background: 'rgba(120,188,216,0.16)', borderColor: 'rgba(135,206,235,0.5)',
            transform: `translateZ(${FLOOR_H / 2}px)`,
          }}
        />
        <div
          className="absolute border"
          style={{
            left: -FLOOR_H / 2, top: -half, width: FLOOR_H, height: size,
            background: 'rgba(21,33,40,0.92)', borderColor: 'rgba(120,188,216,0.36)',
            transform: `rotateY(90deg) translateZ(${half}px)`,
          }}
        />
        <div
          className="absolute border"
          style={{
            left: -half, top: -FLOOR_H / 2, width: size, height: FLOOR_H,
            background: 'rgba(21,33,40,0.8)', borderColor: 'rgba(120,188,216,0.3)',
            transform: `rotateX(-90deg) translateZ(${half}px)`,
          }}
        />
      </div>
    );
  }

  // `size`/`half`/`FLOOR_H` are static per floor (only colour/opacity move
  // with scroll), so the rotate+push-out transform for each face is a plain
  // string, not a Framer motion-value composition. Framer's `rotateY`/
  // `translateZ` shorthand props compose in ITS OWN fixed order, not the
  // "rotate first, then push out along the new axis" order this math depends
  // on — passing `transform` directly bypasses that.
  const rightWallTransform = `rotateY(90deg) translateZ(${half}px)`;
  const frontWallTransform = `rotateX(-90deg) translateZ(${half}px)`;
  const rightScafTransform = `rotateY(90deg) translateZ(${half + 3}px)`;
  const frontScafTransform = `rotateX(-90deg) translateZ(${half + 3}px)`;

  return (
    <motion.div style={{ transformStyle: 'preserve-3d', position: 'absolute', translateZ: dropZ, opacity }}>
      {/* Top face — the slab roof. */}
      <motion.div
        className="absolute rounded-[1px] border"
        style={{ left: -half, top: -half, width: size, height: size, background: topBg, borderColor: topBorder, transform: `translateZ(${FLOOR_H / 2}px)` }}
      />
      {/* Right wall (+X) — catches the "sun" a little brighter. */}
      <motion.div
        className="absolute border"
        style={{
          left: -FLOOR_H / 2, top: -half, width: FLOOR_H, height: size,
          background: wallBg, borderColor: wallBorder,
          transform: rightWallTransform,
        }}
      />
      {/* Front wall (+Y) — the shaded side, slightly darker for depth. */}
      <motion.div
        className="absolute border"
        style={{
          left: -half, top: -FLOOR_H / 2, width: size, height: FLOOR_H,
          background: wallBg, borderColor: wallBorder, opacity: 0.75,
          transform: frontWallTransform,
        }}
      />

      {/* Live construction state layers (active -> curing -> finished). */}

      {/* Exposed rebar ring — bars poking up around the slab as it pours. */}
      <motion.div
        className="absolute"
        style={{
          left: -half + 3, top: -half + 3, width: size - 6, height: size - 6,
          opacity: active, transform: `translateZ(${FLOOR_H / 2 + 2}px)`,
        }}
      >
        <div className="absolute" style={{ top: 0, left: 0, right: 0, height: 3, background: `repeating-linear-gradient(90deg, ${STEEL} 0 2px, transparent 2px 8px)` }} />
        <div className="absolute" style={{ bottom: 0, left: 0, right: 0, height: 3, background: `repeating-linear-gradient(90deg, ${STEEL} 0 2px, transparent 2px 8px)` }} />
        <div className="absolute" style={{ left: 0, top: 0, bottom: 0, width: 3, background: `repeating-linear-gradient(0deg, ${STEEL} 0 2px, transparent 2px 8px)` }} />
        <div className="absolute" style={{ right: 0, top: 0, bottom: 0, width: 3, background: `repeating-linear-gradient(0deg, ${STEEL} 0 2px, transparent 2px 8px)` }} />
      </motion.div>

      {/* Pulsing beacon on the actively-poured floor. */}
      <motion.div
        className="absolute animate-pulse"
        style={{
          left: -half - 5, top: -half - 5, width: size + 10, height: size + 10,
          opacity: active, borderRadius: 2,
          border: '1px solid rgba(135, 206, 235, 0.55)',
          transform: `translateZ(${FLOOR_H / 2 + 2}px)`,
        }}
      />

      {/* Scaffolding wrap (green safety mesh) on the two visible faces. */}
      <motion.div
        className="absolute"
        style={{
          left: -half, top: -FLOOR_H / 2 - 3, width: size, height: FLOOR_H + 6,
          opacity: scaffold, transform: frontScafTransform,
          background: `repeating-linear-gradient(90deg, ${MESH_LINE} 0 2px, transparent 2px 13px), repeating-linear-gradient(45deg, ${MESH} 0 2px, transparent 2px 9px)`,
          border: '1px solid rgba(126, 190, 158, 0.45)',
        }}
      />
      <motion.div
        className="absolute"
        style={{
          left: -FLOOR_H / 2 - 3, top: -half, width: FLOOR_H + 6, height: size,
          opacity: scaffold, transform: rightScafTransform,
          background: `repeating-linear-gradient(0deg, ${MESH_LINE} 0 2px, transparent 2px 13px), repeating-linear-gradient(45deg, ${MESH} 0 2px, transparent 2px 9px)`,
          border: '1px solid rgba(126, 190, 158, 0.45)',
        }}
      />
    </motion.div>
  );
}