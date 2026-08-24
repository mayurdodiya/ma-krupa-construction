import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Building2 } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { site } from '@/lib/site';

export default function NotFound() {
  usePageMeta(`Page not found — ${site.name}`, 'The page you were looking for does not exist.');

  return (
    <section className="relative grid min-h-[70vh] place-items-center overflow-hidden bg-ink-950 pt-[68px] text-white">
      <div aria-hidden="true" className="absolute inset-0 bg-grid-lines bg-[size:56px_56px] opacity-[0.14]" />
      <div className="container-x relative text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-600 mx-auto">
          <Building2 className="h-8 w-8" />
        </span>
        <p className="mt-8 font-display text-7xl font-extrabold gold-text sm:text-8xl">404</p>
        <h1 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">
          This plot has not been developed yet
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/55">
          The page you were looking for does not exist, or it has moved. Our projects, however,
          are all exactly where we said they would be.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" />
            Back to home
          </Link>
          <Link to="/projects" className="btn border border-white/25 text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
            Browse projects
          </Link>
        </div>
      </div>
    </section>
  );
}
