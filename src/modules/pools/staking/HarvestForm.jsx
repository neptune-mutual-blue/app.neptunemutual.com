import { useEffect } from "react";
import { RegularButton } from "@/common/Button/RegularButton";
import AddCircleIcon from "@/icons/AddCircleIcon";
import { useRegisterToken } from "@/src/hooks/useRegisterToken";
import { useStakingPoolWithdrawRewards } from "@/src/hooks/useStakingPoolWithdraw";
import { convertFromUnits } from "@/utils/bn";
import { Trans, t } from "@lingui/macro";
import { useNumberFormat } from "@/src/hooks/useNumberFormat";

export const HarvestForm = ({
  stakingTokenSymbol,
  stakedAmount,
  rewardAmount,
  rewardTokenAddress,
  rewardTokenSymbol,
  poolKey,
  refetchInfo,
  setModalDisabled,
}) => {
  const { handleWithdrawRewards, withdrawingRewards } =
    useStakingPoolWithdrawRewards({
      poolKey,
      refetchInfo,
    });
  const { register } = useRegisterToken();
  const { formatCurrency } = useNumberFormat();

  useEffect(() => {
    setModalDisabled((val) => ({ ...val, wr: withdrawingRewards }));
  }, [setModalDisabled, withdrawingRewards]);

  return (
    <div className="px-12">
      <div className="flex justify-between px-1 mt-6 text-sm font-semibold">
        <span className="capitalize">
          <Trans>Your Stake</Trans>
        </span>
        <span className="text-right">
          <Trans>You Earned</Trans>
        </span>
      </div>
      <div className="flex justify-between px-1 pt-2 text-sm">
        <span className="uppercase text-7398C0">
          {
            formatCurrency(
              convertFromUnits(stakedAmount),
              stakingTokenSymbol,
              true
            ).long
          }
        </span>
        <span className="inline-flex items-center text-right uppercase text-7398C0">
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
        className="w-full p-6 mt-8 font-semibold uppercase text-h6"
        onClick={handleWithdrawRewards}
      >
        {withdrawingRewards ? t`Collecting...` : t`Collect`}
      </RegularButton>
    </div>
  );
};
