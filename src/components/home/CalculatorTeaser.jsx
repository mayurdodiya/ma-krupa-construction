import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, ArrowRight, IndianRupee, PiggyBank } from 'lucide-react';
import { calculators } from '@/lib/site';
import { calculateEmi, calculateRoi } from '@/lib/finance';
import { formatINRShort } from '@/lib/site';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Reveal, TiltIn } from '@/components/common/Reveal';

/** Shows a real worked example from the JSON defaults, not a made-up figure. */
export function CalculatorTeaser() {
  const e = calculators.emi.defaults;
  const loan = e.propertyPrice * (1 - e.downPaymentPercent / 100);
  const emi = calculateEmi({ principal: loan, annualRate: e.interestRate, tenureYears: e.tenureYears });

  const r = calculators.roi.defaults;
  const roi = calculateRoi(r);

  return (
    <section className="bg-white py-16 dark:bg-ink-950 sm:py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Plan Before You Commit"
          title="Run the numbers yourself"
          subtitle="Two calculators, pre-filled with the real rates from our projects. No sign-up, no lead form in the way of the answer."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* EMI */}
          <TiltIn className="h-full">
            <Link
              to="/calculators?tab=emi"
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-gradient-to-br from-white to-ink-50 p-7 shadow-soft transition-all duration-400 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-glow dark:border-ink-800 dark:from-ink-900 dark:to-ink-950"
            >
              <span aria-hidden="true" className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-brand-500/[0.07] transition-transform duration-700 group-hover:scale-150" />

              <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
                <Calculator className="h-5 w-5" />
              </span>

              <h3 className="relative mt-5 font-display text-2xl font-extrabold text-ink-900 dark:text-white">
                EMI Calculator
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed muted">
                Monthly outgo, total interest and a year-by-year amortisation view for any budget,
                rate and tenure.
              </p>

              <div className="relative mt-6 rounded-xl border border-ink-100 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
                <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400">
                  Example: {formatINRShort(e.propertyPrice)} at {e.interestRate}% for {e.tenureYears} years
                </p>
                <p className="mt-1 flex items-baseline gap-1 font-display text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                  <IndianRupee className="h-6 w-6" />
                  {Math.round(emi.emi).toLocaleString('en-IN')}
                  <span className="text-sm font-semibold text-ink-400">/ month</span>
                </p>
                <p className="mt-1 text-xs muted">
                  Loan {formatINRShort(loan)} &middot; Total interest {formatINRShort(emi.totalInterest)}
                </p>
              </div>

              <span className="relative mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-brand-600 dark:text-brand-400">
                Open EMI calculator
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </TiltIn>

          {/* ROI */}
          <TiltIn className="h-full" delay={0.1}>
            <Link
              to="/calculators?tab=roi"
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-gradient-to-br from-white to-ink-50 p-7 shadow-soft transition-all duration-400 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-glow dark:border-ink-800 dark:from-ink-900 dark:to-ink-950"
            >
              <span aria-hidden="true" className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/[0.07] transition-transform duration-700 group-hover:scale-150" />

              <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
                <TrendingUp className="h-5 w-5" />
              </span>

              <h3 className="relative mt-5 font-display text-2xl font-extrabold text-ink-900 dark:text-white">
                ROI Calculator
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed muted">
                Rental yield, capital appreciation and total return over your holding period, with a
                year-by-year projection.
              </p>

              <div className="relative mt-6 rounded-xl border border-ink-100 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
                <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400">
                  Example: {formatINRShort(r.investment)} held for {r.holdingYears} years
                </p>
                <p className="mt-1 flex items-baseline gap-2 font-display text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  +{roi.totalReturnPercent.toFixed(0)}%
                  <span className="text-sm font-semibold text-ink-400">total return</span>
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs muted">
                  <PiggyBank className="h-3.5 w-3.5" />
                  Exit value {formatINRShort(roi.exitValue)} &middot; Rent {formatINRShort(roi.totalRentIncome)}
                </p>
              </div>

              <span className="relative mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-brand-600 dark:text-brand-400">
                Open ROI calculator
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </TiltIn>
        </div>

        <Reveal className="mt-6 text-center text-xs muted" delay={0.15}>
          Figures are indicative and for planning only. Your sanctioned rate and realised return
          will depend on the lender, the market and the specific unit.
        </Reveal>
      </div>
    </section>
  );
}
