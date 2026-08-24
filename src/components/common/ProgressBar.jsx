import { motion } from 'framer-motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';

/** Construction-progress meter. Fills on scroll-into-view. */
export function ProgressBar({ value = 0, label = 'Construction progress', compact = false }) {
  const reduce = useMotionPreference();
  const pct = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between">
        <span className={`font-semibold text-ink-600 dark:text-ink-300 ${compact ? 'text-[11px]' : 'text-xs'}`}>
          {label}
        </span>
        <span className={`font-bold text-brand-600 dark:text-brand-400 ${compact ? 'text-[11px]' : 'text-xs'}`}>
          {pct}%
        </span>
      </div>
      <div className={`w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800 ${compact ? 'h-1.5' : 'h-2'}`}>
        <motion.div
          className="relative h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700"
          initial={reduce ? false : { width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={reduce ? { width: `${pct}%` } : undefined}
        >
          {/* Light sweep that reads as "work in progress" without being loud. */}
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-y-0 w-1/3 animate-shimmer bg-gold-sheen" />
          </span>
        </motion.div>
      </div>
    </div>
  );
}
