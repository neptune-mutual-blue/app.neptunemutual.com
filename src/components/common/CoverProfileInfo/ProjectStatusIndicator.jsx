import { classNames } from "@/utils/classnames";

export const ProjectStatusIndicator = ({ variant }) => {
  return (
    <div
      className={classNames(
        "ml-4 rounded-full w-4 h-4",
        variant === "success" && "bg-21AD8C",
        variant === "error" && "bg-FA5C2F"
      )}
    ></div>
  );
};
