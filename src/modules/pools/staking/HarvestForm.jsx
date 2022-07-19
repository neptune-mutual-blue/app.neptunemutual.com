import { useEffect } from "react";
import { RegularButton } from "@/common/Button/RegularButton";
import AddCircleIcon from "@/icons/AddCircleIcon";
import { useRegisterToken } from "@/src/hooks/useRegisterToken";
import { useStakingPoolWithdrawRewards } from "@/src/hooks/useStakingPoolWithdraw";
import { Trans, t } from "@lingui/macro";
import { TokenAmountSpan } from "@/common/TokenAmountSpan";

export const HarvestForm = ({
  info,
  stakingTokenSymbol,
  stakedAmount,
  rewardAmount,
  rewardTokenAddress,
  rewardTokenSymbol,
  poolKey,
  refetchInfo,
  setModalDisabled,
  onHarvestSuccess = () => {},
}) => {
  const { handleWithdrawRewards, withdrawingRewards } =
    useStakingPoolWithdrawRewards({
      poolKey,
      refetchInfo,
    });
  const { register } = useRegisterToken();

  const rewardTokenDecimals = info.rewardTokenDecimals;
  const stakingTokenDecimals = info.stakingTokenDecimals;

  useEffect(() => {
    setModalDisabled((val) => ({ ...val, wr: withdrawingRewards }));
  }, [setModalDisabled, withdrawingRewards]);

  return (
    <div className="px-12">
      <div className="flex justify-between px-1 mt-6 mb-3 font-semibold text-md">
        <span className="capitalize">
          <Trans>Your Stake</Trans>
        </span>
        <span className="text-right">
          <Trans>You Earned</Trans>
        </span>
      </div>
      <div className="flex justify-between px-1 text-lg">
        <TokenAmountSpan
          amountInUnits={stakedAmount}
          symbol={stakingTokenSymbol}
          decimals={stakingTokenDecimals}
          className="uppercase text-7398C0"
        />
        <span className="inline-flex items-center text-right uppercase text-7398C0">
          <TokenAmountSpan
            amountInUnits={rewardAmount}
            symbol={rewardTokenSymbol}
            decimals={rewardTokenDecimals}
          />
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
        onClick={() => {
          handleWithdrawRewards(() => {
            onHarvestSuccess();
            refetchInfo();
          });
        }}
      >
        {withdrawingRewards ? t`Collecting...` : t`Collect`}
      </RegularButton>
    </div>
  );
};
