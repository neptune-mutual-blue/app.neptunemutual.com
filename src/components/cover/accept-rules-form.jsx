import { Checkbox } from "@/components/form/checkbox";
import { classNames } from "@/utils/classnames";
import { useState } from "react";

export const AcceptRulesForm = ({ onAccept }) => {
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
          I have read, understood, and agree to the terms of cover rules
        </Checkbox>
        <br />
        <button
          type="submit"
          disabled={!checked}
          className={classNames(
            !checked && "opacity-30 cursor-not-allowed",
            "bg-primary text-white-fg py-3 px-4 mt-8 rounded-xl"
          )}
        >
          Next&nbsp;&#x27F6;
        </button>
      </form>
    </>
  );
};
