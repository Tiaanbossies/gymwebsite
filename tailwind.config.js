/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    // Custom screens — adds an `xs` breakpoint for very small phones (320–419px)
    // so we can dial layout/spacing/type *before* the standard sm (640) breakpoint.
    // Standard breakpoints (sm/md/lg/xl/2xl) are kept intact.
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Neutral ink scale — black through cool off-white.
        // Questionnaire says "black" is a brand colour and neons should be avoided,
        // so the base is deep, calm blue-black rather than true #000 black.
        ink: {
          950: '#05070d',
          900: '#0a0d16',
          800: '#111420',
          700: '#1a1e2c',
          600: '#2a2f40',
          500: '#4a5168',
          400: '#8a90a5',
          300: '#c4c9d8',
          200: '#e6eaf1',
          100: '#f5f6fa',
        },
        // Primary brand: Red — taken straight from the logo wordmark + ring.
        // Bold, energetic, and unmistakeably "Bossie's". Applied across CTAs,
        // headings emphasis, glow effects, focus rings.
        brand: {
          50:  '#fff1f2',
          100: '#ffdee1',
          200: '#ffbec4',
          300: '#ff8d96',
          400: '#f4535f',
          500: '#dc2b38', // primary — matches BOSSIE'S wordmark red
          600: '#b51e29',
          700: '#951a23',
          800: '#7a1820',
          900: '#5f141a',
        },
        // Accent: Steel blue — pulled from the muscular figures in the crest.
        // Used for secondary highlights, info chips, decorative accents
        // alongside the primary red.
        accent: {
          50:  '#f1f6fa',
          100: '#dde9f0',
          200: '#bbd0dd',
          300: '#8fafc3',
          400: '#5d87a1',
          500: '#3d6479', // primary accent — matches the figures' tones
          600: '#305162',
          700: '#284151',
          800: '#233844',
          900: '#1c2c36',
        },
      },
      fontFamily: {
        // Kept Archivo Black for impact, Inter for body. No brand font was specified (Q27).
        display: ['"Archivo Black"', '"Bebas Neue"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        headline: '-0.02em',
        mega: '-0.035em',
      },
      // Fluid spacing tokens — used by the .section / .section-tight component
      // classes so vertical rhythm scales smoothly from mobile to desktop instead
      // of stepping at sm only.
      spacing: {
        'fluid-section': 'clamp(3.5rem, 8vw, 7rem)',
        'fluid-section-tight': 'clamp(3rem, 6vw, 5.5rem)',
        'fluid-block': 'clamp(2rem, 4vw, 3.5rem)',
        // Safe-area inset offsets so floating buttons honour iOS notches/home bars
        'safe-b': 'env(safe-area-inset-bottom)',
      },
      boxShadow: {
        card: '0 8px 30px rgba(0, 0, 0, 0.35)',
        // "Glow" uses brand red (logo wordmark/ring colour)
        glow: '0 0 0 1px rgba(220, 43, 56, 0.45), 0 10px 40px -10px rgba(220, 43, 56, 0.35)',
        // A more pronounced glow for the active/featured card states
        'glow-lg': '0 0 0 1px rgba(220, 43, 56, 0.45), 0 22px 70px -18px rgba(220, 43, 56, 0.45)',
        soft: '0 10px 40px -15px rgba(0,0,0,0.25)',
        lift: '0 18px 60px -18px rgba(0,0,0,0.55)',
      },
      backgroundImage: {
        grid: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
        // Brand red wash from the centre/top of the hero
        'radial-fade': 'radial-gradient(60% 60% at 50% 0%, rgba(220,43,56,0.18), transparent 60%)',
        // Steel-blue accent wash from the right-hand side
        'radial-fade-red': 'radial-gradient(60% 60% at 100% 0%, rgba(61,100,121,0.18), transparent 60%)',
      },
      backgroundSize: {
        grid: '56px 56px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        // Slow ambient drift used on hero blobs / decorative orbs.
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%':       { transform: 'translate3d(0,-12px,0) scale(1.04)' },
        },
        // Lightweight shimmer used as a placeholder loading state.
        shimmer: {
          '0%':   { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: '200px 0' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        pulseRing: 'pulseRing 1.8s cubic-bezier(0.4,0,0.6,1) infinite',
        drift: 'drift 9s ease-in-out infinite',
        'drift-slow': 'drift 14s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
