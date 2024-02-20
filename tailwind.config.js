/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        mybackground: '#151516',
        myblue: '#6ac3f2',
        mypink: '#e986ae',
        mytext: '#e7e7e7'
      },
      fontFamily: {
        display: 'Fira Code VF'
      }
    }
    
  },
  plugins: [],
}

