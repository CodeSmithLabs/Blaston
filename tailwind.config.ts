import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'lockedin-purple-light': '#9B4CDA',
        'lockedin-purple': '#7D3CBD',
        'lockedin-purple-dark': '#4B2380'
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['var(--font-inter)']
      },
      animation: {
        fadeIn: 'fadeIn 700ms ease-in-out'
      },
      keyframes: () => ({
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      })
    }
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')]
};

export default config;
