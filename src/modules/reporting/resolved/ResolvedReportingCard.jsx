import { Divider } from "@/common/Divider/Divider";
import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { CardStatusBadge } from "@/common/CardStatusBadge";
import { Trans } from "@lingui/macro";
import { useRouter } from "next/router";

export const ResolvedReportingCard = ({ coverKey, status, resolvedOn }) => {
  const { coverInfo } = useCoverInfo(coverKey);
  const imgSrc = getCoverImgSrc({ key: coverKey });
  const router = useRouter();

  return (
    <OutlinedCard className="p-6 bg-white" type="link">
      <div className="flex items-start justify-between">
        <div className="rounded-full w-18 h-18 bg-DEEAF6">
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

      {/* Divider */}
      <Divider />

      {/* Stats */}
      <div className="flex justify-between px-1 mb-4 text-sm">
        <span className="" title={DateLib.toLongDateFormat(resolvedOn, router.locale)}>
          <Trans>Resolved On:</Trans>{" "}
          <span title={DateLib.toLongDateFormat(resolvedOn, router.locale)}>
            {fromNow(resolvedOn)}
          </span>
        </span>
      </div>
    </OutlinedCard>
  );
};
