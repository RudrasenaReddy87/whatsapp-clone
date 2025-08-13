// frontend/tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
          darker: '#075E54',
          light: '#DCF8C6',
          gray: '#ECE5DD',
        }
      }
    },
  },
  plugins: [],
}