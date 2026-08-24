import { useEffect } from 'react';

/**
 * Sets document title + meta description per route. A small hand-rolled helper
 * rather than a dependency -- this site is a client-rendered SPA with no SSR.
 */
export function usePageMeta(title, description) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
  }, [title, description]);
}
