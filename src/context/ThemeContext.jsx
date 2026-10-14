import { createContext, useContext, useEffect, useMemo } from 'react';

const ThemeContext = createContext(null);

/**
 * Maa Krupa now ships a single light coastal-blue identity — the navy
 * sections (footer, CTA bands, photo overlays) are per-section `.panel-dark`
 * panels, not a second colour mode. The provider is kept (rather than
 * deleted) so every consumer keeps working, and so a future dark mode can be
 * reintroduced in one place.
 *
 * The site's many `dark:` utility classes were originally written for a
 * real dark mode; forcing the `dark` class off here (it used to be forced
 * ON) means those components now render their base (light) classes, which
 * is exactly the theme we want. Nothing needs to keep adding `dark` — the
 * inline script in index.html was updated to match.
 */
export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const value = useMemo(
    () => ({ theme: 'light', isDark: false, setTheme: () => {}, toggle: () => {} }),
    [],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
