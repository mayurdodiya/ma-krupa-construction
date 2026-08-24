import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Phone, Mail, MapPin, Clock, Send, MessageCircle, CheckCircle2,
  ChevronDown, CalendarCheck,
} from 'lucide-react';
import { site, faqs, telLink, mailLink, waLink, generalEnquiry } from '@/lib/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHero } from '@/components/common/PageHero';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Reveal, RevealGroup, RevealItem } from '@/components/common/Reveal';

const encode = (data) =>
  Object.keys(data).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&');

const CARDS = [
  { icon: Phone, label: 'Call us', value: site.phone, sub: site.phoneAlt, href: `tel:${site.phoneRaw}` },
  { icon: Mail, label: 'Email us', value: site.email, sub: site.emailCareers, href: `mailto:${site.email}` },
  { icon: MapPin, label: 'Visit us', value: site.address.line1, sub: `${site.address.line2}, ${site.address.city} ${site.address.pincode}` },
  { icon: Clock, label: 'Office hours', value: site.hours, sub: 'Closed on Sundays' },
];

function FaqItem({ faq, open, onToggle }) {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-bold text-ink-900 dark:text-white">{faq.question}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-brand-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm leading-relaxed muted">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(faqs[0]?.id ?? null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  usePageMeta(
    `Contact — ${site.name}`,
    `Call ${site.phone}, email ${site.email}, or visit our office at ${site.address.full}.`,
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !/^[0-9+\-\s()]{8,}$/.test(form.phone)) {
      setError('Please add your name and a valid phone number.');
      return;
    }
    setError('');
    // Netlify Forms picks this up from the hidden twin in index.html; on a host
    // without it the POST 404s, so we still confirm and offer WhatsApp.
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...form }),
      });
    } catch {
      /* fall through */
    }
    setSent(true);
  };

  return (
    <>
      <PageHero
        image="/images/projects/krupa-corporate-hub/3.jpg"
        eyebrow="Get In Touch"
        title="Talk to a person, not a form"
        subtitle="Call during office hours and you reach our sales desk directly. Prefer writing? Use the form and we reply within one working day."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <section className="bg-white py-12 dark:bg-ink-950 sm:py-16">
        <div className="container-x">
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
            {CARDS.map((c) => {
              const Body = (
                <div className="group h-full rounded-2xl border border-ink-100 bg-white p-6 transition-all duration-400 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-soft dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-700">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950 dark:text-brand-400">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-ink-400">{c.label}</p>
                  <p className="mt-1 break-words text-sm font-bold text-ink-900 dark:text-white">{c.value}</p>
                  <p className="mt-0.5 break-words text-xs muted">{c.sub}</p>
                </div>
              );
              return (
                <RevealItem key={c.label} className="h-full">
                  {c.href ? <a href={c.href} className="block h-full">{Body}</a> : Body}
                </RevealItem>
              );
            })}
          </RevealGroup>

          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            {/* Form */}
            <div className="lg:col-span-7">
              <div className="card p-6 sm:p-7">
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-10 text-center"
                    >
                      <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
                      <h2 className="mt-5 font-display text-xl font-extrabold text-ink-900 dark:text-white">
                        Message received
                      </h2>
                      <p className="mx-auto mt-2 max-w-sm text-sm muted">
                        Thank you, {form.name.split(' ')[0]}. Our team will get back to you within one
                        working day. For anything urgent, WhatsApp is faster.
                      </p>
                      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                        <a href={waLink(generalEnquiry)} target="_blank" rel="noopener noreferrer" className="btn-primary">
                          <MessageCircle className="h-4 w-4" />
                          WhatsApp us
                        </a>
                        <Link to="/projects" className="btn-outline">Browse projects</Link>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h2 className="font-display text-lg font-extrabold text-ink-900 dark:text-white">
                        Send us an enquiry
                      </h2>
                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="field-label" htmlFor="c-name">Full name *</label>
                          <input id="c-name" value={form.name} onChange={set('name')} className="field" placeholder="Your name" required />
                        </div>
                        <div>
                          <label className="field-label" htmlFor="c-phone">Phone *</label>
                          <input id="c-phone" type="tel" value={form.phone} onChange={set('phone')} className="field" placeholder="+91 98250 00000" required />
                        </div>
                        <div>
                          <label className="field-label" htmlFor="c-email">Email</label>
                          <input id="c-email" type="email" value={form.email} onChange={set('email')} className="field" placeholder="you@example.com" />
                        </div>
                        <div>
                          <label className="field-label" htmlFor="c-subject">Subject</label>
                          <input id="c-subject" value={form.subject} onChange={set('subject')} className="field" placeholder="Project enquiry" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="field-label" htmlFor="c-message">Message</label>
                          <textarea id="c-message" rows={5} value={form.message} onChange={set('message')} className="field resize-none" placeholder="Tell us what you are looking for, your budget range and preferred location..." />
                        </div>
                      </div>

                      {error && (
                        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 dark:bg-red-950/50 dark:text-red-400">
                          {error}
                        </p>
                      )}

                      <div className="mt-6 flex flex-wrap gap-2.5">
                        <button type="submit" className="btn-primary">
                          <Send className="h-4 w-4" />
                          Send enquiry
                        </button>
                        <Link to="/book-meeting" className="btn-outline">
                          <CalendarCheck className="h-4 w-4" />
                          Or book a meeting
                        </Link>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-5">
              <Reveal className="h-full overflow-hidden rounded-2xl border border-ink-100 dark:border-ink-800">
                <iframe
                  title={`Map to ${site.name}`}
                  src={site.mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[420px] w-full"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-ink-50 py-14 dark:bg-ink-900/40 sm:py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Common Questions"
            title="Answers before you have to ask"
            subtitle="The questions buyers ask us most often, answered plainly."
          />
          <div className="mx-auto mt-10 max-w-3xl space-y-2.5">
            {faqs.map((f) => (
              <FaqItem
                key={f.id}
                faq={f}
                open={openFaq === f.id}
                onToggle={() => setOpenFaq(openFaq === f.id ? null : f.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
