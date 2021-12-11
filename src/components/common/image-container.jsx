import { classNames } from "src/utils/classnames";

/**
 * Props
 * @param {Object} props
 * @param {"normal"|"md"} props.size
 * @param {string} props.className
 * @param {*} props.children
 */
export const ImageContainer = ({ size = "normal", className, ...props }) => {
  return (
    <div
      className={classNames(
        size === "normal" && "w-18 h-18",
        size === "md" && "w-24 h-24",
        "rounded-full",
        className
      )}
      {...props}
    ></div>
  );
};
