import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Send, X, Sparkles, ArrowRight, RotateCcw, Phone } from 'lucide-react';
import { chatbot, site, telLink } from '@/lib/site';
import { matchIntent, makeMessage } from '@/lib/chat';

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-1 py-1.5" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-ink-400"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

function Bubble({ message, onChip, onAction }) {
  const isBot = message.from === 'bot';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`max-w-[85%] ${isBot ? '' : 'text-right'}`}>
        <div
          className={
            isBot
              ? 'rounded-2xl rounded-tl-sm bg-ink-50 px-3.5 py-2.5 text-sm leading-relaxed text-ink-800 dark:bg-ink-800 dark:text-ink-100'
              : 'rounded-2xl rounded-tr-sm bg-brand-600 px-3.5 py-2.5 text-sm leading-relaxed text-white'
          }
        >
          {message.text}
        </div>

        {message.action && (
          <button
            type="button"
            onClick={() => onAction(message.action)}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-brand-600/10 px-3 py-1.5 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-600 hover:text-white dark:text-brand-300 dark:hover:text-white"
          >
            {message.action.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}

        {message.chips?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => onChip(chip)}
                className="rounded-md border border-ink-200 px-2.5 py-1 text-[11px] font-semibold text-ink-600 transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 dark:border-ink-700 dark:text-ink-300 dark:hover:bg-brand-950 dark:hover:text-brand-300"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * On-site assistant. Every answer comes from src/data/chatbot.json via the
 * keyword-scored matcher in lib/chat.js, so the client can extend what the bot
 * knows by editing JSON. The typing pause is deliberate: an instant reply reads
 * as a canned lookup, a short delay reads as a considered answer.
 */
export function ChatWidget({ open, onClose }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const opener = () => [makeMessage('bot', chatbot.greeting, { chips: chatbot.openerChips })];

  const [messages, setMessages] = useState(opener);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);

  // Autoscroll to the newest message, including while the typing dots show.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (!open) return undefined;
    const id = setTimeout(() => inputRef.current?.focus(), 260);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // A pending reply timer must not fire into an unmounted tree.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const send = (raw) => {
    const text = String(raw ?? '').trim();
    if (!text) return;

    setMessages((prev) => [...prev, makeMessage('user', text)]);
    setDraft('');
    setTyping(true);

    const intent = matchIntent(text);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        makeMessage('bot', intent.response, { chips: intent.chips, action: intent.action }),
      ]);
    }, chatbot.typingDelayMs);
  };

  const handleAction = (action) => {
    onClose();
    navigate(action.to);
  };

  const reset = () => {
    clearTimeout(timerRef.current);
    setTyping(false);
    setMessages(opener());
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.94 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-24 end-4 z-50 flex h-[min(560px,72vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-glow dark:border-ink-700 dark:bg-ink-900 sm:end-6"
          role="dialog"
          aria-label="Krupa Assistant chat"
        >
          <div className="flex items-center gap-3 border-b border-ink-100 bg-gradient-to-r from-ink-900 to-ink-800 px-4 py-3 dark:border-ink-700">
            <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
              <Sparkles className="h-4 w-4" />
              <span className="absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink-900 bg-emerald-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{chatbot.botName}</p>
              <p className="truncate text-[11px] text-white/60">{chatbot.botRole} &middot; Online</p>
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label="Restart conversation"
              className="grid h-8 w-8 place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="grid h-8 w-8 place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-3.5 py-4">
            {messages.map((m) => (
              <Bubble key={m.id} message={m} onChip={send} onAction={handleAction} />
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm bg-ink-50 px-2 dark:bg-ink-800">
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="border-t border-ink-100 p-2.5 dark:border-ink-700"
          >
            <div className="flex items-center gap-2">
              <a
                href={telLink}
                aria-label={`Call ${site.shortName}`}
                title="Call us instead"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-ink-200 text-ink-500 transition-colors hover:border-brand-500 hover:text-brand-600 dark:border-ink-700 dark:text-ink-400"
              >
                <Phone className="h-4 w-4" />
              </a>
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={chatbot.placeholder}
                aria-label="Type your question"
                className="h-10 min-w-0 flex-1 rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-100"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Send message"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-600 text-white transition-all hover:bg-brand-700 disabled:pointer-events-none disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
