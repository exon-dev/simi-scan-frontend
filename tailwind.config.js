/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				prim: "#176FF2",
				second: "#196EEE",
			},
			backgroundColor: {
				prim: "#176FF2",
				second: "#196EEE",
			},
			fontSize: {
				header: "35",
				desc: "20",
				label: "15",
				text: "13",
			},
		},
	},
	plugins: [],
};
