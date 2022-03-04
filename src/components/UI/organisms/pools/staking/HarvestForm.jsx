import { RegularButton } from "@/components/UI/atoms/button/regular";
import AddCircleIcon from "@/icons/AddCircleIcon";
import { useRegisterToken } from "@/src/hooks/useRegisterToken";
import { convertFromUnits } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";

export const HarvestForm = ({
  stakingTokenSymbol,
  stakedAmount,
  rewardAmount,
  rewardTokenAddress,
  rewardTokenSymbol,
  handleWithdrawRewards,
  withdrawingRewards,
}) => {
  const { register } = useRegisterToken();

  return (
    <div className="px-12">
      <div className="flex justify-between text-sm font-semibold px-1 mt-6">
        <span className="capitalize">Your Stake</span>
        <span className="text-right">You Earned</span>
      </div>
      <div className="flex justify-between text-sm px-1 pt-2">
        <span className="text-7398C0 uppercase">
          {
            formatCurrency(
              convertFromUnits(stakedAmount),
              stakingTokenSymbol,
              true
            ).long
          }
        </span>
        <span className="text-right text-7398C0 uppercase inline-flex items-center">
          {
            formatCurrency(
              convertFromUnits(rewardAmount),
              rewardTokenSymbol,
              true
            ).long
          }
          <button
            className="ml-1"
            onClick={() => register(rewardTokenAddress, rewardTokenSymbol)}
          >
            <span className="sr-only">Add to Metamask</span>
            <AddCircleIcon width={16} fill="currentColor" />
          </button>
        </span>
      </div>

      <RegularButton
        disabled={withdrawingRewards}
        className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
        onClick={handleWithdrawRewards}
      >
        {withdrawingRewards ? "Collecting..." : "Collect"}
      </RegularButton>
    </div>
  );
};
