/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  mode: 'jit',
  theme: {
    extend: {
      gridTemplateRows: {
        // Simple 8 row grid
        8: 'repeat(8, minmax(0, 1fr))',
        9: 'repeat(9, minmax(0, 1fr))',
        10: 'repeat(10, minmax(0, 1fr))',

        // Complex site-specific row configuration
        layout: '200px minmax(900px, 1fr) 100px',
      },
      colors: {
        primary: '#00040F',
        secondary: '#00f6ff',
        dimWhite: 'rgba(255, 255, 255, 0.7)',
      },
      fontFamily: {
        poppings: ['Poppins', 'sans-serif'],
      },
    },
    screens: {
      xs: '480px',
      ss: '620px',
      sm: '768px',
      md: '1060px',
      lg: '1200px',
      xl: '1700px',
    },
  },
  plugins: [],
};
