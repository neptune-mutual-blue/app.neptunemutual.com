import { Checkbox } from "@/common/Checkbox/Checkbox";
import { classNames } from "@/utils/classnames";
import { useState } from "react";
import { Trans } from "@lingui/macro";
import { Alert } from "@/common/Alert/Alert";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCoverStatsContext } from "@/common/Cover/CoverStatsContext";
import LeftArrow from "@/icons/LeftArrow";
import { Routes } from "@/src/config/routes";
import { ZERO_BYTES32 } from "@neptunemutual/sdk/dist/config/constants";

export const AcceptRulesForm = ({
  onAccept,
  children,
  coverKey,
  productKey = ZERO_BYTES32,
}) => {
  const router = useRouter();
  const coverPurchasePage = router.pathname.includes("purchase");
  const [checked, setChecked] = useState(false);
  const { activeIncidentDate, productStatus } = useCoverStatsContext();

  const handleChange = (ev) => {
    setChecked(ev.target.checked);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();

    if (checked) {
      onAccept();
    }
  };

  if (productStatus && productStatus !== "Normal") {
    return (
      <Alert>
        <Trans>
          Cannot {coverPurchasePage ? "purchase policy" : "add liquidity"},
          since the cover status is
        </Trans>{" "}
        <Link
          href={Routes.ViewReport(coverKey, productKey, activeIncidentDate)}
        >
          <a className="font-medium underline hover:no-underline">
            {productStatus}
          </a>
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
            "flex items-center bg-4e7dd9 text-EEEEEE py-3 px-4 mt-8 rounded-big w-full sm:w-auto justify-center"
          )}
        >
          <Trans>Next</Trans>

          <LeftArrow variant={"right"} />
        </button>
      </form>
    </>
  );
};
