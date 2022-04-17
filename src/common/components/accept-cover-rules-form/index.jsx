import { RegularButton } from "@/src/common/components/button/regular";
import { Checkbox } from "@/src/common/components/checkbox";
import { classNames } from "@/utils/classnames";
import { useState } from "react";

export const AcceptReportRulesForm = ({ onAccept, children }) => {
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
        {children}
        <RegularButton
          disabled={!checked}
          className={classNames(
            !checked && "opacity-30 cursor-not-allowed",
            "text-h6 font-bold py-6 px-12 mt-8"
          )}
          type="submit"
        >
          REPORT AN INCIDENT
        </RegularButton>
      </form>
    </>
  );
};
