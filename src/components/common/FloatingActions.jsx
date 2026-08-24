import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, MessageCircle, ArrowUp, Sparkles, X } from 'lucide-react';
import { waLink, telLink, generalEnquiry } from '@/lib/site';
import { ChatWidget } from '@/components/chat/ChatWidget';

/**
 * Fixed contact rail plus the assistant launcher. Uses logical `end-*` spacing
 * so the rail flips correctly if an RTL locale is ever added.
 */
export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [nudged, setNudged] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // One-time "ask me anything" nudge, so first-time visitors notice the assistant.
  useEffect(() => {
    const id = setTimeout(() => setNudged(true), 4200);
    const hide = setTimeout(() => setNudged(false), 12000);
    return () => {
      clearTimeout(id);
      clearTimeout(hide);
    };
  }, []);

  return (
    <>
      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />

      <div className="fixed bottom-5 end-4 z-40 flex flex-col items-center gap-3 sm:bottom-7 sm:end-6">
        <AnimatePresence>
          {showTop && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-ink-900/80 text-white/80 shadow-soft backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-300"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>

        <a
          href={telLink}
          aria-label="Call now"
          title="Call now"
          className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-ink-900/80 text-white shadow-soft backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-brand-400 hover:text-brand-300 sm:h-13 sm:w-13"
        >
          <Phone className="h-5 w-5" />
        </a>

        <a
          href={waLink(generalEnquiry)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
          className="relative grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.7)] transition-transform hover:-translate-y-1 sm:h-13 sm:w-13"
        >
          <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" />
          <MessageCircle className="relative h-6 w-6" />
        </a>

        {/* Assistant launcher */}
        <div className="relative">
          <AnimatePresence>
            {nudged && !chatOpen && (
              <motion.button
                type="button"
                onClick={() => { setChatOpen(true); setNudged(false); }}
                initial={{ opacity: 0, x: 12, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 12, scale: 0.9 }}
                className="absolute end-[3.75rem] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-xs font-semibold text-white shadow-soft sm:block"
              >
                Ask me anything
                <span className="absolute -end-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-e border-t border-white/10 bg-ink-900" />
              </motion.button>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => { setChatOpen((o) => !o); setNudged(false); }}
            aria-label={chatOpen ? 'Close assistant' : 'Open assistant'}
            aria-expanded={chatOpen}
            className="relative grid h-14 w-14 place-items-center rounded-full bg-brand-500 text-ink-950 shadow-lift transition-transform hover:-translate-y-1"
          >
            {!chatOpen && (
              <span aria-hidden="true" className="absolute inset-0 rounded-full bg-brand-500 animate-pulse-ring" />
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={chatOpen ? 'close' : 'open'}
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                {chatOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>
    </>
  );
}
