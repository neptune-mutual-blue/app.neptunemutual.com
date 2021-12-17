import { classNames } from "@/utils/classnames";

export const Input = ({ children, placeholder, value, onChange }) => {
  return (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <input
        className="appearance-none block bg-white-bg text-dimmed-fg text-h4 border border-ash-border rounded-lg py-3 px-4 pr-0 h-18 w-lgInput leading-tight focus:outline-none focus:bg-white placeholder:text-dimmed-fg"
        id="grid-first-name"
        type="text"
        value={value}
        onChange={(e) => onChange(e)}
        placeholder={placeholder}
      ></input>
    </div>
  );
};
