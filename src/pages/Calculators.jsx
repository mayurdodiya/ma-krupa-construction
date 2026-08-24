import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Calculator, TrendingUp } from 'lucide-react';
import { calculators, site } from '@/lib/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHero } from '@/components/common/PageHero';
import { EmiCalculator } from '@/components/calculators/EmiCalculator';
import { RoiCalculator } from '@/components/calculators/RoiCalculator';

const TABS = [
  { id: 'emi', label: 'EMI Calculator', icon: Calculator },
  { id: 'roi', label: 'ROI Calculator', icon: TrendingUp },
];

export default function Calculators() {
  // Tab lives in the URL so the footer, chatbot and project pages can link
  // straight to the calculator the visitor actually needs.
  const [params, setParams] = useSearchParams();
  const raw = params.get('tab');
  const tab = TABS.some((t) => t.id === raw) ? raw : 'emi';
  const cfg = tab === 'emi' ? calculators.emi : calculators.roi;

  usePageMeta(
    `EMI and ROI Calculators — ${site.name}`,
    'Work out your home loan EMI and your projected return on investment, pre-filled with real rates from Ma Krupa Construction projects.',
  );

  return (
    <>
      <PageHero
        image="/images/about/story.jpg"
        eyebrow="Plan Your Purchase"
        title={cfg.title}
        subtitle={cfg.subtitle}
        breadcrumbs={[{ label: 'Calculators' }]}
      >
        <div className="inline-flex gap-1 rounded-xl border border-white/12 bg-white/[0.05] p-1.5 backdrop-blur-sm">
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setParams({ tab: t.id }, { replace: true })}
                aria-pressed={active}
                className={`relative inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${
                  active ? 'text-white' : 'text-white/55 hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="calc-tab"
                    className="absolute inset-0 rounded-lg bg-brand-600"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <t.icon className="relative h-4 w-4" />
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>
      </PageHero>

      <section className="bg-white py-12 dark:bg-ink-950 sm:py-16">
        <div className="container-x">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {tab === 'emi' ? <EmiCalculator /> : <RoiCalculator />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
