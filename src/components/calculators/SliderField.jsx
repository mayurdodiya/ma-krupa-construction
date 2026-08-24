import { formatINR } from '@/lib/site';

/**
 * Paired slider + number input. The number input exists because dragging a
 * slider to an exact 92,00,000 is miserable on a phone; the slider exists
 * because typing is slow when you are exploring a range.
 */
export function SliderField({
  label, value, onChange, min, max, step,
  format = 'number', suffix = '', hint,
}) {
  const display =
    format === 'currency' ? formatINR(value)
      : format === 'percent' ? `${value}%`
        : `${Number(value).toLocaleString('en-IN')}${suffix}`;

  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <label className="field-label mb-0" htmlFor={`sf-${label}`}>{label}</label>
        <span className="font-display text-sm font-extrabold text-brand-600 dark:text-brand-400">{display}</span>
      </div>

      <div className="mt-2.5 flex items-center gap-3">
        <input
          id={`sf-${label}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-200 outline-none dark:bg-ink-700 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-600 [&::-webkit-slider-thumb]:shadow-lift [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-125 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand-600"
          style={{
            background: `linear-gradient(to right, #A06C1F 0%, #A06C1F ${pct}%, #D3D7DD ${pct}%)`,
          }}
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            // Clamp rather than reject, so a paste of a large figure still lands in range.
            onChange(Number.isNaN(n) ? min : Math.min(max, Math.max(min, n)));
          }}
          aria-label={`${label} exact value`}
          className="w-28 shrink-0 rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-right text-xs font-semibold text-ink-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-100"
        />
      </div>

      {hint && <p className="mt-1.5 text-[11px] muted">{hint}</p>}
    </div>
  );
}
