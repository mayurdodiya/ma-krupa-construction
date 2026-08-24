import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Info, Building2, RotateCcw, TrendingUp, ArrowRight } from 'lucide-react';
import { calculators, formatINRShort, projects } from '@/lib/site';
import { calculateRoi } from '@/lib/finance';
import { SliderField } from './SliderField';

const cfg = calculators.roi;

/** Projects that carry a rent assumption, offered as one-tap presets. */
const PRESETS = projects.filter((p) => p.expectedRentPerSqftMonth > 0);

export function RoiCalculator() {
  const [form, setForm] = useState(cfg.defaults);
  const [preset, setPreset] = useState('');

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setPreset('');
  };

  // Loading a project fills every assumption from that project's own JSON row.
  const applyPreset = (project) => {
    const area = Number(String(project.areaRange).replace(/[^0-9]/g, '').slice(0, 5)) || form.areaSqft;
    setForm({
      ...form,
      investment: project.priceFrom,
      areaSqft: area,
      rentPerSqftMonth: project.expectedRentPerSqftMonth,
      appreciationRate: project.appreciationRate,
    });
    setPreset(project.id);
  };

  const result = useMemo(() => calculateRoi(form), [form]);
  const peak = Math.max(...result.schedule.map((s) => s.totalValue), 1);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Inputs */}
      <div className="lg:col-span-5">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-extrabold text-ink-900 dark:text-white">Your assumptions</h3>
            <button
              type="button"
              onClick={() => { setForm(cfg.defaults); setPreset(''); }}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-ink-500 transition-colors hover:bg-ink-50 hover:text-brand-600 dark:hover:bg-ink-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          <div className="mt-5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-400">
              <Building2 className="h-3.5 w-3.5" />
              Load a project
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`rounded-md border px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                    preset === p.id
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-ink-200 text-ink-600 hover:border-brand-500 hover:text-brand-600 dark:border-ink-700 dark:text-ink-300'
                  }`}
                >
                  {p.name.replace('Ma Krupa ', '')}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-6 border-t border-ink-100 pt-6 dark:border-ink-800">
            <SliderField label="Investment" format="currency" value={form.investment} onChange={set('investment')} {...cfg.limits.investment} />
            <SliderField label="Carpet area" suffix=" sq.ft." value={form.areaSqft} onChange={set('areaSqft')} {...cfg.limits.areaSqft} />
            <SliderField
              label="Rent per sq.ft. / month" format="currency" value={form.rentPerSqftMonth}
              onChange={set('rentPerSqftMonth')} {...cfg.limits.rentPerSqftMonth}
              hint={`Gross monthly rent ${formatINRShort(result.monthlyRentYear1)} at ${form.occupancyPercent}% occupancy`}
            />
            <SliderField label="Annual appreciation" format="percent" value={form.appreciationRate} onChange={set('appreciationRate')} {...cfg.limits.appreciationRate} />
            <SliderField label="Holding period" suffix=" years" value={form.holdingYears} onChange={set('holdingYears')} {...cfg.limits.holdingYears} />
            <SliderField label="Occupancy" format="percent" value={form.occupancyPercent} onChange={set('occupancyPercent')} {...cfg.limits.occupancyPercent} />
            <SliderField label="Rent escalation" format="percent" value={form.rentEscalationPercent} onChange={set('rentEscalationPercent')} {...cfg.limits.rentEscalationPercent} />
            <SliderField
              label="Annual holding costs" format="percent" value={form.annualCostsPercent}
              onChange={set('annualCostsPercent')} {...cfg.limits.annualCostsPercent}
              hint="Maintenance, property tax and insurance, as a share of current value"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6 lg:col-span-7">
        <div className="relative overflow-hidden rounded-2xl bg-ink-950 p-7 text-white">
          <div aria-hidden="true" className="absolute inset-0 bg-grid-lines bg-[size:44px_44px] opacity-[0.15]" />
          <div aria-hidden="true" className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-400">
              Total return over {form.holdingYears} years
            </p>
            <motion.p
              key={result.totalReturnPercent.toFixed(1)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-1 flex flex-wrap items-baseline gap-3 font-display text-4xl font-extrabold sm:text-5xl"
            >
              {formatINRShort(result.totalReturn)}
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2.5 py-1 text-base text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                +{result.totalReturnPercent.toFixed(1)}%
              </span>
            </motion.p>
            <p className="mt-1.5 text-sm text-white/50">
              on {formatINRShort(result.invested)} invested, a CAGR of {result.cagr.toFixed(2)}%
            </p>

            <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-4">
              {[
                { label: 'Exit value', value: formatINRShort(result.exitValue) },
                { label: 'Capital gain', value: formatINRShort(result.capitalGain) },
                { label: 'Net rent income', value: formatINRShort(result.totalRentIncome) },
                { label: 'Gross yield yr 1', value: `${result.grossYield.toFixed(2)}%` },
              ].map((s) => (
                <div key={s.label} className="bg-ink-950/80 px-4 py-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40">{s.label}</p>
                  <p className="mt-0.5 font-display text-base font-extrabold">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Growth chart: total wealth per year, property value plus cumulative net rent. */}
        <div className="card p-6">
          <h3 className="font-display text-base font-extrabold text-ink-900 dark:text-white">Wealth over time</h3>
          <p className="mt-0.5 text-xs muted">
            Bar height is property value plus rent collected to that year. Gold is the property,
            the lighter band is accumulated rent.
          </p>

          <div className="mt-6 flex h-48 items-end gap-1.5">
            {result.schedule.map((row) => {
              const total = (row.totalValue / peak) * 100;
              const rentShare = row.totalValue > 0 ? (row.cumulativeNetRent / row.totalValue) * 100 : 0;
              return (
                <div key={row.year} className="group relative flex flex-1 flex-col items-center justify-end">
                  <motion.div
                    className="flex w-full flex-col-reverse overflow-hidden rounded-t-md"
                    initial={{ height: 0 }}
                    animate={{ height: `${total}%` }}
                    transition={{ duration: 0.6, delay: row.year * 0.03, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="w-full flex-1 bg-gradient-to-t from-brand-700 to-brand-500" />
                    <span className="w-full bg-emerald-500/70" style={{ height: `${rentShare}%` }} />
                  </motion.div>

                  <span className="mt-1.5 text-[9px] font-semibold text-ink-400">{row.year}</span>

                  <span className="pointer-events-none absolute bottom-full z-10 mb-2 hidden w-max rounded-lg bg-ink-950 px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-soft group-hover:block">
                    Year {row.year}
                    <br />
                    Value {formatINRShort(row.propertyValue)}
                    <br />
                    Rent {formatINRShort(row.cumulativeNetRent)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Yearly table */}
        <div className="card overflow-hidden">
          <div className="border-b border-ink-100 px-6 py-4 dark:border-ink-800">
            <h3 className="font-display text-base font-extrabold text-ink-900 dark:text-white">Year-by-year projection</h3>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-ink-50 text-[10px] uppercase tracking-wide text-ink-500 dark:bg-ink-800 dark:text-ink-400">
                <tr>
                  <th className="px-4 py-2.5 text-left font-bold">Year</th>
                  <th className="px-4 py-2.5 text-right font-bold">Gross rent</th>
                  <th className="hidden px-4 py-2.5 text-right font-bold sm:table-cell">Costs</th>
                  <th className="px-4 py-2.5 text-right font-bold">Net rent</th>
                  <th className="px-4 py-2.5 text-right font-bold">Property value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {result.schedule.map((row) => (
                  <tr key={row.year} className="transition-colors hover:bg-brand-50/50 dark:hover:bg-ink-800/50">
                    <td className="px-4 py-2.5 font-semibold text-ink-800 dark:text-ink-100">{row.year}</td>
                    <td className="px-4 py-2.5 text-right text-ink-600 dark:text-ink-300">{formatINRShort(row.grossRent)}</td>
                    <td className="hidden px-4 py-2.5 text-right text-ink-500 sm:table-cell dark:text-ink-400">
                      -{formatINRShort(row.costs)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatINRShort(row.netRent)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-ink-800 dark:text-ink-100">
                      {formatINRShort(row.propertyValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-ink-50 p-5 dark:border-ink-800 dark:bg-ink-900/50">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-500">
            <Info className="h-3.5 w-3.5" />
            How to read this
          </p>
          <ul className="mt-3 space-y-2">
            {cfg.notes.map((n) => (
              <li key={n} className="flex gap-2 text-[13px] leading-relaxed text-ink-600 dark:text-ink-300">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                {n}
              </li>
            ))}
          </ul>

          <Link to="/projects" className="btn-primary mt-5 !py-2.5">
            Browse investment-grade projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
