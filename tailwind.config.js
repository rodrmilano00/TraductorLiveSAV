/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette from SenasAVoces
        brand: {
          cream: '#FAF7ED',
          teal: '#0D5C6F',
          deep: '#083D48',
          card: '#0C4A57',
          line: '#1A5C6A',
          cyan: '#2AABB8',
          orange: '#EC9960',
          soft: '#8AACB4',
          muted: '#5A7A82',
          mist: '#D4E4E8',
          ink: '#1A2E35',
          mint: '#A8D5BA',
        },
        // Semantic colors
        bg: '#F8F5EE',
        card: '#FFFFFF',
        muted: '#E8E4D8',
        primary: '#D97736',
        secondary: '#8C4A27',
        teal: '#0D5C6F',
        ink: '#1A2E3B',
        'text-muted': '#607274',
        success: '#0D5C6F',
        'success-bg': '#E8F5F0',
        red: '#D96B6B',
        'red-bg': '#FEF2F2',
        'red-border': '#FECACA',
        'soft-orange': '#FEF3EC',
        'soft-orange-border': '#FDDCBA',
        'soft-teal': '#F0F9FA',
        'progress-track': '#F4EFE6',
      },
      borderRadius: {
        soft: '12px',
        card: '16px',
        pill: '999px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px rgba(26, 46, 53, 0.09)',
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
