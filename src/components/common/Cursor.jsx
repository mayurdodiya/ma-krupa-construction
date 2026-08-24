import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';

/**
 * Ma Krupa cursor — a surveyor's reticle.
 *
 * Rather than the usual "big blurry circle", the ring is drawn as a theodolite
 * / total-station sight: a thin gold ring with four tick marks at N/E/S/W and a
 * centre dot. It reads as a site-survey instrument, which is the one piece of
 * cursor iconography that is actually construction-specific.
 *
 * Behaviour
 *  - dot follows the pointer 1:1, ring trails on a spring (the weight is what
 *    makes it feel expensive rather than twitchy)
 *  - over links/buttons the reticle opens up and the ring thickens
 *  - over media (`data-cursor="view"`) it becomes a labelled disc
 *  - on press it contracts, like a shutter
 *
 * Never mounted for touch/coarse pointers or when the user has asked for
 * reduced motion — those visitors keep the native cursor (see `.has-cursor` in
 * index.css, which is only added when this component is actually live).
 */

const RING = 46; // px, resting diameter

export function Cursor() {
  const reduce = useMotionPreference();
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState('default'); // default | link | view | text
  const [label, setLabel] = useState('');
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  // Raw pointer position (no React state — this updates on every mousemove).
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  // The ring lags behind on a spring; the dot tracks almost exactly.
  const ringX = useSpring(x, { stiffness: 380, damping: 34, mass: 0.55 });
  const ringY = useSpring(y, { stiffness: 380, damping: 34, mass: 0.55 });
  const dotX = useSpring(x, { stiffness: 1100, damping: 48, mass: 0.25 });
  const dotY = useSpring(y, { stiffness: 1100, damping: 48, mass: 0.25 });

  const rafRef = useRef(0);

  useEffect(() => {
    if (reduce) return undefined;
    if (typeof window === 'undefined') return undefined;
    // Coarse pointers (touch) and hover-less devices keep the OS cursor.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    setEnabled(true);
    document.documentElement.classList.add('has-cursor');

    const onMove = (e) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        x.set(e.clientX);
        y.set(e.clientY);
      });
      setVisible(true);
    };

    // Event delegation: one listener decides the variant from the hovered node.
    const onOver = (e) => {
      const el = e.target instanceof Element ? e.target : null;
      if (!el) return;

      const tagged = el.closest('[data-cursor]');
      if (tagged) {
        setVariant(tagged.getAttribute('data-cursor') || 'link');
        setLabel(tagged.getAttribute('data-cursor-label') || '');
        return;
      }
      if (el.closest('a, button, [role="button"], label, summary')) {
        setVariant('link');
        setLabel('');
        return;
      }
      if (el.closest('input, textarea, select')) {
        setVariant('text');
        setLabel('');
        return;
      }
      setVariant('default');
      setLabel('');
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  const isView = variant === 'view';
  const isLink = variant === 'link';
  const isText = variant === 'text';

  const ringScale = (isView ? 2.35 : isLink ? 1.45 : isText ? 0.5 : 1) * (pressed ? 0.82 : 1);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block">
      {/* --- Reticle ring --- */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: ringX, y: ringY }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2"
          style={{ width: RING, height: RING }}
          animate={{ scale: ringScale, rotate: isView ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          {/* Filled disc appears only for the media/"view" state. */}
          <motion.div
            className="absolute inset-0 rounded-full bg-brand-500"
            animate={{ opacity: isView ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          />

          <svg viewBox="0 0 46 46" className="absolute inset-0 h-full w-full">
            <motion.circle
              cx="23"
              cy="23"
              r="21"
              fill="none"
              stroke="#C39336"
              animate={{ strokeWidth: isLink ? 1.6 : 1, opacity: isView ? 0 : 1 }}
              transition={{ duration: 0.25 }}
            />
            {/* Survey ticks at N / E / S / W. */}
            <motion.g
              stroke="#C39336"
              strokeWidth="1.4"
              strokeLinecap="round"
              animate={{ opacity: isView || isText ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <line x1="23" y1="0" x2="23" y2="7" />
              <line x1="23" y1="39" x2="23" y2="46" />
              <line x1="0" y1="23" x2="7" y2="23" />
              <line x1="39" y1="23" x2="46" y2="23" />
            </motion.g>
          </svg>

          {/* Label for media targets ("VIEW", "DRAG", …). */}
          <motion.span
            className="absolute inset-0 grid place-items-center text-[7px] font-bold uppercase tracking-[0.18em] text-ink-950"
            animate={{ opacity: isView && label ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ rotate: -45 }}
          >
            {label}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* --- Centre dot --- */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: dotX, y: dotY }}
        animate={{ opacity: visible && !isView ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-300"
          animate={
            isText
              ? { width: 2, height: 22, borderRadius: 2 }
              : { width: pressed ? 3 : 5, height: pressed ? 3 : 5, borderRadius: 999 }
          }
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        />
      </motion.div>
    </div>
  );
}
