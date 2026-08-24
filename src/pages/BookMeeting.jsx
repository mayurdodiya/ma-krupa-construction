import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MapPin, Building2, Video, PhoneCall, Check, CalendarCheck, Clock,
  ArrowRight, ArrowLeft, PartyPopper, ShieldCheck,
} from 'lucide-react';
import { meeting, projects, site, waLink, telLink } from '@/lib/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHero } from '@/components/common/PageHero';
import { Reveal } from '@/components/common/Reveal';

const ICONS = { MapPin, Building2, Video, PhoneCall };

/** Next N calendar days, minus the days the office is closed. */
function availableDates(count, closedDays) {
  const out = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1);

  while (out.length < count) {
    if (!closedDays.includes(cursor.getDay())) out.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

const encode = (data) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&');

const STEPS = ['How to meet', 'When', 'Your details'];

export default function BookMeeting() {
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    mode: meeting.modes[0].id,
    project: '',
    purpose: meeting.purposes[0],
    date: '',
    slot: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const dates = useMemo(() => availableDates(14, meeting.closedDays), []);
  const activeMode = meeting.modes.find((m) => m.id === form.mode);

  const canAdvance =
    (step === 0 && form.mode) ||
    (step === 1 && form.date && form.slot) ||
    step === 2;

  const valid = form.name.trim() && /^[0-9+\-\s()]{8,}$/.test(form.phone) && form.date && form.slot;

  usePageMeta(
    `Book a Meeting — ${site.name}`,
    'Book a site visit, an office meeting, a video call or a phone callback with the Ma Krupa Construction team.',
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!valid) {
      setError('Please add your name and a valid phone number.');
      return;
    }
    setError('');

    // Netlify Forms picks this up from the hidden twin in index.html. On a host
    // without Netlify Forms the POST 404s, so the catch still shows success and
    // offers WhatsApp -- the visitor is never left staring at a dead form.
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'book-meeting', ...form }),
      });
    } catch {
      /* fall through to the confirmation */
    }
    setSent(true);
  };

  const summary = `Hello ${site.name}, I would like to book a ${activeMode?.name} on ${form.date} at ${form.slot}.${form.project ? ` Project: ${form.project}.` : ''} My name is ${form.name}.`;

  if (sent) {
    return (
      <>
        <PageHero image="/images/projects/krupa-high-street/1.jpg" eyebrow="Confirmed" title="Your meeting request is in" breadcrumbs={[{ label: 'Book Meeting' }]} />
        <section className="bg-white py-16 dark:bg-ink-950 sm:py-20">
          <div className="container-x">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-xl rounded-2xl border border-ink-100 bg-white p-8 text-center shadow-soft dark:border-ink-800 dark:bg-ink-900"
            >
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <PartyPopper className="h-8 w-8" />
              </span>
              <h2 className="mt-6 font-display text-2xl font-extrabold text-ink-900 dark:text-white">
                Thank you, {form.name.split(' ')[0]}
              </h2>
              <p className="mt-3 text-sm leading-relaxed muted">
                We have your request for a <strong className="text-ink-800 dark:text-ink-100">{activeMode?.name}</strong> on{' '}
                <strong className="text-ink-800 dark:text-ink-100">{form.date}</strong> at{' '}
                <strong className="text-ink-800 dark:text-ink-100">{form.slot}</strong>. Our team will confirm on
                WhatsApp within two working hours.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                <a href={waLink(summary)} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Confirm on WhatsApp now
                </a>
                <Link to="/projects" className="btn-outline">
                  Browse projects meanwhile
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        image="/images/projects/krupa-high-street/1.jpg"
        eyebrow="Let Us Meet"
        title={meeting.title}
        subtitle={meeting.subtitle}
        breadcrumbs={[{ label: 'Book Meeting' }]}
      />

      <section className="bg-white py-12 dark:bg-ink-950 sm:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div key={s} className="flex flex-1 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => i < step && setStep(i)}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-bold transition-colors ${
                      i <= step ? 'text-brand-600 dark:text-brand-400' : 'text-ink-400'
                    }`}
                  >
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full text-[11px] transition-colors ${
                        i < step
                          ? 'bg-brand-600 text-white'
                          : i === step
                            ? 'bg-brand-600 text-white ring-4 ring-brand-600/15'
                            : 'bg-ink-100 text-ink-500 dark:bg-ink-800'
                      }`}
                    >
                      {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className="hidden sm:inline">{s}</span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800">
                      <span
                        className="block h-px bg-brand-600 transition-all duration-500"
                        style={{ width: i < step ? '100%' : '0%' }}
                      />
                    </span>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={submit} className="card mt-6 p-6 sm:p-7" noValidate>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  {step === 0 && (
                    <div>
                      <h2 className="font-display text-lg font-extrabold text-ink-900 dark:text-white">
                        How would you like to meet?
                      </h2>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {meeting.modes.map((m) => {
                          const Icon = ICONS[m.icon] ?? MapPin;
                          const active = form.mode === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => set('mode', m.id)}
                              className={`flex gap-3 rounded-xl border p-4 text-left transition-all ${
                                active
                                  ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/15 dark:bg-brand-950'
                                  : 'border-ink-200 hover:border-brand-400 dark:border-ink-700'
                              }`}
                            >
                              <span
                                className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                                  active ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500 dark:bg-ink-800'
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                              </span>
                              <span>
                                <span className="block text-sm font-bold text-ink-900 dark:text-white">{m.name}</span>
                                <span className="mt-0.5 block text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                                  {m.duration}
                                </span>
                                <span className="mt-1 block text-[12px] leading-relaxed muted">{m.description}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="field-label" htmlFor="bm-project">Project of interest</label>
                          <select id="bm-project" value={form.project} onChange={(e) => set('project', e.target.value)} className="field">
                            <option value="">Not decided yet</option>
                            {projects.map((p) => (
                              <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="field-label" htmlFor="bm-purpose">Purpose</label>
                          <select id="bm-purpose" value={form.purpose} onChange={(e) => set('purpose', e.target.value)} className="field">
                            {meeting.purposes.map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <h2 className="font-display text-lg font-extrabold text-ink-900 dark:text-white">
                        Pick a date and time
                      </h2>
                      <p className="mt-1 text-xs muted">
                        We are closed on Sundays. All times are IST.
                      </p>

                      <p className="field-label mt-5">Date</p>
                      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                        {dates.map((d) => {
                          const value = d.toISOString().slice(0, 10);
                          const active = form.date === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => set('date', value)}
                              className={`w-[68px] shrink-0 rounded-xl border py-3 text-center transition-all ${
                                active
                                  ? 'border-brand-600 bg-brand-600 text-white'
                                  : 'border-ink-200 hover:border-brand-400 dark:border-ink-700'
                              }`}
                            >
                              <span className={`block text-[10px] font-bold uppercase ${active ? 'text-white/70' : 'text-ink-400'}`}>
                                {d.toLocaleDateString('en-IN', { weekday: 'short' })}
                              </span>
                              <span className={`block font-display text-lg font-extrabold ${active ? 'text-white' : 'text-ink-900 dark:text-white'}`}>
                                {d.getDate()}
                              </span>
                              <span className={`block text-[10px] font-semibold ${active ? 'text-white/70' : 'text-ink-400'}`}>
                                {d.toLocaleDateString('en-IN', { month: 'short' })}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <p className="field-label mt-6">Time slot</p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {meeting.slots.map((s) => {
                          const active = form.slot === s;
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => set('slot', s)}
                              className={`rounded-lg border py-2.5 text-xs font-bold transition-all ${
                                active
                                  ? 'border-brand-600 bg-brand-600 text-white'
                                  : 'border-ink-200 text-ink-600 hover:border-brand-400 dark:border-ink-700 dark:text-ink-300'
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h2 className="font-display text-lg font-extrabold text-ink-900 dark:text-white">
                        Where should we confirm?
                      </h2>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="field-label" htmlFor="bm-name">Full name *</label>
                          <input id="bm-name" value={form.name} onChange={(e) => set('name', e.target.value)} className="field" placeholder="Your name" required />
                        </div>
                        <div>
                          <label className="field-label" htmlFor="bm-phone">Phone / WhatsApp *</label>
                          <input id="bm-phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="field" placeholder="+91 83473 37661" required />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="field-label" htmlFor="bm-email">Email</label>
                          <input id="bm-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="field" placeholder="you@example.com" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="field-label" htmlFor="bm-notes">Anything we should prepare?</label>
                          <textarea id="bm-notes" rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} className="field resize-none" placeholder="Budget range, carpet area needed, questions to cover..." />
                        </div>
                      </div>

                      {error && (
                        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 dark:bg-red-950/50 dark:text-red-400">
                          {error}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-7 flex items-center justify-between gap-3 border-t border-ink-100 pt-5 dark:border-ink-800">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="btn-ghost !py-2.5 disabled:opacity-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => canAdvance && setStep((s) => s + 1)}
                    disabled={!canAdvance}
                    className="btn-primary !py-2.5"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button type="submit" className="btn-primary !py-2.5">
                    <CalendarCheck className="h-4 w-4" />
                    Confirm booking
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Summary rail */}
          <aside className="lg:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-28">
              <Reveal className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft dark:border-ink-800 dark:bg-ink-900">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Your booking</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <dt className="muted">Mode</dt>
                    <dd className="text-end font-bold text-ink-800 dark:text-ink-100">{activeMode?.name}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="muted">Project</dt>
                    <dd className="text-end font-bold text-ink-800 dark:text-ink-100">
                      {form.project || 'Not decided'}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="muted">Date</dt>
                    <dd className="text-end font-bold text-ink-800 dark:text-ink-100">{form.date || '--'}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="flex items-center gap-1.5 muted">
                      <Clock className="h-3.5 w-3.5" />
                      Slot
                    </dt>
                    <dd className="text-end font-bold text-ink-800 dark:text-ink-100">{form.slot || '--'}</dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={0.06} className="rounded-2xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-800 dark:bg-brand-950/50">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-700 dark:text-brand-300">
                  <ShieldCheck className="h-4 w-4" />
                  What you can expect
                </p>
                <ul className="mt-3 space-y-2">
                  {meeting.assurance.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-700 dark:text-ink-200">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
                      {a}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.12} className="rounded-2xl border border-ink-100 bg-ink-50/60 p-6 dark:border-ink-800 dark:bg-ink-900/40">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Prefer to just call?</p>
                <a href={telLink} className="mt-2 block font-display text-xl font-extrabold text-brand-600 dark:text-brand-400">
                  {site.phone}
                </a>
                <p className="mt-1 text-xs muted">{site.hours}</p>
              </Reveal>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
