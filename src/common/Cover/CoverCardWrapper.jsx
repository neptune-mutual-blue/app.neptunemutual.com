import Link from "next/link";
import { utils } from "@neptunemutual/sdk";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import { CoverCard } from "@/common/Cover/CoverCard";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";

export const CoverCardWrapper = ({
  coverKey,
  progressFgColor = undefined,
  progressBgColor = undefined,
}) => {
  const productKey = utils.keyUtil.toBytes32("");
  const coverInfo = useCoverOrProductData({ coverKey, productKey });

  if (!coverInfo) {
    return <CardSkeleton numberOfCards={1} />;
  }

  const cover_id = safeParseBytes32String(coverKey);

  const isDiversified = coverInfo?.supportsProducts;

  return (
    <Link
      href={isDiversified ? `/diversified/${cover_id}` : `covers/${cover_id}`}
      key={coverKey}
    >
      <a
        className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9"
        data-testid="cover-link"
      >
        <CoverCard
          coverKey={coverKey}
          coverInfo={coverInfo}
          progressFgColor={progressFgColor}
          progressBgColor={progressBgColor}
        />
      </a>
    </Link>
  );
};
