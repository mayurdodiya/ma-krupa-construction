import {
  Search, PenTool, FileSignature, HardHat, ClipboardCheck, KeyRound,
} from 'lucide-react';
import { about } from '@/lib/site';
import { SectionHeading } from '@/components/common/SectionHeading';
import { RevealGroup, RevealItem } from '@/components/common/Reveal';

const ICONS = { Search, PenTool, FileSignature, HardHat, ClipboardCheck, KeyRound };

export function ProcessTimeline() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-16 text-white sm:py-20 lg:py-24">
      <div aria-hidden="true" className="absolute inset-0 bg-grid-lines bg-[size:56px_56px] opacity-[0.14]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 end-1/4 h-80 w-80 rounded-full bg-brand-600/15 blur-3xl" />

      <div className="container-x relative">
        <SectionHeading
          light
          eyebrow="How We Work"
          title="Six steps from first enquiry to handover"
          subtitle="No stage is a black box. You know what happens next, who owns it and what it costs, before it starts."
        />

        <RevealGroup className="relative mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" stagger={0.09}>
          {/* Connecting rule on wide screens: reads as a site datum line. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-brand-500/35 to-transparent lg:block"
          />

          {about.process.map((step) => {
            const Icon = ICONS[step.icon] ?? Search;
            return (
              <RevealItem key={step.step} className="relative">
                <div className="group">
                  <div className="relative z-10 flex items-center gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/12 bg-ink-900 text-brand-400 transition-all duration-400 group-hover:-translate-y-1 group-hover:border-brand-500 group-hover:bg-brand-600 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="font-display text-5xl font-extrabold leading-none text-white/[0.07] transition-colors duration-400 group-hover:text-brand-500/25">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-extrabold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{step.text}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
