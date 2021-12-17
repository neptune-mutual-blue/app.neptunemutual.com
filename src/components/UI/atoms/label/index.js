import { classNames } from "@/utils/classnames";

export const Label = ({ labelText, className }) => {
  return (
    <label
      className={classNames(
        "block uppercase tracking-wide text-black text-h5 text-xs font-bold",
        className
      )}
      htmlFor="grid-first-name"
    >
      {labelText}
    </label>
  );
};
