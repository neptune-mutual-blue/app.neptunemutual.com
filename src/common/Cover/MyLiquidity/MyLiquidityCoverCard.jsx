import { Divider } from "@/common/Divider/Divider";
import { ProgressBar } from "@/common/ProgressBar/ProgressBar";
import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { convertFromUnits, sumOf, toBN } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { formatPercent } from "@/utils/formatter/percent";
import { Trans } from "@lingui/macro";
import { useRouter } from "next/router";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";

export const MyLiquidityCoverCard = ({
  coverKey,
  totalPODs,
  tokenSymbol = "POD",
  tokenDecimal,
}) => {
  const { info } = useMyLiquidityInfo({ coverKey });
  const router = useRouter();

  const productKey = safeFormatBytes32String("");
  const coverInfo = useCoverOrProductData({ coverKey, productKey });

  if (!coverInfo) {
    return <CardSkeleton numberOfCards={1} />;
  }

  const imgSrc = getCoverImgSrc({ key: coverKey });

  const reassurancePercent = toBN(info.totalReassurance)
    .dividedBy(sumOf(info.totalLiquidity, info.totalReassurance))
    .decimalPlaces(2);

  return (
    <OutlinedCard className="p-6 bg-white" type="link">
      <div className="flex justify-between">
        <div>
          <div className="p-3 rounded-full w-18 h-18 bg-DEEAF6">
            <img
              src={imgSrc}
              alt={coverInfo.projectName}
              className="inline-block max-w-full"
            />
          </div>
          <h4
            className="mt-4 font-semibold uppercase text-h4 font-sora"
            data-testid="title"
          >
            {coverInfo.projectName}
          </h4>
        </div>
        <div>{/* <Badge className="text-21AD8C">APR: {"25"}%</Badge> */}</div>
      </div>

      {/* Divider */}
      <Divider />

      {/* Stats */}
      <div className="flex justify-between px-1 text-sm">
        <span className="uppercase">
          <Trans>Reassurance Ratio</Trans>
        </span>
        <span className="font-semibold text-right" data-testid="assurance">
          {formatPercent(reassurancePercent, router.locale)}
        </span>
      </div>
      <div className="mt-2 mb-4">
        <ProgressBar value={reassurancePercent.toNumber()} />
      </div>
      <div
        className="flex justify-between px-1 text-sm"
        title={
          formatCurrency(
            convertFromUnits(totalPODs || "0", tokenDecimal),
            router.locale,
            tokenSymbol,
            true
          ).long
        }
      >
        <span data-testid="liquidity">
          <Trans>My Liquidity:</Trans>{" "}
          {
            formatCurrency(
              convertFromUnits(totalPODs || "0", tokenDecimal),
              router.locale,
              tokenSymbol,
              true
            ).short
          }
        </span>
      </div>
    </OutlinedCard>
  );
};
