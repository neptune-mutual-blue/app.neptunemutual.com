import { Alert } from "@/components/UI/atoms/alert";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Checkbox } from "@/components/UI/atoms/checkbox";
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
          {children}
        </Checkbox>
        <br />
        <div className="mt-16">
          <h2 className="font-sora font-bold text-h2 mb-6">Active Reporting</h2>

          <p className="text-h4 text-8F949C mb-10">
            There are no known incidents related to Clearpool Cover.
          </p>
          <Alert>
            If you just came to know about a recent incident of Uniswap
            Exchange, carefully read the cover rules above. You can earn 20% of
            the minority fees if you are the first person to report this
            incident.
          </Alert>
        </div>
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
