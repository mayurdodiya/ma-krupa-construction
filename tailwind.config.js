/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /**
         * Maa Krupa house palette — light coastal-blue identity.
         * `brand` is the deep blue used for every accent, rule and CTA
         * (headings, links, primary buttons, active states).
         * `sky` is the lighter secondary blue used for highlights, badges
         * and soft fills.
         * `ink` is now a COOL blue-grey neutral running the OPPOSITE
         * direction from before: 50/100 is the near-white/ivory the page
         * sits on, 900/950 is the deep navy used for body text and dark
         * chrome (footer, overlays on photos). Every component that reads
         * `bg-ink-950 text-white` for "the dark page background" was
         * rewritten to `bg-ink-50 text-ink-900` — see the file-by-file
         * light-theme pass in git history for that conversion.
         */
        brand: {
          50: '#EAF5FA', 100: '#D3EAF3', 200: '#A8D5E7', 300: '#78BCD8',
          400: '#409DC4', 500: '#0E7FAE', 600: '#0B6285', 700: '#095068',
          800: '#083F53', 900: '#06303F', 950: '#041F29',
        },
        sky: {
          50: '#F4FBFD', 100: '#E4F5FA', 200: '#C7EAF4', 300: '#9FDAEC',
          400: '#87CEEB', 500: '#5EA3C0', 600: '#4A8AA6', 700: '#3C7089',
          800: '#305B6F', 900: '#28495A',
        },
        ink: {
          50: '#F0F7FA', 100: '#E4EFF4', 200: '#CBDFE8', 300: '#A9C7D5',
          400: '#7FA5B8', 500: '#5D8598', 600: '#48697A', 700: '#37505E',
          800: '#25363F', 900: '#152128', 950: '#0B1418',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      letterSpacing: { widest2: '0.28em' },
      boxShadow: {
        // Soft neutral shadow for cards sitting on the light ivory background.
        soft: '0 2px 10px -2px rgb(11 20 24 / 0.06), 0 8px 30px -12px rgb(11 20 24 / 0.10)',
        // Blue-tinted lift/glow — keys kept as `lift`/`glow` (used across ~20
        // files) but recoloured from gold to the new brand blue.
        lift: '0 14px 40px -14px rgb(11 98 133 / 0.35)',
        glow: '0 0 0 1px rgb(11 98 133 / 0.16), 0 22px 60px -22px rgb(11 98 133 / 0.45)',
        inset: 'inset 0 1px 0 0 rgb(11 20 24 / 0.04)',
      },
      backgroundImage: {
        'grid-lines':
          'linear-gradient(to right, rgb(11 98 133 / 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgb(11 98 133 / 0.07) 1px, transparent 1px)',
        // Keys kept as `gold-sheen`/`gold-line` for the ~15 files that
        // reference them, but both are blue now, not gold.
        'gold-sheen': 'linear-gradient(110deg, transparent 25%, rgb(255 255 255 / 0.55) 50%, transparent 75%)',
        'gold-line': 'linear-gradient(90deg, transparent, #0B6285, transparent)',
        // Only used to grade PHOTOGRAPHS (hero/testimonial images) for text
        // legibility — stays dark on purpose even in the light theme, the
        // same way a photo caption overlay would on any light-themed site.
        'vignette': 'radial-gradient(120% 90% at 50% 40%, transparent 35%, rgb(11 20 24 / 0.65) 100%)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(18px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        'marquee-rev': { '0%': { transform: 'translateX(-50%)' }, '100%': { transform: 'translateX(0)' } },
        'pulse-ring': { '0%': { transform: 'scale(.9)', opacity: .7 }, '70%': { transform: 'scale(1.6)', opacity: 0 }, '100%': { opacity: 0 } },
        shimmer: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        'draw-line': { '0%': { strokeDashoffset: 1000 }, '100%': { strokeDashoffset: 0 } },
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.15 } },
        // Slow cinematic push used by the hero stills so the page never sits still.
        'ken-burns': { '0%': { transform: 'scale(1.06) translate3d(0,0,0)' }, '100%': { transform: 'scale(1.18) translate3d(-1.2%,-1.6%,0)' } },
        'scroll-dot': { '0%': { transform: 'translateY(0)', opacity: 0 }, '30%': { opacity: 1 }, '100%': { transform: 'translateY(14px)', opacity: 0 } },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        'rotate-y': { to: { transform: 'rotateY(360deg)' } },
      },
      animation: {
        'fade-up': 'fade-up .6s cubic-bezier(.22,1,.36,1) both',
        marquee: 'marquee 38s linear infinite',
        'marquee-rev': 'marquee-rev 44s linear infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(.24,0,.38,1) infinite',
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 2.4s ease-in-out infinite',
        'draw-line': 'draw-line 2.4s ease-out forwards',
        blink: 'blink 1.4s ease-in-out infinite',
        'ken-burns': 'ken-burns 9s ease-out both',
        'scroll-dot': 'scroll-dot 1.8s ease-in-out infinite',
        'spin-slow': 'spin-slow 26s linear infinite',
      },
    },
  },
  plugins: [],
};
