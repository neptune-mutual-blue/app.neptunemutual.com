import { RegularButton } from "@/components/UI/atoms/button/regular";
import { useStakingPoolWithdrawRewards } from "@/src/hooks/useStakingPoolWithdraw";
import { convertFromUnits } from "@/utils/bn";
import { formatAmount } from "@/utils/formatter";

export const HarvestForm = ({
  poolKey,
  stakingTokenSymbol,
  stakedAmount,
  earnedAmount,
  earnedTokenSymbol,
}) => {
  const { handleWithdraw, withdrawing } = useStakingPoolWithdrawRewards({
    poolKey,
  });

  return (
    <div className="px-12">
      <div className="flex justify-between text-sm font-semibold px-1 mt-6">
        <span className="capitalize">Your Stake</span>
        <span className="text-right">You Earned</span>
      </div>
      <div className="flex justify-between text-sm px-1 pt-2">
        <span className="text-7398C0 uppercase">
          {formatAmount(convertFromUnits(stakedAmount).toString())}{" "}
          {stakingTokenSymbol}
        </span>
        <span className="text-right text-7398C0 uppercase">
          {formatAmount(convertFromUnits(earnedAmount).toString())}{" "}
          {earnedTokenSymbol}
        </span>
      </div>

      <RegularButton
        disabled={withdrawing}
        className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
        onClick={handleWithdraw}
      >
        {withdrawing ? "Collecting..." : "Collect"}
      </RegularButton>
    </div>
  );
};
