import { convertFromUnits, toBN } from "@/utils/bn";
import { getApproximateBlocksPerYear } from "./block";

export const getApr = (chainId, info) => {
  const stakingTokenPrice = toBN(info.stakingTokenPrice);
  const rewardPerBlock = toBN(info.rewardPerBlock);
  const rewardTokenPrice = toBN(info.rewardTokenPrice);
  const blocksPerYear = toBN(getApproximateBlocksPerYear(chainId).toString());
  const rewardPerYear = rewardPerBlock.multipliedBy(blocksPerYear);

  console.log({
    stakingTokenPrice: stakingTokenPrice.toFixed(2),
    rewardPerBlock: rewardPerBlock.toFixed(2),
    rewardTokenPrice: rewardTokenPrice.toFixed(2),
    blocksPerYear: blocksPerYear.toFixed(2),
    rewardPerYear: rewardPerYear.toFixed(2),
  });
  if (stakingTokenPrice.isEqualTo("0")) {
    return "0";
  }

  const result = rewardPerYear
    .multipliedBy(rewardTokenPrice)
    .dividedBy(stakingTokenPrice)
    .toString();

  return convertFromUnits(result).toString();
};