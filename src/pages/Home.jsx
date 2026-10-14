import { Hero } from '@/components/home/Hero';
import { VideoShowcase } from '@/components/home/VideoShowcase';
import { WordmarkReveal } from '@/components/home/WordmarkReveal';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { MarqueeStrip } from '@/components/home/MarqueeStrip';
import { ProjectShowcase } from '@/components/home/ProjectShowcase';
import { Tower3D } from '@/components/home/Tower3D';
import { LegacyBanner } from '@/components/home/LegacyBanner';
import { BusinessShowcase } from '@/components/home/BusinessShowcase';
import { WhyUs } from '@/components/home/WhyUs';
import { CalculatorTeaser } from '@/components/home/CalculatorTeaser';
import { ReraStrip } from '@/components/home/ReraStrip';
import { Testimonials } from '@/components/home/Testimonials';
import { CtaBanner } from '@/components/home/CtaBanner';
import { usePageMeta } from '@/hooks/usePageMeta';
import { site } from '@/lib/site';

/**
 * Landing page rhythm — light coastal-blue base with dark navy accent bands
 * for rhythm and photo/video content:
 *
 *   Hero (carousel, dark photo) → Video Showcase (dark panel, "Our Story")
 *   → 3D Build Process (dark panel) → Wordmark (light curtain) → Segments
 *   → Marquee → Portfolio rails → Legacy plate → Why us → Calculators
 *   → RERA → Testimonials → CTA
 *
 * `Tower3D` was moved up right after `VideoShowcase` so the "attractive
 * video, then 3D animation" sequence lands early, right where a first-time
 * visitor's attention is highest. `ProcessTimeline` deliberately still does
 * not appear here — `Tower3D` tells the same build-stage story with the 3D
 * model, and the timeline still runs in full on the About page.
 */
export default function Home() {
  usePageMeta(`${site.name} — ${site.tagline}`, site.slogan);

  return (
    <>
      <Hero />
      <VideoShowcase />
      <Tower3D />
      <WordmarkReveal />
      <CategoryShowcase />
      <MarqueeStrip />
      <ProjectShowcase />
      <LegacyBanner />
      <BusinessShowcase />
      <WhyUs />
      <CalculatorTeaser />
      <ReraStrip />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
