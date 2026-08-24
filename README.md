<<<<<<< HEAD
# ma-krupa-construction
=======
# Ma Krupa Construction

Marketing website for Ma Krupa Construction, Surat. React + Vite SPA, all content
driven from JSON files, same architecture as the jal-Impex project.

## Stack

React 18 · Vite 6 · Tailwind CSS 3 · Framer Motion · React Router 6 · lucide-react

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the production build
```

## All content lives in `src/data/`

Nothing is hardcoded in components. Edit these files and the site updates.

| File | Holds |
|---|---|
| `site.json` | Company name, phone, email, address, RERA/CIN/GST, stats, USPs |
| `categories.json` | The four segments: Commercial, Industrial, Residential, Farmhouse |
| `statuses.json` | Running / Upcoming / Past project stages |
| `projects.json` | All 12 projects: specs, amenities, gallery, RERA no., price, progress |
| `products.json` | Services and products offered |
| `about.json` | Story, mission, vision, values, timeline, process, leadership |
| `rera.json` | RERA commitments, per-project certificates, buyer rights |
| `calculators.json` | EMI and ROI defaults, slider limits, lender rates |
| `meeting.json` | Meeting modes, purposes, time slots, closed days |
| `chatbot.json` | Assistant intents, keywords, answers, quick-reply chips |
| `testimonials.json`, `faqs.json` | Client quotes and FAQs |

### Adding a project

Append an object to `projects.json` (copy an existing one for the shape), then drop
a `cover.jpg` plus numbered gallery plates (`1.jpg`, `2.jpg`, …) into
`public/images/projects/<id>/`. Paths are the only wiring; there is no code change.

## Design system

Single **dark-luxury** identity — there is no light/dark toggle. The ivory
sections are per-section `.panel-light` panels, not a second colour mode, and the
`dark` class is locked on in `index.html` before first paint.

| Token | Role |
|---|---|
| `ink-950` / `ink-900` | Warm near-black espresso the site sits on |
| `ink-50` / `ink-100` | Ivory used by the `.panel-light` curtain sections |
| `brand-*` | Antique gold: every accent, rule, CTA and hover state |
| `font-display` | Playfair Display — all headings |
| `font-sans` | Plus Jakarta Sans — all body copy |

Shared classes live in `src/index.css` (`.btn-*`, `.card-lux`, `.h-section`,
`.eyebrow`, `.panel-light`, `.curtain-top`). Restyle there, not per component.

### Motion

Everything routes through `src/components/common/Reveal.jsx`: `Reveal`,
`RevealGroup`/`RevealItem`, `MaskReveal` (clip-path wipe), `WordReveal`
(per-word lift), `Parallax`/`ParallaxImage`, `Magnetic`, `Tilt3D`, `DriftX`.
Scroll-linked values are passed through a **spring**, which is what removes the
"stuck to the scrollbar" feel. Every primitive renders its final state
immediately under `prefers-reduced-motion`.

### 3D sections

- `Tower3D` — an isometric CSS-3D building that assembles floor by floor on
  scroll. Plates above the build line stay gold wireframe (designed, not poured).
- `CategoryShowcase` — the four segments as real 3D objects; the frame and label
  sit at different `translateZ` depths so they separate as the card turns.

> Gotcha: a 3D-transformed descendant is **not** clipped by an ancestor's
> `overflow-hidden` inside a `preserve-3d` context. Keep photos at `Z=0` and give
> depth only to inset layers, or images will escape their rounded card.

### Custom cursor

`src/components/common/Cursor.jsx` draws a **surveyor's reticle** — a gold ring
with N/E/S/W tick marks, trailing the pointer on a spring. It opens over links
and becomes a labelled disc over media (`data-cursor="view"`). It self-disables
on touch/coarse pointers and for reduced motion, and only then does
`html.has-cursor` hide the native cursor.

## Imagery

76 real photographs under `public/images/` (hero stills, segments, 12 project
covers + galleries, services, portraits). `src/data/*.json` points at the `.jpg`
paths. Swap any file for the client's own using the same filename — no code
change. `scripts/generate-placeholders.mjs` is superseded and kept only as a
fallback; see its header.

### Hero background video

`public/videos/showreel.mp4` is the client's own render walkthrough, playing on
loop behind the hero — drop-in by design: replace that file (same name) with no
code change. Absent, the hero runs a Ken Burns cross-dissolve over the real
stills, so it reads as a moving background either way. Full notes in
`public/videos/README.md`.

### Brand assets

`public/images/logo/` holds the client's real logo: `ma-krupa-mark.png` (the
three-glyph icon, used in the header/favicon) and `ma-krupa-logo.png` (the full
"Maa Krupa Developers" lockup, used in the footer). Both ship on a white canvas,
so they're always placed inside a white chip/card rather than directly on a dark
surface — see `Header.jsx` and `Footer.jsx`.

### Brand Film

Three more client-supplied clips (a rooftop-terrace render, a night skyline
shot, and the logo bumper) run as an autoplay-on-scroll video gallery on the
About page — `src/components/about/BrandFilm.jsx`, driven by the `reels` array
in `site.json`. Add a fourth clip there and it appears with no other change.

## Features

- **Home page** leading with the four segments (Commercial / Industrial / Residential / Farmhouse)
- **Projects** filterable by segment and stage, filters held in the URL so links are shareable
- **Project detail** with gallery lightbox, specifications, amenities, connectivity, RERA panel
- **EMI calculator** with amortisation schedule and approved-lender rates
- **ROI calculator** with rental yield, appreciation, year-by-year wealth projection
- **Book Meeting** three-step booking (site visit / office / video / callback)
- **RERA page** with every registration number and buyer-rights guidance
- **AI chat assistant** driven entirely by `chatbot.json`, with deep links into the site
- **Cinematic hero** with drop-in background video and a Ken Burns fallback
- **Custom construction cursor** (surveyor's reticle), self-disabling on touch
- **3D build-process model** that assembles floor by floor on scroll
- **Site search** overlay across projects and services
- Full keyboard access and `prefers-reduced-motion` respected throughout

## Chat assistant

`src/lib/chat.js` scores the visitor question against the keywords in
`chatbot.json` and returns the best-matching intent. Multi-word keywords outrank
single words, so "site visit" beats "visit". To teach it something new, add an
intent object. No code change, no API key, no per-message cost. The UI is
provider-agnostic, so it can be pointed at a real LLM later without a rewrite.

## Forms

The contact and booking forms post to Netlify Forms (hidden twins are declared in
`index.html`). On a non-Netlify host the POST is a no-op and the visitor still gets
the confirmation screen plus a WhatsApp fallback.

## Deploy

`netlify.toml` is configured: build `npm run build`, publish `dist`, with an SPA
redirect so deep links like `/projects/krupa-residency` resolve.
>>>>>>> master
