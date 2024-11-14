/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pri: '#fffaea',
        'pri-text': '#ffcb45',
        'pri-btn': '#ffcb42',
        'pri-dark': '#ffac4a'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
