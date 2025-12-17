/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class', // Use class strategy for dark mode
	content: [
	  './app/**/*.{js,ts,jsx,tsx}',
	  './components/**/*.{js,ts,jsx,tsx}',
	  './src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
	  extend: {},
	},
	plugins: [],
  };
  