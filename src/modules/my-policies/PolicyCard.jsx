import { Divider } from "@/common/Divider/Divider";
import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { PolicyCardFooter } from "@/src/modules/my-policies/PolicyCardFooter";
import { useValidReport } from "@/src/hooks/useValidReport";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import DateLib from "@/lib/date/DateLib";
import { isGreater } from "@/utils/bn";
import { ReportStatus } from "@/src/config/constants";
import { CardStatusBadge } from "@/common/CardStatusBadge";
import { useFetchCoverStats } from "@/src/hooks/useFetchCoverStats";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import React from "react";
import { CoverAvatar } from "@/common/CoverAvatar";
import { InfoTooltip } from "@/common/Cover/InfoTooltip";
import { isValidProduct } from "@/src/helpers/cover";

export const PolicyCard = ({ policyInfo }) => {
  const { cxToken } = policyInfo;

  const coverInfo = useCoverOrProductData({
    coverKey: policyInfo.coverKey,
    productKey: policyInfo.productKey,
  });

  const { info: coverStats } = useFetchCoverStats({
    coverKey: policyInfo.coverKey,
    productKey: policyInfo.productKey,
  });

  const { productStatus } = coverStats;

  const validityStartsAt = cxToken.creationDate || "0";
  const validityEndsAt = cxToken.expiryDate || "0";

  const {
    data: { report },
  } = useValidReport({
    start: validityStartsAt,
    end: validityEndsAt,
    coverKey: policyInfo.coverKey,
    productKey: policyInfo.productKey,
  });

  const { balance } = useERC20Balance(cxToken.id);

  if (!coverInfo) {
    return <CardSkeleton numberOfCards={1} />;
  }

  const { infoObj } = coverInfo;
  const { coverName, productName } = infoObj;

  const isDiversified = isValidProduct(policyInfo.productKey);
  const policyCoverName = isDiversified ? productName : coverName;

  const now = DateLib.unix();
  const isPolicyExpired = isGreater(now, validityEndsAt);

  let status = null;
  let showStatus = true;

  // If policy expired, show the last reporting status between `validityStartsAt` and `validityEndsAt`
  // else when policy is currently valid, show the current status of the cover
  // (no need to display anything if the status is normal)
  if (isPolicyExpired) {
    status = ReportStatus[report?.status];
  } else {
    status = productStatus;

    const isClaimable = report ? report.status == "Claimable" : false;
    const isClaimStarted = report && isGreater(now, report.claimBeginsFrom);
    const isClaimExpired = report && isGreater(now, report.claimExpiresAt);

    // If status is "Claimable" then show status only during claim period
    showStatus = isClaimable ? isClaimStarted && !isClaimExpired : true;
  }

  return (
    <div
      className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9"
      data-testid="policy-card"
    >
      <OutlinedCard className="p-6 bg-white" type="normal">
        <div>
          <div className="flex justify-between">
            <CoverAvatar coverInfo={coverInfo} isDiversified={isDiversified} />
            <div data-testid="policy-card-status">
              <InfoTooltip
                disabled={coverInfo.products?.length === 0}
                infoComponent={
                  <div>
                    <p>
                      Leverage Ration: <b>{infoObj?.leverage}x</b>
                    </p>
                    <p>Determines available capital to underwrite</p>
                  </div>
                }
              >
                <div>
                  <CardStatusBadge status={showStatus ? status : null} />
                </div>
              </InfoTooltip>
            </div>
          </div>
          <h4
            className="mt-4 font-semibold uppercase text-h4 font-sora"
            data-testid="policy-card-title"
          >
            {policyCoverName}
          </h4>
        </div>
        {/* Divider */}
        <Divider />
        <PolicyCardFooter
          coverKey={policyInfo.coverKey}
          productKey={policyInfo.productKey}
          isDiversified={isDiversified}
          cxToken={policyInfo.cxToken}
          report={report}
          tokenBalance={balance}
          validityEndsAt={validityEndsAt}
        />
      </OutlinedCard>
    </div>
  );
};
