import { Divider } from "@/common/Divider/Divider";
import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { getCoverImgSrc, isValidProduct } from "@/src/helpers/cover";
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

export const PolicyCard = ({ policyInfo }) => {
  const { cxToken, coverKey, productKey } = policyInfo;

  const coverInfo = useCoverOrProductData({ coverKey, productKey });
  const { status: currentStatus } = useFetchCoverStats({
    coverKey,
    productKey,
  });

  const validityStartsAt = cxToken.creationDate || "0";
  const validityEndsAt = cxToken.expiryDate || "0";
  const {
    data: { report },
  } = useValidReport({
    start: validityStartsAt,
    end: validityEndsAt,
    coverKey,
  });
  const { balance } = useERC20Balance(cxToken.id);

  const isDiversified = isValidProduct(productKey);

  if (!coverInfo) {
    return <CardSkeleton numberOfCards={1} />;
  }

  const now = DateLib.unix();
  const imgSrc = getCoverImgSrc({ key: coverKey });
  const isPolicyExpired = isGreater(now, validityEndsAt);

  let status = null;
  let showStatus = true;

  // If policy expired, show the last reporting status between `validityStartsAt` and `validityEndsAt`
  // else when policy is currently valid, show the current status of the cover
  // (no need to display anything if the status is normal)
  if (isPolicyExpired) {
    status = ReportStatus[report?.status];
  } else {
    status = currentStatus;

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
            <div className="p-3 rounded-full w-18 h-18 bg-DEEAF6">
              <img
                src={imgSrc}
                alt={coverInfo.projectName}
                className="inline-block max-w-full"
                data-testid="cover-img"
              />
            </div>

            <div data-testid="policy-card-status">
              {showStatus && <CardStatusBadge status={status} />}
            </div>
          </div>
          <h4
            className="mt-4 font-semibold uppercase text-h4 font-sora"
            data-testid="policy-card-title"
          >
            {coverInfo.projectName}
          </h4>
        </div>

        {/* Divider */}
        <Divider />

        <PolicyCardFooter
          coverKey={coverKey}
          cxToken={policyInfo.cxToken}
          report={report}
          tokenBalance={balance}
          validityEndsAt={validityEndsAt}
        />
      </OutlinedCard>
    </div>
  );
};
