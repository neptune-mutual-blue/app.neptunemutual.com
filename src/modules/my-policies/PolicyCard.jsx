import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { Divider } from "@/common/Divider/Divider";
import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { PolicyCardFooter } from "@/src/modules/my-policies/PolicyCardFooter";
import { useValidReport } from "@/src/hooks/useValidReport";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { useCoverStatusInfo } from "@/src/hooks/useCoverStatusInfo";
import DateLib from "@/lib/date/DateLib";
import { isGreater } from "@/utils/bn";
import { ReportStatus } from "@/src/config/constants";
import { CardStatusBadge } from "@/common/CardStatusBadge";

export const PolicyCard = ({ policyInfo }) => {
  const { cover, cxToken } = policyInfo;

  const coverKey = cover.id;
  const { coverInfo } = useCoverInfo(coverKey);
  const statusInfo = useCoverStatusInfo(coverKey);

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

  const now = DateLib.unix();
  const imgSrc = getCoverImgSrc({ key: coverKey });
  const isPolicyExpired = isGreater(now, validityEndsAt);

  let status = null;

  // If policy expired, show the last reporting status between `validityStartsAt` and `validityEndsAt`
  // else when policy is currently valid, show the current status of the cover
  // (no need to display anything if the status is normal)
  if (isPolicyExpired) {
    status = ReportStatus[report?.status];
  } else {
    status = statusInfo.status;
  }

  return (
    <div className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
      <OutlinedCard className="p-6 bg-white" type="normal">
        <div>
          <div className="flex justify-between">
            <div className="p-3 rounded-full w-18 h-18 bg-DEEAF6">
              <img
                src={imgSrc}
                alt={coverInfo.projectName}
                className="inline-block max-w-full"
              />
            </div>

            <div>
              <CardStatusBadge status={status} />
            </div>
          </div>
          <h4 className="mt-4 font-semibold uppercase text-h4 font-sora">
            {coverInfo.projectName}
          </h4>
        </div>

        {/* Divider */}
        <Divider />

        <PolicyCardFooter
          coverKey={coverKey}
          report={report}
          tokenBalance={balance}
          validityEndsAt={validityEndsAt}
        />
      </OutlinedCard>
    </div>
  );
};
