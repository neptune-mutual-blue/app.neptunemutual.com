const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./lib/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    borderRadius: {
      none: "0",
      sm: "0.125rem",
      DEFAULT: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.625rem",
      "2xl": "0.75rem",
      "3xl": "1rem",
      "4xl": "1.5rem",
      full: "9999px",
    },
    boxShadow: {
      card: "0px 6px 8px 0px rgba(0, 0, 0, 0.1)",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#01052D",
    },
    fontSize: {
      h1: ["33px", "48px"],
      h2: ["28px", "40px"],
      h3: ["23px", "32px"],
      h4: ["19px", "24px"],
      h5: ["16px", "24px"],
      h6: [
        "16px",
        {
          letterSpacing: "0.05em",
          lineHeight: "24px",
        },
      ],
      sm: ["14px", "16px"],
      para: ["16px", "28px"],
      body: ["16px", "32px"],
      cta: [
        "15px",
        {
          letterSpacing: "0.05em",
          lineHeight: "16px",
        },
      ],
    },
    fontFamily: {
      poppins: "Poppins, sans-serif",
      sora: "Sora, sans-serif",
    },
    extend: {
      spacing: {
        /* 72px */
        18: "4.5rem",
      },
      colors: {
        "999BAB": "#999BAB",
        "728FB2": "#728FB2",
        primary: "#4E7DD9",
        gray: {
          /* background */
          bg: "#F1F3F6",
        },
        white: {
          /* background */
          bg: "#FEFEFF",
          /* text */
          fg: "#EEEEEE",
        },
        dimmed: {
          /* text */
          fg: "#9B9B9B",
          /* card text*/
          card: "#7398C0",
        },
        ash: {
          fg: "#89A0C2",
          /* background (gray) */
          bg: "#F1F3F6",
          /* Neutral Brand */
          neutral: "#364253",
          /* Background (Brand, Neutral) */
          brand: "#DEEAF6",
          /* TextInput (Border Color) */
          border: "#B0C4DB",
          /* Background (Secondary Button) */
          secondary: "#DAE2EB",
        },
        teal: {
          /* light */
          light: "#CEEBED",
          neutral: "#21AD8C",
        },
        orange: {
          neutral: "#FA5C2F",
        },
      },
      width: {
        lgInput: "488px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
