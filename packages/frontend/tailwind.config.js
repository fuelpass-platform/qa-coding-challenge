import { heroui } from '@heroui/react';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

// Resolve @heroui/theme's dist path robustly. In this npm workspace the package
// is hoisted to the repo-root node_modules and nested under @heroui/react, so a
// plain './node_modules/@heroui/theme' glob (relative to this config) misses it
// and HeroUI's component classes — e.g. dropdown/popover backgrounds — never get
// generated. Resolving via @heroui/react finds it wherever npm placed it.
const require = createRequire(import.meta.url);
const reactDir = dirname(require.resolve('@heroui/react/package.json'));
const themeDir = dirname(
  require.resolve('@heroui/theme/package.json', { paths: [reactDir] }),
);
const herouiThemeGlob = join(themeDir, 'dist/**/*.{js,ts,jsx,tsx}');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    herouiThemeGlob,
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // FuelPass brand navy (design-system.md)
        fuelpass: {
          50: '#E9EFFB',
          100: '#C9D8F6',
          200: '#96B3ED',
          300: '#5C87E0',
          400: '#2C5FBE',
          500: '#002366',
          600: '#001E5A',
          700: '#00184A',
          800: '#001336',
          900: '#000D26',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: '#E9EFFB',
            foreground: '#002366',
            focus: '#4168E9',
            primary: {
              50: '#E6F1FE',
              100: '#CCE3FD',
              200: '#99C7FB',
              300: '#66AAF9',
              400: '#338EF7',
              500: '#4168E9',
              600: '#005BC4',
              700: '#004493',
              800: '#002E62',
              900: '#001731',
              DEFAULT: '#4168E9',
              foreground: '#FFFFFF',
            },
          },
        },
      },
    }),
  ],
};
