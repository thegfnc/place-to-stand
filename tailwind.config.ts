import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        gradientPrimary:
          'linear-gradient(135deg, #BE93C5 0%, #A3A6C7 50%, #7BC6CC 100%)',
      },
      colors: {
        accent: '#A3A6C7',
        ink: {
          DEFAULT: '#111827',
          light: '#F9FAFB',
        },
      },
      fontFamily: {
        display: ['var(--font-bebas-neue)'],
        logo: ['var(--font-afacad)'],
        sans: ['var(--font-source-sans)'],
        headline: ['var(--font-afacad)'],
      },
      lineHeight: {
        tighter: '1.2',
        tightest: '1.1',
      },
      boxShadow: {
        neo: '4px 4px 0px 0px rgba(17, 24, 39, 1)',
        'neo-lg': '6px 6px 0px 0px rgba(17, 24, 39, 1)',
        'neo-sm': '2px 2px 0px 0px rgba(17, 24, 39, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease forwards',
        marquee: 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [animate],
}

export default config
