import { chatbot } from '@/lib/site';

/**
 * Deterministic intent matcher for the on-site assistant.
 *
 * Everything the bot knows lives in src/data/chatbot.json, so the client can
 * extend the assistant by editing JSON, with no code change. Matching is
 * keyword-scored rather than first-match: a longer keyword that appears in the
 * question is stronger evidence than a short one ("site visit" should beat
 * "visit"), and an exact phrase hit outranks a loose word hit.
 */

const WORD_BOUNDARY = /[^a-z0-9]+/;

function normalise(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreIntent(intent, query, queryWords) {
  let score = 0;

  for (const keyword of intent.keywords ?? []) {
    const k = normalise(keyword);
    if (!k) continue;

    if (k.includes(' ')) {
      // Multi-word keyword: only a contiguous phrase hit counts, and it counts heavily.
      if (query.includes(k)) score += 6 + k.split(' ').length;
      continue;
    }

    // Single word: require a whole-word match so "art" does not match "apartment".
    if (queryWords.includes(k)) score += 3 + Math.min(k.length / 4, 2);
  }

  return score;
}

/**
 * Returns the best-matching intent, or the JSON-defined fallback when nothing
 * scores. `matched` lets the UI tell a real answer apart from a fallback.
 */
export function matchIntent(input) {
  const query = normalise(input);
  if (!query) return { ...chatbot.fallback, id: 'fallback', matched: false };

  const queryWords = query.split(WORD_BOUNDARY).filter(Boolean);

  let best = null;
  let bestScore = 0;

  for (const intent of chatbot.intents) {
    const score = scoreIntent(intent, query, queryWords);
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  if (!best) return { ...chatbot.fallback, id: 'fallback', matched: false };
  return { ...best, matched: true, score: bestScore };
}

/** Stable ids for message keys without pulling in a uuid dependency. */
let messageSeq = 0;
export function nextMessageId() {
  messageSeq += 1;
  return `m${messageSeq}`;
}

export function makeMessage(from, text, extra = {}) {
  return { id: nextMessageId(), from, text, at: Date.now(), ...extra };
}
