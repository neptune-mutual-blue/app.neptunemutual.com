// prettier quoteProps: consistent
module.exports = {
  content: ["./lib/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    boxShadow: {
      card: "0px 6px 8px 0px rgba(0, 0, 0, 0.1)",
      mainCard:
        "0 3px 3px 0 rgb(162, 166, 218, 0.05), 0 30px 60px -30px #a2a6da",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#01052d",
      white: "#fefeff",
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
      xxs: ["10px", "8px"],
      xs: [
        "12px",
        {
          letterSpacing: "0.05em",
          lineHeight: "24px",
        },
      ],
      para: ["16px", "28px"],
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
      borderRadius: {
        big: "0.625rem",
      },
      boxShadow: {
        actionCard: "0px 4px 64px rgba(78, 125, 217, 0.4)",
      },
      spacing: {
        /* 72px */
        18: "4.5rem",
      },
      maxWidth: {
        180: "180px",
      },
      colors: {
        "999BAB": "#999BAB",
        "728FB2": "#728FB2",
        "4E7DD9": "#4E7DD9",
        F1F3F6: "#F1F3F6",
        EEEEEE: "#EEEEEE",
        F4F8FC: "#F4F8FC",
        "5F5F5F": "#5F5F5F",
        "9B9B9B": "#9B9B9B",
        "7398C0": "#7398C0",
        "89A0C2": "#89A0C2",
        e6f0fe: "#e6f0fe",
        e2ebf6: "#e2ebf6",
        364253: "#364253",
        DEEAF6: "#DEEAF6",
        B0C4DB: "#B0C4DB",
        DAE2EB: "#DAE2EB",
        CEEBED: "#CEEBED",
        "21AD8C": "#21AD8C",
        FA5C2F: "#FA5C2F",
        "15aac8": "#15aac8",
        d4dfee: "#d4dfee",
        E5E5E5: "#e5e5e5",
        AABDCB: "#AABDCB",
        "0FB88F": "#0FB88F",
        D4DFEE: "#D4DFEE",
        CDD6E3: "#CDD6E3",
        404040: "#404040",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
