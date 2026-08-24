import { useEffect } from 'react';

/**
 * Freezes background scroll while an overlay (mobile nav, lightbox) is open.
 * Restores the previous inline value rather than blanking it, so two overlays
 * closing out of order cannot leave the page permanently unscrollable.
 */
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
