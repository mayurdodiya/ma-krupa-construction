import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

/**
 * Shared motion vocabulary.
 *
 * Two rules hold across every primitive here:
 *  1. `prefers-reduced-motion` renders the *final* state immediately — never a
 *     hidden element waiting on an animation that will not run.
 *  2. Scroll-linked values are passed through a spring, which is what removes
 *     the 1:1 "stuck to the scrollbar" feel and makes parallax read as smooth.
 */

const EASE = [0.22, 1, 0.36, 1];
const SOFT_SPRING = { stiffness: 90, damping: 24, mass: 0.6, restDelta: 0.001 };

/** Scroll-triggered entrance used across every section. */
export function Reveal({ children, delay = 0, y = 26, className = '', as = 'div' }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

/** Staggers direct children. Pair with <RevealItem>. */
export function RevealGroup({ children, className = '', stagger = 0.09, delay = 0 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = '', y = 26 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Card-style entrance: rises and settles out of a slight 3D tilt. */
export function TiltIn({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 44, rotateX: 9 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.95, delay, ease: EASE }}
      style={{ transformPerspective: 1200 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Vertical parallax driven by the element's own pass through the viewport.
 * `speed` is the total travel in px; the spring is what keeps it fluid.
 */
export function Parallax({ children, speed = 60, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const raw = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const y = useSpring(raw, SOFT_SPRING);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Parallax + slow zoom for full-bleed background plates. Applied to the image
 * wrapper, not the section, so the section's own overflow does the cropping.
 */
export function ParallaxImage({ src, alt = '', speed = 90, zoom = 1.18, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rawY = useTransform(scrollYProgress, [0, 1], [`-${speed / 2}px`, `${speed / 2}px`]);
  const y = useSpring(rawY, SOFT_SPRING);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        style={reduce ? undefined : { y, scale: zoom }}
      />
    </div>
  );
}

/**
 * Splits a headline into words and lifts each out of a mask. Reserved for
 * headline moments — the extra weight only pays off where it is the focus.
 */
export function WordReveal({ text, className = '', delay = 0, stagger = 0.07, inView = false }) {
  const reduce = useReducedMotion();
  const words = String(text).split(' ');

  if (reduce) return <span className={className}>{text}</span>;

  const animateProps = inView
    ? { whileInView: 'show', viewport: { once: true, amount: 0.4 } }
    : { animate: 'show' };

  return (
    <motion.span
      className={className}
      initial="hidden"
      {...animateProps}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '112%', opacity: 0 },
              show: { y: '0%', opacity: 1, transition: { duration: 1, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/**
 * Curtain wipe: the content is revealed by a clip-path opening upward while a
 * gold bar sweeps across. Used for images and pull-quotes.
 */
export function MaskReveal({ children, className = '', delay = 0, direction = 'up' }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  const from =
    direction === 'left'
      ? 'inset(0 100% 0 0)'
      : direction === 'right'
        ? 'inset(0 0 0 100%)'
        : 'inset(100% 0 0 0)';

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ clipPath: from }}
      whileInView={{ clipPath: 'inset(0 0 0 0)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.15, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Magnetic hover — the element leans toward the pointer and springs back.
 * Applied to primary CTAs and icon buttons; pairs with the custom cursor.
 */
export function Magnetic({ children, className = '', strength = 0.32 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.5 });
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.5 });

  if (reduce) return <div className={className}>{children}</div>;

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}

/**
 * Pointer-tracking 3D tilt. `depth` children can be lifted with translateZ by
 * the caller because this establishes `preserve-3d`.
 */
export function Tilt3D({ children, className = '', max = 9, scale = 1.02 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 220, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 220, damping: 20 });

  if (reduce) return <div className={className}>{children}</div>;

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(-py * max * 2);
    ry.set(px * max * 2);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`preserve-3d ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      whileHover={{ scale }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}

/** Scroll-linked horizontal drift, for marquee-ish accent text. */
export function DriftX({ children, from = -60, to = 60, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const raw = useTransform(scrollYProgress, [0, 1], [from, to]);
  const x = useSpring(raw, SOFT_SPRING);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} style={{ x }} className={className}>
      {children}
    </motion.div>
  );
}
