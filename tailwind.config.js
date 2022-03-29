module.exports = {
  content: ["./lib/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "600px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
    },
    boxShadow: {
      card: "0px 6px 8px 0px rgba(0, 0, 0, 0.1)",
      mainCard:
        "0 3px 3px 0 rgb(162, 166, 218, 0.05), 0 30px 60px -30px #a2a6da",
      toolTip: "0px 2px 6px rgba(0, 0, 0, 0.25)",
      option: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      homeCard: "0px 4px 5px rgba(0, 0, 0, 0.05)",
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
      h7: ["13px", "16px"],
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
      xxxl: "136px",
      xxl: "40px",
    },
    fontFamily: {
      poppins: "Poppins, sans-serif",
      sora: "Sora, sans-serif",
    },
    extend: {
      borderRadius: {
        1: "4px",
        big: "0.625rem",
        mdlg: "7px",
      },
      borderWidth: {
        0.5: "0.5px",
      },
      boxShadow: {
        actionCard: "0px 4px 64px rgba(78, 125, 217, 0.4)",
      },
      spacing: {
        /* 72px */
        18: "4.5rem",
      },
      lineHeight: {
        4.5: "18px",
      },
      maxWidth: {
        180: "180px",
        15: "15rem",
      },
      minWidth: {
        sm: "384px",
        5: "5px",
        60: "60px",
        120: "120px",
        300: "300px",
        500: "500px",
        550: "550px",
        600: "600px",
      },
      colors: {
        "999BAB": "#999BAB",
        "728FB2": "#728FB2",
        "4e7dd9": "#4e7dd9",
        "f1f3f6": "#f1f3f6",
        "EEEEEE": "#EEEEEE",
        "F4F8FC": "#F4F8FC",
        "5F5F5F": "#5F5F5F",
        "9B9B9B": "#9B9B9B",
        "7398C0": "#7398C0",
        "89A0C2": "#89A0C2",
        "e6f0fe": "#e6f0fe",
        "e2ebf6": "#e2ebf6",
        "364253": "#364253",
        "DEEAF6": "#DEEAF6",
        "B0C4DB": "#B0C4DB",
        "DAE2EB": "#DAE2EB",
        "CEEBED": "#CEEBED",
        "21AD8C": "#21AD8C",
        "FA5C2F": "#FA5C2F",
        "15aac8": "#15aac8",
        "d4dfee": "#d4dfee",
        "E5E5E5": "#e5e5e5",
        "AABDCB": "#AABDCB",
        "0FB88F": "#0FB88F",
        "CDD6E3": "#CDD6E3",
        "404040": "#404040",
        "8F949C": "#8F949C",
        "3A4557": "#3A4557",
        "016D8E": "#016D8E",
        "DC2121": "#DC2121",
        "4289F2": "#4289F2",
      },
      minHeight: {
        360: "360px",
      },
      maxHeight: {
        "144": "36rem",
        "90vh": "90vh",
        "30vh": "30vh",
        "45vh": "45vh",
      },
      height: {
        500: "500px",
      },
      width: {
        800: "800px",
      },
      backgroundImage: {
        "404-background": "url('/404_bg.svg')",
        "gradient-bg": "url(/gradient.svg)",
      },
      transitionTimingFunction: {
        menu: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      zIndex: {
        60: "60",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
