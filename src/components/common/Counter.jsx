import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/** Counts up once when scrolled into view. Eases out so the last digits settle. */
export function Counter({ value, suffix = '', duration = 1800, className = '' }) {
  const ref = useRef(null);
  // Trigger as soon as the number is meaningfully on screen. At 0.5 a stat sitting
  // at the fold could stay visible on '0' without ever counting.
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduce) {
      setN(value);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {n.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}
