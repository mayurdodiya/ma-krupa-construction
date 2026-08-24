import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { Menu, X, Phone, ChevronDown, CalendarCheck, Mail, Search, ArrowRight } from 'lucide-react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { site, telLink, mailLink, categories, statuses, projects, products } from '@/lib/site';
import { Magnetic } from '@/components/common/Reveal';

const NAV = [
  { label: 'Home', to: '/' },
  {
    label: 'Projects',
    to: '/projects',
    groups: [
      { title: 'By Stage', items: statuses.map((s) => ({ label: s.name, to: `/projects?status=${s.id}` })) },
      { title: 'By Segment', items: categories.map((c) => ({ label: c.name, to: `/projects?category=${c.id}` })) },
    ],
  },
  { label: 'Services', to: '/products' },
  { label: 'Calculators', to: '/calculators' },
  { label: 'RERA', to: '/rera' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

/* ------------------------------------------------------------------ */
/* Search overlay                                                      */
/* ------------------------------------------------------------------ */

function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) {
      setQ('');
      return undefined;
    }
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Searches both portfolios in one pass; capped so the panel never overflows.
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    const hit = (text) => String(text ?? '').toLowerCase().includes(term);

    const p = projects
      .filter((x) => hit(x.name) || hit(x.location) || hit(x.tagline) || hit(x.category))
      .map((x) => ({ id: x.id, kind: 'Project', label: x.name, meta: x.location, to: `/projects/${x.id}`, img: x.cover }));

    const s = products
      .filter((x) => hit(x.name) || hit(x.shortDescription))
      .map((x) => ({ id: x.id, kind: 'Service', label: x.name, meta: x.shortDescription, to: '/products', img: x.image }));

    return [...p, ...s].slice(0, 6);
  }, [q]);

  const go = (to) => {
    onClose();
    navigate(to);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] bg-ink-950/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <motion.div
            className="container-x pt-28 sm:pt-36"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto max-w-2xl">
              <label htmlFor="site-search" className="eyebrow">
                <span className="h-px w-8 bg-brand-500" />
                Search {site.shortName}
              </label>

              <div className="mt-5 flex items-center gap-4 border-b border-white/20 pb-4 focus-within:border-brand-400">
                <Search className="h-5 w-5 shrink-0 text-brand-400" />
                <input
                  id="site-search"
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Try 'Ring Road', 'farmhouse', 'industrial shed'…"
                  className="w-full bg-transparent font-display text-xl text-white outline-none placeholder:text-ink-500 sm:text-2xl"
                />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-brand-400 hover:text-brand-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 space-y-1.5">
                {results.map((r, i) => (
                  <motion.button
                    key={`${r.kind}-${r.id}`}
                    type="button"
                    onClick={() => go(r.to)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-start transition-colors hover:border-brand-500/40 hover:bg-brand-500/10"
                  >
                    <img src={r.img} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-brand-400">
                        {r.kind}
                      </span>
                      <span className="mt-0.5 block truncate font-display text-base text-white">{r.label}</span>
                      <span className="block truncate text-xs text-ink-400">{r.meta}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-brand-300" />
                  </motion.button>
                ))}

                {q.trim().length >= 2 && results.length === 0 && (
                  <p className="py-6 text-center text-sm text-ink-400">
                    Nothing matched &ldquo;{q}&rdquo;. Try a location or a segment name.
                  </p>
                )}

                {q.trim().length < 2 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setQ(c.name)}
                        className="rounded-lg border border-white/12 px-3.5 py-2 text-xs font-semibold text-white/70 transition-colors hover:border-brand-400 hover:text-brand-300"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Projects mega-menu                                                  */
/* ------------------------------------------------------------------ */

function ProjectsMenu({ item, solid }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  // Small close delay so the pointer can cross the gap to the panel.
  const schedule = (next) => {
    clearTimeout(closeTimer.current);
    if (next) setOpen(true);
    else closeTimer.current = setTimeout(() => setOpen(false), 130);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="relative" onMouseEnter={() => schedule(true)} onMouseLeave={() => schedule(false)}>
      <NavLink
        to={item.to}
        onClick={() => setOpen(false)}
        className={({ isActive }) =>
          `inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors ${
            isActive
              ? 'text-brand-500'
              : solid
                ? 'text-ink-700 hover:text-brand-600'
                : 'text-white/80 hover:text-white'
          }`
        }
      >
        {item.label}
        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </NavLink>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="absolute start-1/2 top-full z-50 mt-3 grid w-[30rem] -translate-x-1/2 grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-ink-900/95 p-4 shadow-glow backdrop-blur-xl"
          >
            {item.groups.map((group) => (
              <div key={group.title}>
                <p className="px-2.5 pb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-brand-400">
                  {group.title}
                </p>
                {group.items.map((sub) => (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-between rounded-lg px-2.5 py-2 text-[13px] text-ink-200 transition-colors hover:bg-brand-500/12 hover:text-brand-200"
                  >
                    {sub.label}
                    <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

function IconButton({ href, to, label, children, solid, onClick }) {
  const cls = `grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 ${
    solid
      ? 'border-ink-200 text-ink-600 hover:border-brand-500 hover:bg-brand-500 hover:text-white'
      : 'border-white/25 text-white/85 hover:border-brand-400 hover:bg-brand-500 hover:text-ink-950'
  }`;

  const inner = <Magnetic strength={0.25}>{children}</Magnetic>;

  if (to) return <Link to={to} aria-label={label} className={cls}>{inner}</Link>;
  if (href) return <a href={href} aria-label={label} className={cls}>{inner}</a>;
  return (
    <button type="button" onClick={onClick} aria-label={label} className={cls}>
      {inner}
    </button>
  );
}

export function Header() {
  const { pathname } = useLocation();
  const reduce = useMotionPreference();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const progress = useScrollProgress();
  useLockBodyScroll(mobileOpen);

  // Transparent over the landing hero, ivory everywhere else — the bar only
  // "arrives" once there is content behind it that needs separating.
  const overlayRoute = pathname === '/';
  const solid = scrolled || !overlayRoute || mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100]">
        <motion.div
          className={`transition-all duration-500 ${
            solid ? 'bg-ink-50/95 shadow-soft backdrop-blur-xl' : 'bg-gradient-to-b from-ink-950/80 to-transparent'
          }`}
          animate={reduce ? undefined : { paddingTop: scrolled ? 0 : 4, paddingBottom: scrolled ? 0 : 4 }}
        >
          <div className="container-x flex h-[70px] items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-3" aria-label={`${site.name} home`}>
              {/* The brand mark ships on a white square canvas, so it sits inside its
                  own chip rather than directly on the header — that keeps it legible
                  whether the bar is transparent-over-hero or the solid ivory state. */}
              <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-black/5">
                <img src={site.logoMark} alt="" className="h-full w-full object-cover" />
              </span>
              <span className="leading-tight">
                <span
                  className={`block font-display text-[17px] tracking-tight transition-colors ${
                    solid ? 'text-ink-900' : 'text-white'
                  }`}
                >
                  {site.shortName}
                </span>
                <span className="block text-[9px] font-bold uppercase tracking-[0.28em] text-brand-500">
                  Construction
                </span>
              </span>
            </Link>

            {/* Centred nav */}
            <nav className="hidden items-center lg:flex">
              {NAV.map((item) =>
                item.groups ? (
                  <ProjectsMenu key={item.to} item={item} solid={solid} />
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `relative px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                        isActive
                          ? 'text-brand-500'
                          : solid
                            ? 'text-ink-700 hover:text-brand-600'
                            : 'text-white/80 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {isActive && (
                          <motion.span
                            layoutId="nav-underline"
                            className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-brand-500"
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ),
              )}
            </nav>

            {/* Icon rail */}
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 sm:flex">
                <IconButton href={telLink} label={`Call ${site.phone}`} solid={solid}>
                  <Phone className="h-[15px] w-[15px]" />
                </IconButton>
                <IconButton href={mailLink} label={`Email ${site.email}`} solid={solid}>
                  <Mail className="h-[15px] w-[15px]" />
                </IconButton>
                <IconButton to="/book-meeting" label="Book a meeting" solid={solid}>
                  <CalendarCheck className="h-[15px] w-[15px]" />
                </IconButton>
              </div>

              <IconButton onClick={() => setSearchOpen(true)} label="Search" solid={solid}>
                <Search className="h-[15px] w-[15px]" />
              </IconButton>

              <button
                type="button"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                className={`grid h-10 w-10 place-items-center rounded-full border transition-colors lg:hidden ${
                  solid ? 'border-ink-200 text-ink-700' : 'border-white/25 text-white'
                }`}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Reading progress — reads as a construction fill line. */}
          <div className="h-[2px] w-full bg-transparent">
            <div
              className="h-full origin-left bg-gradient-to-r from-brand-500 to-brand-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden bg-ink-50 lg:hidden"
            >
              <div className="container-x max-h-[calc(100vh-120px)] space-y-1 overflow-y-auto py-5">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.35 }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-3 font-display text-lg transition-colors ${
                          isActive ? 'text-brand-600' : 'text-ink-800 hover:text-brand-600'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>

                    {item.groups && (
                      <div className="mb-2 ms-3 grid grid-cols-2 gap-x-2 border-s border-ink-200 ps-4">
                        {item.groups.flatMap((g) => g.items).map((sub) => (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            className="rounded-md px-1 py-1.5 text-[13px] text-ink-500 transition-colors hover:text-brand-600"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}

                <div className="grid grid-cols-2 gap-2.5 pt-4">
                  <a href={telLink} className="btn-dark !py-3">
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                  <Link to="/book-meeting" className="btn-primary !py-3">
                    <CalendarCheck className="h-4 w-4" />
                    Book
                  </Link>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
