/** @type {import('tailwindcss').Config} */

// KEP design tokens are exposed as RGB channels in globals.css so Tailwind can
// apply opacity modifiers (e.g. bg-brand/20). Helper wires `rgb(var(--x) / a)`.
const rgb = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/contexts/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // New design system defaults
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'IBM Plex Mono', 'SF Mono', 'monospace'],
        jakarta: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
        plexMono: ['var(--font-plex-mono)', 'IBM Plex Mono', 'monospace'],
        // Legacy fonts (student-facing pages)
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        DM: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        Jose: ['var(--font-josefin)', 'Josefin Sans', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        Nunito: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
        Roboto: ['var(--font-roboto)', 'Roboto', 'sans-serif'],
      },
      colors: {
        // ── legacy (student exam UI + legacy/) — do not remove ──
        black: '#37474F',
        white: '#FAFAFA',
        whitePlus: '#FFFFFF',
        accent1: '#1b81c4',
        accent2: '#d23438',
        taccent1: '#e7f2fb',
        grayPlus: '#D9D9D9',
        gray: '#98A0A4',

        // ── shadcn semantic tokens (mapped to KEP) ──
        border: rgb('--border'),
        input: rgb('--input'),
        ring: rgb('--ring'),
        background: rgb('--background'),
        foreground: rgb('--foreground'),
        primary: {
          DEFAULT: rgb('--primary'),
          foreground: rgb('--primary-foreground'),
        },
        secondary: {
          DEFAULT: rgb('--secondary'),
          foreground: rgb('--secondary-foreground'),
        },
        destructive: {
          DEFAULT: rgb('--destructive'),
          foreground: rgb('--destructive-foreground'),
        },
        muted: {
          DEFAULT: rgb('--muted'),
          foreground: rgb('--muted-foreground'),
        },
        accent: {
          DEFAULT: rgb('--accent'),
          foreground: rgb('--accent-foreground'),
        },
        popover: {
          DEFAULT: rgb('--popover'),
          foreground: rgb('--popover-foreground'),
        },
        card: {
          DEFAULT: rgb('--card'),
          foreground: rgb('--card-foreground'),
        },

        // ── KEP named tokens (design system) ──
        ink: {
          DEFAULT: rgb('--ink'),
          muted: rgb('--ink-muted'),
          faint: rgb('--ink-faint'),
        },
        paper: rgb('--paper'),
        surface: rgb('--surface'),
        line: {
          DEFAULT: rgb('--line'),
          strong: rgb('--line-strong'),
        },
        brand: {
          DEFAULT: rgb('--brand'),
          hover: rgb('--brand-hover'),
          ink: rgb('--brand-ink'),
          tint: rgb('--brand-tint'),
        },
        live: {
          DEFAULT: rgb('--live'),
          tint: rgb('--live-tint'),
        },
        danger: {
          DEFAULT: rgb('--danger'),
          ink: rgb('--danger-ink'),
        },
        warn: {
          tint: rgb('--warn-tint'),
          ink: rgb('--warn-ink'),
        },
      },
      borderColor: {
        DEFAULT: rgb('--line'),
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        pill: '999px',
      },
      boxShadow: {
        frame:
          '0 2px 6px rgba(26, 35, 50, 0.05), 0 14px 36px rgba(26, 35, 50, 0.08)',
        // legacy
        right: '2px 3px 7px 0 rgba(0, 0, 0, 0.15)',
      },
      maxWidth: {
        xxs: '16rem',
      },
      transitionTimingFunction: {
        kep: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-animate')],
  important: true,
};
