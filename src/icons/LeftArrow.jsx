import { classNames } from "@/utils/classnames";

const LeftArrow = (props) => (
  <svg
    width={24}
    height={8}
    xmlns="http://www.w3.org/2000/svg"
    className={classNames(
      props.variant === "right" ? "ml-2 rotate-180" : "mr-2"
    )}
  >
    <path
      d="M.646 3.646a.5.5 0 0 0 0 .708l3.182 3.182a.5.5 0 1 0 .708-.708L1.707 4l2.829-2.828a.5.5 0 1 0-.708-.708L.646 3.646ZM1 4.5h23v-1H1v1Z"
      fill="currentColor"
    />
  </svg>
);

export default LeftArrow;
