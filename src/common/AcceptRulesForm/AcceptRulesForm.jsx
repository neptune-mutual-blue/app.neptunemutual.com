import { Checkbox } from "@/common/Checkbox/Checkbox";
import { classNames } from "@/utils/classnames";
import { useState } from "react";
import { Trans } from "@lingui/macro";
import { Alert } from "@/common/Alert/Alert";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCoverStatsContext } from "@/common/Cover/CoverStatsContext";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";
import LeftArrow from "@/icons/LeftArrow";

export const AcceptRulesForm = ({ onAccept, children, coverKey }) => {
  const router = useRouter();
  const coverPurchasePage = router.pathname.includes("purchase");
  const [checked, setChecked] = useState(false);
  const { activeIncidentDate, status } = useCoverStatsContext();

  const handleChange = (ev) => {
    setChecked(ev.target.checked);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();

    if (checked) {
      onAccept();
    }
  };

  if (status && status !== "Normal") {
    return (
      <Alert>
        <Trans>
          Cannot {coverPurchasePage ? "purchase policy" : "add liquidity"},
          since the cover status is
        </Trans>{" "}
        <Link
          href={`/reporting/${safeParseBytes32String(
            coverKey
          )}/${activeIncidentDate}/details`}
        >
          <a className="font-medium underline hover:no-underline">{status}</a>
        </Link>
      </Alert>
    );
  }

  return (
    <>
      {/* Accept Rules Form */}
      <form onSubmit={handleSubmit} className="mt-20">
        <Checkbox
          id="checkid"
          name="checkinputname"
          checked={checked}
          onChange={handleChange}
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
    </>
  );
};
