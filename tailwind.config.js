/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,css}'],
  theme: {
    extend: {
      colors: {
        /**
         * Ma Krupa house palette — warm architectural luxury.
         * `brand` is the antique gold used for every accent, rule and CTA.
         * `ink` is a WARM espresso neutral (not blue-grey): at 900/950 it reads
         * as the deep near-black brown the whole site sits on, and at 50/100 it
         * is the ivory used for the "curtain" light sections.
         */
        brand: {
          50: '#FBF6E9', 100: '#F6ECD1', 200: '#EDD9A4', 300: '#E1C177',
          400: '#D4A94F', 500: '#C39336', 600: '#A8792A', 700: '#866024',
          800: '#6B4E22', 900: '#58411F', 950: '#33240F',
        },
        ink: {
          50: '#FAF7F1', 100: '#F2ECE1', 200: '#E3D9C9', 300: '#C9BCA8',
          400: '#A2937E', 500: '#7D6F5D', 600: '#5C5145', 700: '#403830',
          800: '#241E1A', 900: '#141110', 950: '#0A0806',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      letterSpacing: { widest2: '0.28em' },
      boxShadow: {
        soft: '0 2px 10px -2px rgb(10 8 6 / 0.35), 0 8px 30px -12px rgb(10 8 6 / 0.45)',
        lift: '0 14px 40px -14px rgb(195 147 54 / 0.55)',
        glow: '0 0 0 1px rgb(195 147 54 / 0.22), 0 22px 60px -22px rgb(195 147 54 / 0.6)',
        inset: 'inset 0 1px 0 0 rgb(255 255 255 / 0.06)',
      },
      backgroundImage: {
        'grid-lines':
          'linear-gradient(to right, rgb(225 193 119 / 0.10) 1px, transparent 1px), linear-gradient(to bottom, rgb(225 193 119 / 0.10) 1px, transparent 1px)',
        'gold-sheen': 'linear-gradient(110deg, transparent 25%, rgb(255 255 255 / 0.35) 50%, transparent 75%)',
        'gold-line': 'linear-gradient(90deg, transparent, #C39336, transparent)',
        'vignette': 'radial-gradient(120% 90% at 50% 40%, transparent 35%, rgb(10 8 6 / 0.75) 100%)',
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
