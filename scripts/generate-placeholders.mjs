/**
 * SUPERSEDED -- kept only as a fallback / for the logo marks.
 *
 * The site now ships real photography: every category, project cover, gallery
 * plate, service, portrait and hero still is a .jpg under public/images, and
 * src/data/*.json points at those .jpg paths. The generated .svg placeholders
 * have been deleted apart from the two logo files.
 *
 * Re-running this script will recreate the .svg files, but nothing references
 * them any more, so they would just be dead weight in the build. Only run it if
 * you are deliberately reverting to placeholder art -- in which case you must
 * also flip the image paths in src/data/*.json from .jpg back to .svg.
 *
 * Generates every SVG asset the site once referenced: logo, category art,
 * project covers and galleries, service icons, and avatars. Deterministic --
 * the same id always yields the same composition.
 *
 * Run: node scripts/generate-placeholders.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'public/images');

const GOLD = '#A06C1F';
const GOLD_LIGHT = '#DDB365';
const INK = '#12161C';

/** Tiny deterministic PRNG so a given seed always draws the same building. */
function rng(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function write(file, svg) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, svg.trim().replace(/\n\s+/g, '\n'));
}

const defs = (id, from, to, angle = 135) => `
<defs>
  <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(${angle - 135} .5 .5)">
    <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
  </linearGradient>
  <linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity=".16"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>
</defs>`;

/* ── Skyline compositions, one per segment ───────────────────────────────── */

function towers(rand, w, h, count, opts = {}) {
  const { minH = 0.32, maxH = 0.82, gap = 6 } = opts;
  const slotW = (w - gap * (count + 1)) / count;
  let out = '';
  for (let i = 0; i < count; i += 1) {
    const bh = h * (minH + rand() * (maxH - minH));
    const x = gap + i * (slotW + gap);
    const y = h - bh;
    out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${slotW.toFixed(1)}" height="${bh.toFixed(1)}" rx="2" fill="#ffffff" fill-opacity="${(0.1 + rand() * 0.14).toFixed(2)}"/>`;
    // Window grid.
    const cols = Math.max(2, Math.floor(slotW / 16));
    const rows = Math.max(3, Math.floor(bh / 20));
    for (let c = 0; c < cols; c += 1) {
      for (let r = 0; r < rows; r += 1) {
        if (rand() > 0.55) continue;
        const wx = x + 6 + c * ((slotW - 12) / cols);
        const wy = y + 10 + r * ((bh - 16) / rows);
        out += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="5" height="7" rx="1" fill="${GOLD_LIGHT}" fill-opacity="${(0.25 + rand() * 0.55).toFixed(2)}"/>`;
      }
    }
  }
  return out;
}

function shedRoof(rand, w, h) {
  let out = '';
  const bays = 4;
  const bw = w / bays;
  for (let i = 0; i < bays; i += 1) {
    const x = i * bw;
    const top = h * 0.42 + rand() * 8;
    out += `<path d="M${x} ${h} L${x} ${top + 26} L${x + bw / 2} ${top} L${x + bw} ${top + 26} L${x + bw} ${h} Z" fill="#ffffff" fill-opacity="${(0.09 + i * 0.03).toFixed(2)}"/>`;
    out += `<path d="M${x} ${top + 26} L${x + bw / 2} ${top} L${x + bw} ${top + 26}" fill="none" stroke="${GOLD_LIGHT}" stroke-opacity=".45" stroke-width="2"/>`;
    for (let d = 1; d < 4; d += 1) {
      out += `<rect x="${x + (bw / 4) * d - 3}" y="${h - 46}" width="6" height="26" rx="1" fill="${GOLD_LIGHT}" fill-opacity=".2"/>`;
    }
  }
  return out;
}

function houses(rand, w, h) {
  let out = '';
  for (let i = 0; i < 4; i += 1) {
    const bw = w / 4.6;
    const x = 10 + i * (bw + 8);
    const bh = h * (0.3 + rand() * 0.16);
    const y = h - bh;
    out += `<path d="M${x} ${h} L${x} ${y + 18} L${x + bw / 2} ${y} L${x + bw} ${y + 18} L${x + bw} ${h} Z" fill="#ffffff" fill-opacity="${(0.1 + rand() * 0.1).toFixed(2)}"/>`;
    out += `<rect x="${x + bw / 2 - 7}" y="${h - 26}" width="14" height="26" rx="1.5" fill="${GOLD_LIGHT}" fill-opacity=".45"/>`;
    out += `<rect x="${x + 8}" y="${y + 28}" width="10" height="10" rx="1.5" fill="${GOLD_LIGHT}" fill-opacity=".3"/>`;
    out += `<rect x="${x + bw - 18}" y="${y + 28}" width="10" height="10" rx="1.5" fill="${GOLD_LIGHT}" fill-opacity=".3"/>`;
  }
  return out;
}

function trees(rand, w, h) {
  let out = `<path d="M0 ${h} L${w} ${h} L${w} ${h - 18} Q${w / 2} ${h - 34} 0 ${h - 18} Z" fill="#ffffff" fill-opacity=".08"/>`;
  for (let i = 0; i < 7; i += 1) {
    const x = 18 + i * ((w - 36) / 6);
    const r = 16 + rand() * 12;
    const y = h - 34 - rand() * 26;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#ffffff" fill-opacity="${(0.08 + rand() * 0.1).toFixed(2)}"/>`;
    out += `<rect x="${(x - 2).toFixed(1)}" y="${y.toFixed(1)}" width="4" height="${(h - y - 14).toFixed(1)}" fill="${GOLD_LIGHT}" fill-opacity=".3"/>`;
  }
  out += `<path d="M${w * 0.12} ${h - 6} Q${w / 2} ${h - 26} ${w * 0.88} ${h - 6}" fill="none" stroke="${GOLD_LIGHT}" stroke-opacity=".4" stroke-width="2" stroke-dasharray="7 6"/>`;
  return out;
}

const SCENES = { commercial: towers, industrial: shedRoof, residential: houses, farmhouse: trees };

function scene(kind, seed, w, h, density = 5) {
  const rand = rng(seed);
  if (kind === 'commercial') return towers(rand, w, h, density);
  return (SCENES[kind] ?? towers)(rand, w, h);
}

/* ── Asset builders ──────────────────────────────────────────────────────── */

const PALETTE = {
  commercial: ['#1B2430', '#3A2E14'],
  industrial: ['#20262E', '#43331A'],
  residential: ['#1E2530', '#4A3818'],
  farmhouse: ['#1A2620', '#3E3616'],
};

function coverSvg({ kind, seed, title, subtitle, w = 1200, h = 800, showText = true, density = 5 }) {
  const [from, to] = PALETTE[kind] ?? PALETTE.commercial;
  const id = seed.replace(/[^a-z0-9]/gi, '');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}">
${defs(id, from, to)}
<rect width="${w}" height="${h}" fill="url(#g${id})"/>
<rect width="${w}" height="${h}" fill="url(#sky${id})"/>
<g transform="translate(0 ${h * 0.28}) scale(1 ${(h * 0.72) / h})">${scene(kind, seed, w, h, density)}</g>
<g opacity=".5">
  <path d="M0 ${h * 0.28} H${w}" stroke="${GOLD}" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="12 10"/>
</g>
${showText ? `<g transform="translate(48 ${h - 96})">
  <rect x="0" y="-34" width="6" height="46" rx="3" fill="${GOLD_LIGHT}"/>
  <text x="20" y="-8" font-family="Segoe UI, Inter, sans-serif" font-size="34" font-weight="800" fill="#ffffff">${title}</text>
  <text x="20" y="22" font-family="Segoe UI, Inter, sans-serif" font-size="18" font-weight="500" fill="#ffffff" fill-opacity=".62">${subtitle}</text>
</g>` : ''}
</svg>`;
}

function tileSvg({ kind, seed, label, w = 800, h = 600 }) {
  const [from, to] = PALETTE[kind] ?? PALETTE.commercial;
  const id = seed.replace(/[^a-z0-9]/gi, '');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">
${defs(id, from, to, 160)}
<rect width="${w}" height="${h}" fill="url(#g${id})"/>
<g transform="translate(0 ${h * 0.3}) scale(1 ${(h * 0.7) / h})">${scene(kind, seed, w, h)}</g>
<text x="${w / 2}" y="${h - 34}" text-anchor="middle" font-family="Segoe UI, Inter, sans-serif" font-size="24" font-weight="700" fill="#ffffff" fill-opacity=".85">${label}</text>
</svg>`;
}

function avatarSvg(seed, initials) {
  const rand = rng(seed);
  const hue = Math.floor(rand() * 40) + 25;
  const id = seed.replace(/[^a-z0-9]/gi, '');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160" role="img" aria-label="${initials}">
<defs><linearGradient id="a${id}" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${hue} 45% 32%)"/><stop offset="1" stop-color="hsl(${hue + 14} 55% 18%)"/>
</linearGradient></defs>
<rect width="160" height="160" rx="80" fill="url(#a${id})"/>
<circle cx="80" cy="62" r="26" fill="#ffffff" fill-opacity=".22"/>
<path d="M26 160 C26 116 50 98 80 98 C110 98 134 116 134 160 Z" fill="#ffffff" fill-opacity=".22"/>
<text x="80" y="150" text-anchor="middle" font-family="Segoe UI, Inter, sans-serif" font-size="0" fill="#fff">${initials}</text>
</svg>`;
}

function serviceSvg(seed, label) {
  const rand = rng(seed);
  const id = seed.replace(/[^a-z0-9]/gi, '');
  let bars = '';
  for (let i = 0; i < 6; i += 1) {
    const bh = 40 + rand() * 130;
    bars += `<rect x="${70 + i * 62}" y="${240 - bh}" width="42" height="${bh}" rx="4" fill="${GOLD_LIGHT}" fill-opacity="${(0.2 + i * 0.1).toFixed(2)}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 300" width="520" height="300" role="img" aria-label="${label}">
${defs(id, '#1B2029', '#3A2E14', 120)}
<rect width="520" height="300" fill="url(#g${id})"/>
${bars}
<path d="M40 252 H480" stroke="${GOLD}" stroke-opacity=".55" stroke-width="3"/>
<text x="40" y="42" font-family="Segoe UI, Inter, sans-serif" font-size="19" font-weight="700" fill="#ffffff" fill-opacity=".8">${label}</text>
</svg>`;
}

function logoMark() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="Ma Krupa Construction">
<defs><linearGradient id="lm" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${GOLD_LIGHT}"/><stop offset="1" stop-color="${GOLD}"/>
</linearGradient></defs>
<rect width="64" height="64" rx="14" fill="${INK}"/>
<path d="M14 46 V26 L24 18 L34 26 V46" fill="none" stroke="url(#lm)" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M34 46 V30 L43 24 L52 30 V46" fill="none" stroke="url(#lm)" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" opacity=".72"/>
<path d="M10 47 H54" stroke="url(#lm)" stroke-width="3.4" stroke-linecap="round"/>
</svg>`;
}

function logoFull() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 72" width="300" height="72" role="img" aria-label="Ma Krupa Construction">
<defs><linearGradient id="lf" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${GOLD_LIGHT}"/><stop offset="1" stop-color="${GOLD}"/>
</linearGradient></defs>
<rect x="4" y="4" width="64" height="64" rx="14" fill="${INK}"/>
<path d="M18 50 V30 L28 22 L38 30 V50" fill="none" stroke="url(#lf)" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M38 50 V34 L47 28 L56 34 V50" fill="none" stroke="url(#lf)" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" opacity=".72"/>
<path d="M14 51 H58" stroke="url(#lf)" stroke-width="3.4" stroke-linecap="round"/>
<text x="82" y="36" font-family="Segoe UI, Inter, sans-serif" font-size="25" font-weight="800" fill="${INK}">MA KRUPA</text>
<text x="83" y="55" font-family="Segoe UI, Inter, sans-serif" font-size="12" font-weight="600" letter-spacing="4.2" fill="${GOLD}">CONSTRUCTION</text>
</svg>`;
}

/* ── Drive from the same JSON the site renders ───────────────────────────── */

const read = (f) => JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'src/data', f), 'utf8'));

const projects = read('projects.json');
const categories = read('categories.json');
const products = read('products.json');
const testimonials = read('testimonials.json');
const about = read('about.json');

let count = 0;
const emit = (rel, svg) => {
  write(path.join(ROOT, rel), svg);
  count += 1;
};

// Logo
emit('logo/ma-krupa-mark.svg', logoMark());
emit('logo/ma-krupa-logo.svg', logoFull());

// Hero backdrop
emit('hero/hero-skyline.svg', coverSvg({
  kind: 'commercial', seed: 'hero-skyline',
  title: '', subtitle: '', showText: false, density: 9,
  w: 1600, h: 900,
}));

// Category art
for (const c of categories) {
  emit(c.image.replace('/images/', ''), tileSvg({ kind: c.id, seed: `cat-${c.id}`, label: c.name }));
}

// Project covers + galleries
for (const p of projects) {
  emit(p.cover.replace('/images/', ''), coverSvg({
    kind: p.category, seed: p.id, title: p.name,
    subtitle: `${p.location} | ${p.possession}`, showText: false,
  }));
  p.gallery.forEach((g, i) => {
    emit(g.replace('/images/', ''), tileSvg({
      kind: p.category, seed: `${p.id}-${i}`, label: `${p.name} ${i + 1}`, w: 1000, h: 700,
    }));
  });
}

// Service art
for (const s of products) {
  emit(s.image.replace('/images/', ''), serviceSvg(s.id, s.name));
}

// Avatars
const initials = (name) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
for (const t of testimonials) {
  emit(t.avatar.replace('/images/', ''), avatarSvg(`t-${t.id}`, initials(t.name)));
}
for (const l of about.leadership) {
  emit(l.avatar.replace('/images/', ''), avatarSvg(`l-${l.name}`, initials(l.name)));
}

console.log(`Generated ${count} SVG assets under public/images`);
