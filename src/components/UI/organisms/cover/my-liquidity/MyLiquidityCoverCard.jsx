import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { Divider } from "@/components/UI/atoms/divider";
import { ProgressBar } from "@/components/UI/atoms/progress-bar";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { convertFromUnits, sumOf } from "@/utils/bn";
import BigNumber from "bignumber.js";
import { formatCurrency } from "@/utils/formatter/currency";
import { formatPercent } from "@/utils/formatter/percent";

export const MyLiquidityCoverCard = ({ coverKey, totalPODs }) => {
  const { coverInfo } = useCoverInfo(coverKey);
  const { info } = useMyLiquidityInfo({ coverKey });

  if (!coverInfo) {
    return null;
  }

  const imgSrc = getCoverImgSrc({ key: coverKey });

  console.log(
    "Total Reassurance %s. Balance: %s. Extended Balance: %s",
    info.totalReassurance,
    info.balance,
    info.extendedBalance
  );

  const reassurancePercent = BigNumber(info.totalReassurance)
    .dividedBy(sumOf(info.balance, info.extendedBalance, info.totalReassurance))
    .decimalPlaces(2);

  return (
    <OutlinedCard className="bg-white p-6" type="link">
      <div className="flex justify-between">
        <div>
          <div className="w-18 h-18 bg-DEEAF6 p-3 rounded-full">
            <img
              src={imgSrc}
              alt={coverInfo.projectName}
              className="inline-block max-w-full"
            />
          </div>
          <h4 className="text-h4 font-sora font-semibold uppercase mt-4">
            {coverInfo.projectName}
          </h4>
        </div>
        <div>{/* <Badge className="text-21AD8C">APR: {"25"}%</Badge> */}</div>
      </div>

      {/* Divider */}
      <Divider />

      {/* Stats */}
      <div className="flex justify-between text-sm px-1">
        <span className="uppercase">Reassurance Ratio</span>
        <span className="font-semibold text-right">
          {formatPercent(reassurancePercent)}
        </span>
      </div>
      <div className="mt-2 mb-4">
        <ProgressBar value={reassurancePercent.toNumber()} />
      </div>
      <div
        className="flex justify-between text-sm px-1"
        title={
          formatCurrency(convertFromUnits(totalPODs || "0"), "POD", true).long
        }
      >
        <span className="">
          My Liquidity:{" "}
          {
            formatCurrency(convertFromUnits(totalPODs || "0"), "POD", true)
              .short
          }
        </span>
      </div>
    </OutlinedCard>
  );
};
