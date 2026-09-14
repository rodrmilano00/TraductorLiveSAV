/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FDFBF7',
        card: '#FFFFFF',
        muted: '#EFECE6',
        primary: '#E0702B',
        secondary: '#7C4023',
        teal: '#11525A',
        ink: '#2A323D',
        'text-muted': '#6B7280',
        success: '#16A34A',
        'success-bg': '#ECFDF5',
        red: '#DC2626',
        'red-bg': '#FEF2F2',
        'red-border': '#FECACA',
        'soft-orange': '#FEF3EC',
        'soft-orange-border': '#FDDCBA',
        'soft-teal': '#F0F9FA',
      },
      borderRadius: {
        soft: '12px',
        card: '20px',
        pill: '999px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'wave-anim': {
          '0%,100%': { height: '8px' },
          '50%': { height: '64px' },
        },
        'freq-anim': {
          '0%': { height: '4px' },
          '100%': { height: '100%' },
        },
        'rec-pulse': {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.4', transform: 'scale(.8)' },
        },
        'pulse-opacity': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '.3' },
        },
        'dot-bounce': {
          '0%,80%,100%': { transform: 'scale(.6)', opacity: '.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'blink': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'scale-in-bounce': {
          from: { transform: 'scale(0)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up-fade': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'wave-anim': 'wave-anim 1.2s ease-in-out infinite',
        'freq-anim': 'freq-anim .8s ease-in-out infinite alternate',
        'rec-pulse': 'rec-pulse 1s infinite',
        'pulse-opacity': 'pulse-opacity 1.5s infinite',
        'dot-bounce': 'dot-bounce 1.4s ease-in-out infinite',
        'spin-slow': 'spin-slow 1.2s linear infinite',
        'blink': 'blink .8s step-end infinite',
        'scale-in-bounce': 'scale-in-bounce .4s cubic-bezier(.34,1.56,.64,1)',
        'slide-up-fade': 'slide-up-fade .4s cubic-bezier(.34,1.56,.64,1)',
      },
    },
  },
  plugins: [],
};
