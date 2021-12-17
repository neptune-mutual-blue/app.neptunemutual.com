import { classNames } from "@/utils/classnames";

export const Radio = ({ children, text, onChange }) => {
  return (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 flex items-center">
      <input
        className="mr-2"
        type="radio"
        name="cover_month"
        value={text}
        onChange={(e) => onChange(e)}
      />
      <label className="uppercase text-sm">{text}</label>
    </div>
  );
};
