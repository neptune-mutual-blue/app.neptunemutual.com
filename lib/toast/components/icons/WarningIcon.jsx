import * as React from "react";

const WarningIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={12} cy={12} r={11} fill="#FA5C2F" />
    <path
      d="M7 12a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 7 12Z"
      fill="#fff"
    />
  </svg>
);

export default WarningIcon;
