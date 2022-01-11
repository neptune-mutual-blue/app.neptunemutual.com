import * as React from "react";

const InfoIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={12} cy={12} r={11} fill="#FA5C2F" />
    <path
      d="M13 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-3 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.25h.75a.75.75 0 1 1 0 1.5h-3a.75.75 0 1 1 0-1.5h.75V12h-.75a.75.75 0 0 1-.75-.75Z"
      fill="#fff"
    />
  </svg>
);

export default InfoIcon;
