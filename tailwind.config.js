const colors = require("tailwindcss/colors");

// prettier quoteProps: consistent
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
      boxShadow: {
        actionCard: "0px 4px 64px rgba(78, 125, 217, 0.4)",
      },
      spacing: {
        /* 72px */
        18: "4.5rem",
      },
      colors: {
        "999BAB": "#999BAB",
        "728FB2": "#728FB2",
        "4E7DD9": "#4E7DD9",
        F1F3F6: "#F1F3F6",
        FEFEFF: "#FEFEFF",
        EEEEEE: "#EEEEEE",
        "9B9B9B": "#9B9B9B",
        "7398C0": "#7398C0",
        "89A0C2": "#89A0C2",
        e6f0fe: "#e6f0fe",

        F1F3F6: "#F1F3F6",
        364253: "#364253",
        DEEAF6: "#DEEAF6",
        B0C4DB: "#B0C4DB",
        DAE2EB: "#DAE2EB",
        CEEBED: "#CEEBED",
        "21AD8C": "#21AD8C",
        FA5C2F: "#FA5C2F",
        "15aac8": "#15aac8",
        d4dfee: "#d4dfee",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
