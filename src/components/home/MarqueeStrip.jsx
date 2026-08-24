import { useReducedMotion } from 'framer-motion';
import { site } from '@/lib/site';

/**
 * Slow gold marquee separating the dark sections.
 *
 * The track is duplicated once and translated -50%, which is what makes the
 * loop seamless — the copy is `aria-hidden` so the phrase is announced a single
 * time to assistive tech. Reduced motion drops the animation and simply centres
 * the list.
 */
export function MarqueeStrip() {
  const reduce = useReducedMotion();
  const items = site.usp ?? [];
  if (!items.length) return null;

  const track = [...items, ...items];

  return (
    <section className="relative overflow-hidden border-y border-white/[0.07] bg-ink-900/40 py-5">
      <h2 className="sr-only">Why {site.shortName}</h2>
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="edge-fade">
        <div
          aria-hidden="true"
          className={`flex w-max items-center gap-10 whitespace-nowrap ${
            reduce ? 'justify-center' : 'animate-marquee'
          }`}
        >
          {track.map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-10">
              <span className="font-display text-lg italic text-white/45 sm:text-xl">{item}</span>
              <span className="h-1.5 w-1.5 rotate-45 bg-brand-500" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
