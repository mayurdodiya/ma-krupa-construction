import { Hero } from '@/components/home/Hero';
import { WordmarkReveal } from '@/components/home/WordmarkReveal';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { MarqueeStrip } from '@/components/home/MarqueeStrip';
import { ProjectShowcase } from '@/components/home/ProjectShowcase';
import { Tower3D } from '@/components/home/Tower3D';
import { LegacyBanner } from '@/components/home/LegacyBanner';
import { WhyUs } from '@/components/home/WhyUs';
import { CalculatorTeaser } from '@/components/home/CalculatorTeaser';
import { ReraStrip } from '@/components/home/ReraStrip';
import { Testimonials } from '@/components/home/Testimonials';
import { CtaBanner } from '@/components/home/CtaBanner';
import { usePageMeta } from '@/hooks/usePageMeta';
import { site } from '@/lib/site';

/**
 * Landing page rhythm alternates dark → ivory → dark so the scroll has light
 * and shade rather than one continuous tone:
 *
 *   Hero (cinematic) → Wordmark (ivory curtain) → Segments → Marquee
 *   → Portfolio rails → 3D build process → Legacy plate → Why us
 *   → Calculators → RERA → Testimonials → CTA
 *
 * `ProcessTimeline` deliberately no longer appears here — `Tower3D` tells the
 * same build-stage story with the 3D model, and the timeline still runs in full
 * on the About page.
 */
export default function Home() {
  usePageMeta(`${site.name} — ${site.tagline}`, site.slogan);

  return (
    <>
      <Hero />
      <WordmarkReveal />
      <CategoryShowcase />
      <MarqueeStrip />
      <ProjectShowcase />
      <Tower3D />
      <LegacyBanner />
      <WhyUs />
      <CalculatorTeaser />
      <ReraStrip />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
