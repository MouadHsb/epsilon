/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Wood tones
        'wood': '#8B4513',
        'wood-dark': '#654321',
        'wood-light': '#D2B48C',
        
        // Resin accent colors
        'resin-blue': '#1E40AF',
        'resin-green': '#059669',
        'resin-amber': '#F59E0B',
        'resin-purple': '#7C3AED',
        
        // Main theme colors
        'primary': '#8B4513',
        'primary-dark': '#2D1B14',
        'background': '#FAF7F3',
        'surface': '#F5F0E8',
        'accent': '#CD853F',
        
        // Neutral wood tones
        'timber': {
          50: '#FAF7F3',
          100: '#F5F0E8',
          200: '#E8DCC6',
          300: '#D2B48C',
          400: '#CD853F',
          500: '#8B4513',
          600: '#654321',
          700: '#2D1B14',
          800: '#1A0F0A',
          900: '#0D0805',
        }
      },
    },
  },
  plugins: [],
}