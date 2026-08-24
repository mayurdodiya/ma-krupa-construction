import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Info, Landmark, CalendarCheck, RotateCcw } from 'lucide-react';
import { calculators, formatINR, formatINRShort } from '@/lib/site';
import { calculateEmi, amortisationByYear } from '@/lib/finance';
import { SliderField } from './SliderField';

const cfg = calculators.emi;

export function EmiCalculator() {
  const [form, setForm] = useState(cfg.defaults);
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const loanAmount = form.propertyPrice * (1 - form.downPaymentPercent / 100);
  const downPayment = form.propertyPrice - loanAmount;

  const result = useMemo(
    () => calculateEmi({ principal: loanAmount, annualRate: form.interestRate, tenureYears: form.tenureYears }),
    [loanAmount, form.interestRate, form.tenureYears],
  );

  const schedule = useMemo(
    () => amortisationByYear({ principal: loanAmount, annualRate: form.interestRate, tenureYears: form.tenureYears }),
    [loanAmount, form.interestRate, form.tenureYears],
  );

  // Principal vs interest split, drawn as a single stacked bar.
  const interestShare = result.totalPayable > 0 ? (result.totalInterest / result.totalPayable) * 100 : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Inputs */}
      <div className="lg:col-span-5">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-extrabold text-ink-900 dark:text-white">Your numbers</h3>
            <button
              type="button"
              onClick={() => setForm(cfg.defaults)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-ink-500 transition-colors hover:bg-ink-50 hover:text-brand-600 dark:hover:bg-ink-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <SliderField
              label="Property price" format="currency" value={form.propertyPrice}
              onChange={set('propertyPrice')} {...cfg.limits.propertyPrice}
            />
            <SliderField
              label="Down payment" format="percent" value={form.downPaymentPercent}
              onChange={set('downPaymentPercent')} {...cfg.limits.downPaymentPercent}
              hint={`You pay ${formatINRShort(downPayment)} upfront, loan of ${formatINRShort(loanAmount)}`}
            />
            <SliderField
              label="Interest rate" format="percent" value={form.interestRate}
              onChange={set('interestRate')} {...cfg.limits.interestRate}
            />
            <SliderField
              label="Tenure" suffix=" years" value={form.tenureYears}
              onChange={set('tenureYears')} {...cfg.limits.tenureYears}
            />
          </div>

          {/* Approved lenders: tapping one loads its published rate. */}
          <div className="mt-7 border-t border-ink-100 pt-5 dark:border-ink-800">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-400">
              <Landmark className="h-3.5 w-3.5" />
              Approved lenders (tap to apply rate)
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {cfg.banks.map((b) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => set('interestRate')(b.rate)}
                  className={`rounded-md border px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                    form.interestRate === b.rate
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-ink-200 text-ink-600 hover:border-brand-500 hover:text-brand-600 dark:border-ink-700 dark:text-ink-300'
                  }`}
                >
                  {b.name} <span className="opacity-70">{b.rate}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6 lg:col-span-7">
        <div className="relative overflow-hidden rounded-2xl bg-ink-950 p-7 text-white">
          <div aria-hidden="true" className="absolute inset-0 bg-grid-lines bg-[size:44px_44px] opacity-[0.15]" />
          <div aria-hidden="true" className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-brand-600/25 blur-3xl" />

          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-400">Monthly EMI</p>
            <motion.p
              key={Math.round(result.emi)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-1 font-display text-4xl font-extrabold sm:text-5xl"
            >
              {formatINR(result.emi)}
            </motion.p>
            <p className="mt-1.5 text-sm text-white/50">
              over {form.tenureYears} years ({result.months} instalments)
            </p>

            <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-4">
              {[
                { label: 'Loan amount', value: formatINRShort(loanAmount) },
                { label: 'Down payment', value: formatINRShort(downPayment) },
                { label: 'Total interest', value: formatINRShort(result.totalInterest) },
                { label: 'Total payable', value: formatINRShort(result.totalPayable) },
              ].map((s) => (
                <div key={s.label} className="bg-ink-950/80 px-4 py-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40">{s.label}</p>
                  <p className="mt-0.5 font-display text-base font-extrabold">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Principal vs interest */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-[11px] font-semibold text-white/60">
                <span>Principal {(100 - interestShare).toFixed(0)}%</span>
                <span>Interest {interestShare.toFixed(0)}%</span>
              </div>
              <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-white/10">
                <motion.span
                  className="bg-brand-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - interestShare}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.span
                  className="bg-ink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${interestShare}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Amortisation */}
        <div className="card overflow-hidden">
          <div className="border-b border-ink-100 px-6 py-4 dark:border-ink-800">
            <h3 className="font-display text-base font-extrabold text-ink-900 dark:text-white">
              Year-by-year breakdown
            </h3>
            <p className="mt-0.5 text-xs muted">
              Early years are interest-heavy. The bar shows how much of each year goes to principal.
            </p>
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-ink-50 text-[10px] uppercase tracking-wide text-ink-500 dark:bg-ink-800 dark:text-ink-400">
                <tr>
                  <th className="px-4 py-2.5 text-left font-bold">Year</th>
                  <th className="px-4 py-2.5 text-right font-bold">Principal</th>
                  <th className="px-4 py-2.5 text-right font-bold">Interest</th>
                  <th className="hidden px-4 py-2.5 text-right font-bold sm:table-cell">Balance</th>
                  <th className="hidden w-28 px-4 py-2.5 text-left font-bold md:table-cell">Split</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {schedule.map((row) => {
                  const share = row.totalPaid > 0 ? (row.principalPaid / row.totalPaid) * 100 : 0;
                  return (
                    <tr key={row.year} className="transition-colors hover:bg-brand-50/50 dark:hover:bg-ink-800/50">
                      <td className="px-4 py-2.5 font-semibold text-ink-800 dark:text-ink-100">{row.year}</td>
                      <td className="px-4 py-2.5 text-right text-ink-600 dark:text-ink-300">
                        {formatINRShort(row.principalPaid)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-ink-600 dark:text-ink-300">
                        {formatINRShort(row.interestPaid)}
                      </td>
                      <td className="hidden px-4 py-2.5 text-right font-semibold text-ink-800 dark:text-ink-100 sm:table-cell">
                        {formatINRShort(row.balance)}
                      </td>
                      <td className="hidden px-4 py-2.5 md:table-cell">
                        <span className="flex h-1.5 w-24 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
                          <span className="bg-brand-500" style={{ width: `${share}%` }} />
                          <span className="bg-ink-400" style={{ width: `${100 - share}%` }} />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes + next step */}
        <div className="rounded-2xl border border-ink-100 bg-ink-50 p-5 dark:border-ink-800 dark:bg-ink-900/50">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-500">
            <Info className="h-3.5 w-3.5" />
            Before you rely on this
          </p>
          <ul className="mt-3 space-y-2">
            {cfg.notes.map((n) => (
              <li key={n} className="flex gap-2 text-[13px] leading-relaxed text-ink-600 dark:text-ink-300">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                {n}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link to="/book-meeting" className="btn-primary !py-2.5">
              <CalendarCheck className="h-4 w-4" />
              Discuss a payment plan
            </Link>
            <Link to="/projects" className="btn-outline !py-2.5">
              Find a project in this budget
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
