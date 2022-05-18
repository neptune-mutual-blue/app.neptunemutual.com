import { useEffect } from "react";
import { useRouter } from "next/router";

import { Divider } from "@/common/Divider/Divider";
import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { CardStatusBadge } from "@/common/CardStatusBadge";
import { Trans } from "@lingui/macro";
import { useSortableStats } from "@/src/context/SortableStatsContext";
import { useCovers } from "@/src/context/Covers";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";

export const ResolvedReportingCard = ({ id, coverKey, status, resolvedOn }) => {
  const { setStatsByKey } = useSortableStats();
  const { getInfoByKey } = useCovers();
  const coverInfo = getInfoByKey(coverKey);
  const imgSrc = getCoverImgSrc({ key: coverKey });
  const router = useRouter();

  // Used for sorting purpose only
  useEffect(() => {
    setStatsByKey(id, {
      resolvedOn,
    });
  }, [id, resolvedOn, setStatsByKey]);

  if (!coverInfo) {
    return <CardSkeleton numberOfCards={1} />;
  }

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
        <span
          className=""
          title={DateLib.toLongDateFormat(resolvedOn, router.locale)}
        >
          <Trans>Resolved On:</Trans>{" "}
          <span title={DateLib.toLongDateFormat(resolvedOn, router.locale)}>
            {fromNow(resolvedOn)}
          </span>
        </span>
      </div>
    </OutlinedCard>
  );
};
