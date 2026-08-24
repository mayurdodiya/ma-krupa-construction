import site from '@/data/site.json';
import categories from '@/data/categories.json';
import statuses from '@/data/statuses.json';
import projects from '@/data/projects.json';
import products from '@/data/products.json';
import testimonials from '@/data/testimonials.json';
import faqs from '@/data/faqs.json';
import rera from '@/data/rera.json';
import about from '@/data/about.json';
import calculators from '@/data/calculators.json';
import meeting from '@/data/meeting.json';
import chatbot from '@/data/chatbot.json';

export {
  site, categories, statuses, projects, products,
  testimonials, faqs, rera, about, calculators, meeting, chatbot,
};

/** Client-supplied render/footage reels shown in the About page Brand Film section. */
export const reels = site.reels ?? [];

/* ── Contact deep links ───────────────────────────────────────────────── */

/** wa.me deep link. Works on the mobile app and WhatsApp Web alike. */
export function waLink(message) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const telLink = `tel:${site.phoneRaw}`;
export const mailLink = `mailto:${site.email}`;

export const generalEnquiry = `Hello ${site.name}, I would like to know more about your projects.`;

/** Pre-filled enquiry text so the client receives context, not a bare "hi". */
export function projectEnquiry(project) {
  if (!project) return generalEnquiry;
  return `Hello ${site.name}, I am interested in ${project.name} at ${project.location}. Please share the price list, floor plans and payment plan.`;
}

export function productEnquiry(product) {
  if (!product) return generalEnquiry;
  return `Hello ${site.name}, I would like a quote for ${product.name}. Please get in touch.`;
}

/* ── Lookups ──────────────────────────────────────────────────────────── */

export function getCategory(id) {
  return categories.find((c) => c.id === id) ?? null;
}

export function getStatus(id) {
  return statuses.find((s) => s.id === id) ?? null;
}

export function getProject(id) {
  return projects.find((p) => p.id === id) ?? null;
}

export function getProduct(id) {
  return products.find((p) => p.id === id) ?? null;
}

export const featuredProjects = projects.filter((p) => p.featured);
export const featuredProducts = products.filter((p) => p.featured);

export function projectsByStatus(status) {
  return projects.filter((p) => p.status === status);
}

export function projectsByCategory(category) {
  return projects.filter((p) => p.category === category);
}

export function countByCategory(categoryId) {
  return projects.filter((p) => p.category === categoryId).length;
}

export function countByStatus(statusId) {
  return projects.filter((p) => p.status === statusId).length;
}

/** Same-category projects, excluding the one being viewed. */
export function relatedProjects(project, limit = 3) {
  if (!project) return [];
  return projects.filter((p) => p.category === project.category && p.id !== project.id).slice(0, limit);
}

/**
 * Single source of truth for catalogue filtering, shared by the projects page
 * and the chatbot deep links. An empty category/status means "no restriction".
 */
export function filterProjects({ category = '', status = '', search = '' } = {}) {
  const q = search.trim().toLowerCase();
  return projects.filter((p) => {
    if (category && p.category !== category) return false;
    if (status && p.status !== status) return false;
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      (p.configurations ?? []).some((c) => c.toLowerCase().includes(q)) ||
      (p.amenities ?? []).some((a) => a.toLowerCase().includes(q))
    );
  });
}

/* ── Formatting ───────────────────────────────────────────────────────── */

/** Indian short-form money: 85,00,000 renders as "Rs. 85 Lac", 1.55e7 as "Rs. 1.55 Cr". */
export function formatINRShort(value) {
  if (value == null || Number.isNaN(value)) return '--';
  const n = Number(value);
  if (n >= 10000000) {
    const cr = n / 10000000;
    return `Rs. ${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
  }
  if (n >= 100000) {
    const lac = n / 100000;
    return `Rs. ${lac % 1 === 0 ? lac : lac.toFixed(2)} Lac`;
  }
  return `Rs. ${Math.round(n).toLocaleString('en-IN')}`;
}

/** Full rupee figure with Indian digit grouping. */
export function formatINR(value) {
  if (value == null || Number.isNaN(value)) return '--';
  return `Rs. ${Math.round(Number(value)).toLocaleString('en-IN')}`;
}

export function formatNumber(value) {
  if (value == null || Number.isNaN(value)) return '--';
  return Number(value).toLocaleString('en-IN');
}
