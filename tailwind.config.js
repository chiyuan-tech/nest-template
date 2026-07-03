/** @type {import('tailwindcss').Config} */
const defaultColors = require('tailwindcss/colors');

module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      ...defaultColors,
    },
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)'],
        inter: ['var(--font-inter)'],
        poppins: ['var(--font-poppins)'],
        baloo: ['var(--font-baloo)'],
        nunito: ['var(--font-nunito)']
      },
      maxWidth: {
        '7xl': '80rem',
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground, var(--foreground))",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
        error: "var(--destructive)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "1.25rem",
        sm: "0.375rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        DEFAULT: '0 24px 48px rgb(0 0 0 / 0.08)',
        sm: '0 4px 24px rgb(0 0 0 / 0.04)',
        md: '0 24px 48px rgb(0 0 0 / 0.08)',
        lg: '0 24px 48px rgb(0 0 0 / 0.08)',
        xl: '0 32px 64px rgb(0 0 0 / 0.10)',
        '2xl': '0 70px 110px rgb(0 0 0 / 0.18)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        none: 'none',
        'custom': '0 24px 48px rgba(0, 0, 0, 0.08)',
        'nav': '0 4px 24px rgba(0, 0, 0, 0.04)',
        'card': '0 24px 48px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} 
