import { statuses } from '@/lib/site';

// Rectangular (rounded-md) badges, per the client design reference -- never pills.
// Tuned for the dark-luxury shell: translucent fill + hairline ring so they sit
// on photography without punching a bright hole in the composition.
const TONE = {
  ongoing: 'bg-brand-500/15 text-brand-200 ring-brand-400/35',
  upcoming: 'bg-sky-400/15 text-sky-200 ring-sky-300/35',
  completed: 'bg-emerald-400/15 text-emerald-200 ring-emerald-300/35',
};

const DOT = {
  ongoing: 'bg-brand-400',
  upcoming: 'bg-sky-300',
  completed: 'bg-emerald-300',
};

export function StatusBadge({ status, className = '', showDot = true }) {
  const meta = statuses.find((s) => s.id === status);
  if (!meta) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ring-1 ring-inset backdrop-blur-sm ${
        TONE[status] ?? TONE.ongoing
      } ${className}`}
    >
      {showDot && (
        <span className="relative flex h-1.5 w-1.5">
          {status === 'ongoing' && (
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${DOT[status]}`} />
          )}
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${DOT[status] ?? DOT.ongoing}`} />
        </span>
      )}
      {meta.shortName}
    </span>
  );
}
