/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"]
      },
      colors: {
        app: "#FDFBF7",
        card: "#FFFFFF",
        muted: "#EFECE6",
        brand: {
          cream: "#FDFBF7",
          card: "#FFFFFF",
          orange: "#E0702B",
          brown: "#7C4023",
          teal: "#11525A",
          deep: "#0D3D44",
          line: "#EFECE6",
          mist: "#EFECE6",
          ink: "#2A323D",
          muted: "#6B7280",
          soft: "#9CA3AF",
          cyan: "#2AABB8",
          mint: "#A8D5BA",
          red: "#DC2626",
          success: "#16A34A",
          successBg: "#ECFDF5",
          heat1: "#F3D8C6",
          heat2: "#EFA07A",
          heat3: "#E0702B",
          heat4: "#B13E10",
          softOrange: "#FEF3EC",
          softOrangeBorder: "#FDDCBA",
          softRed: "#FEF2F2",
          softRedBorder: "#FECACA",
          softTeal: "#F0F9FA",
        },
        text: {
          main: "#2A323D",
          muted: "#6B7280"
        }
      },
      borderRadius: {
        'soft': '12px',
        'softer': '20px',
        'card': '20px',
        'pill': '999px'
      },
      boxShadow: {
        soft: "0 12px 40px rgba(42, 50, 61, 0.06)",
        card: "0 1px 2px rgba(42, 50, 61, 0.04)",
        lift: "0 6px 18px rgba(42, 50, 61, 0.08)",
        glow: "0 0 20px rgba(224, 112, 43, 0.25)",
        primary: "0 6px 20px rgba(224, 112, 43, 0.3)",
        primarySm: "0 4px 16px rgba(224, 112, 43, 0.25)",
        success: "0 4px 16px rgba(22, 163, 74, 0.25)",
        teal: "0 4px 16px rgba(17, 82, 90, 0.2)",
        logoMark: "0 4px 20px rgba(224, 112, 43, 0.15)",
      },
      keyframes: {
        'wave-anim': {
          '0%, 100%': { height: '8px' },
          '50%': { height: '64px' },
        },
        'freq-anim': {
          '0%': { height: '4px' },
          '100%': { height: '100%' },
        },
        'rec-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.8)' },
        },
        'dot-bounce': {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        'spin': {
          'to': { transform: 'rotate(360deg)' },
        },
        'pulse-opacity': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'scale-in-bounce': {
          'from': { transform: 'scale(0)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up-fade': {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'wave-anim': 'wave-anim 1.2s ease-in-out infinite',
        'freq-anim': 'freq-anim 0.8s ease-in-out infinite alternate',
        'rec-pulse': 'rec-pulse 1s infinite',
        'dot-bounce': 'dot-bounce 1.4s ease-in-out infinite',
        'spin': 'spin 1.2s linear infinite',
        'spin-fast': 'spin 0.8s linear infinite',
        'pulse-opacity': 'pulse-opacity 1.5s infinite',
        'blink': 'blink 0.8s step-end infinite',
        'scale-in-bounce': 'scale-in-bounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-up-fade': 'slide-up-fade 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
    },
  },
  plugins: []
};
