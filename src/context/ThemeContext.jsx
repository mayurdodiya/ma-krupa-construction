import { createContext, useContext, useEffect, useMemo } from 'react';

const ThemeContext = createContext(null);

/**
 * Ma Krupa ships a single dark-luxury identity — the ivory sections are
 * per-section `.panel-light` panels, not a second colour mode. The provider is
 * kept (rather than deleted) so every consumer keeps working, and so a future
 * light mode can be reintroduced in one place.
 *
 * The `dark` class is also set by the inline script in index.html; this just
 * guarantees it if that script was stripped by a host or blocked by CSP.
 */
export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const value = useMemo(
    () => ({ theme: 'dark', isDark: true, setTheme: () => {}, toggle: () => {} }),
    [],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
