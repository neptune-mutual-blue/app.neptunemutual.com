import { Checkbox } from "@/common/Checkbox/Checkbox";
import { classNames } from "@/utils/classnames";
import { Trans } from "@lingui/macro";
import LeftArrow from "@/icons/LeftArrow";
import { useState } from "react";

export default function AcceptTerms({ children, onAccept }) {
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();

    if (checked) {
      onAccept();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-20">
      <Checkbox
        name="checkinputname"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
        data-testid="accept-rules-check-box"
      >
        {children}
      </Checkbox>
      <br />
      <button
        data-testid="accept-rules-next-button"
        type="submit"
        disabled={!checked}
        className={classNames(
          !checked && "flex opacity-30 cursor-not-allowed",
          "flex items-center bg-4e7dd9 text-EEEEEE py-3 pl-6 pr-5 mt-8 rounded-big w-full sm:w-auto"
        )}
      >
        <Trans>Next</Trans>

        <LeftArrow variant={"right"} />
      </button>
    </form>
  );
}
