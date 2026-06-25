/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', '"Noto Serif SC"', 'serif'],
        sans: ['"Inter"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        archive: {
          cream: '#F7F5F2',
          ink: '#1F1F1F',
          muted: '#6B6B6B',
          terracotta: '#B85C4F',
          amber: '#C88A3D',
          sage: '#7A8B7A',
          border: '#E8E4DF',
          glass: 'rgba(255, 255, 255, 0.82)',
        },
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
