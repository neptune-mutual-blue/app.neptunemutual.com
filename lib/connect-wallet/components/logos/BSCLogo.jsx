import * as React from "react";
import styles from "./styles.module.css";

const BSCLogo = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    xmlSpace="preserve"
    className={styles.svg_style}
    {...props}
  >
    <path
      d="M19 26.4V30l-3 1.8-3-1.8v-3.5l3 1.8 3-1.9zM2.5 14.2l3 1.8v6.1l5.2 3.1v3.5l-8.2-4.8v-9.7zm26.9 0v9.7l-8.3 4.8v-3.5l5.2-3.1V16l3.1-1.8zm-8.3-4.8 3.1 1.8v3.5L19 17.8V24l-3 1.8-3-1.8v-6.2l-5.4-3.1v-3.5l3.1-1.8 5.2 3.1 5.2-3.1zM7.7 17.3l3 1.8v3.5l-3-1.8v-3.5zm16.5 0v3.5l-3 1.8v-3.5l3-1.8zM5.5 6.3l3.1 1.8-3.1 1.8v3.5l-3-1.8V8.1l3-1.8zm20.9 0 3.1 1.8v3.5l-3.1 1.8V9.9l-3-1.8 3-1.8zM16 6.3l3 1.8-3 1.8-3-1.8 3-1.8zm0-6.1L24.2 5l-3 1.8L16 3.7l-5.3 3.1L7.8 5 16 .2z"
      fill="#f3ba2f"
    />
  </svg>
);

export default BSCLogo;
