import { classNames } from "@/utils/classnames";

export const Radio = ({ children, label, id, ...rest }) => {
  return (
    <div className="w-full mr-4 flex items-center">
      <input
        className="h-5 w-5 bg-white-fg border-ash-border mr-2"
        type="radio"
        id={id}
        {...rest}
      />
      <label className="uppercase text-sm" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};
