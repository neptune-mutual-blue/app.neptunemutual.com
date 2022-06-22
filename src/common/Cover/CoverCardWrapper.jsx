import Link from "next/link";
import { utils } from "@neptunemutual/sdk";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import { CoverCard } from "@/common/Cover/CoverCard";

export const CoverCardWrapper = ({
  coverKey,
  productKey = utils.keyUtil.toBytes32(""),
  progressFgColor = undefined,
  progressBgColor = undefined,
}) => {
  const coverInfo = useCoverOrProductData({ coverKey, productKey });

  if (!coverInfo) {
    return <>loading...</>;
  }

  const cover_id = safeParseBytes32String(coverKey);

  const isDiversified = coverInfo?.supportsProducts;

  return (
    <Link
      href={
        isDiversified ? `/basket/${cover_id}` : `covers/${cover_id}/options`
      }
      key={coverKey}
    >
      <a
        className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9"
        data-testid="cover-link"
      >
        <CoverCard
          coverKey={coverKey}
          productKey={productKey}
          coverInfo={coverInfo}
          progressFgColor={progressFgColor}
          progressBgColor={progressBgColor}
        />
      </a>
    </Link>
  );
};
