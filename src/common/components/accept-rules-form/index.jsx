import { Checkbox } from "@/src/common/components/checkbox";
import { classNames } from "@/utils/classnames";
import { useState } from "react";

export const AcceptRulesForm = ({ onAccept, children }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (ev) => {
    setChecked(ev.target.checked);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();

    if (checked) {
      onAccept();
    }
  };

  return (
    <>
      {/* Accept Rules Form */}
      <form onSubmit={handleSubmit}>
        <Checkbox
          id="checkid"
          name="checkinputname"
          checked={checked}
          onChange={handleChange}
        >
          {children}
        </Checkbox>
        <br />
        <button
          type="submit"
          disabled={!checked}
          className={classNames(
            !checked && "opacity-30 cursor-not-allowed",
            "bg-4e7dd9 text-EEEEEE py-3 px-4 mt-8 rounded-big w-full sm:w-auto"
          )}
        >
          Next&nbsp;&#x27F6;
        </button>
      </form>
    </>
  );
};
