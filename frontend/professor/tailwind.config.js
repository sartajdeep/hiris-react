export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#28666E',
        hiris: { teal: '#28666E' },
      },
      fontFamily: {
        sans: ['Public Sans', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        mono: ['Inter', 'monospace'],
      },
      boxShadow: {
        sm:   '0 1px 3px rgba(0,0,0,0.06)',
        md:   '0 4px 12px rgba(0,0,0,0.08)',
        xl:   '0 20px 40px rgba(0,0,0,0.12)',
        card: '0 1px 2px rgba(0,0,0,0.04)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        }
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
      },
    },
  },
  plugins: [],
}
