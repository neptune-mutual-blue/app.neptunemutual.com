import { useState, useEffect } from "react";
import { RegularButton } from "@/common/Button/RegularButton";
import { TokenAmountInput } from "@/common/TokenAmountInput/TokenAmountInput";
import { useBlockHeight } from "@/src/hooks/useBlockHeight";
import { useStakingPoolWithdraw } from "@/src/hooks/useStakingPoolWithdraw";
import {
  convertFromUnits,
  convertToUnits,
  isGreater,
  isValidNumber,
} from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";

export const UnStakeForm = ({
  info,
  stakingTokenSymbol,
  stakedAmount,
  refetchInfo,
  poolKey,
  setModalDisabled,
}) => {
  const blockHeight = useBlockHeight();

  const [inputValue, setInputValue] = useState();
  const router = useRouter();

  const { withdrawing, handleWithdraw } = useStakingPoolWithdraw({
    value: inputValue,
    tokenAddress: info.stakingToken,
    tokenSymbol: stakingTokenSymbol,
    poolKey,
    refetchInfo,
  });

  useEffect(() => {
    return () => {
      setInputValue("");
    };
  }, []);

  useEffect(() => {
    setModalDisabled((val) => ({ ...val, w: withdrawing }));
  }, [setModalDisabled, withdrawing]);

  const canWithdraw = isGreater(blockHeight, info.canWithdrawFromBlockHeight);
  const stakingTokenAddress = info.stakingToken;
  const isError =
    inputValue &&
    (!isValidNumber(inputValue) ||
      isGreater(convertToUnits(inputValue || "0"), stakedAmount));

  const handleChooseMax = () => {
    setInputValue(convertFromUnits(stakedAmount).toString());
  };

  const handleChange = (val) => {
    if (typeof val === "string") {
      setInputValue(val);
    }
  };

  return (
    <div className="px-12 mt-6">
      <TokenAmountInput
        inputId={"withdraw-amount"}
        inputValue={inputValue}
        handleChooseMax={handleChooseMax}
        labelText={t`Amount you wish to withdraw`}
        onChange={handleChange}
        tokenSymbol={stakingTokenSymbol}
        tokenAddress={stakingTokenAddress}
        disabled={withdrawing}
      >
        <p>
          <Trans>Staked:</Trans>{" "}
          {
            formatCurrency(
              convertFromUnits(stakedAmount),
              router.locale,
              stakingTokenSymbol,
              true
            ).long
          }
        </p>
        {!canWithdraw && (
          <p className="flex items-center text-FA5C2F">
            <Trans>Could not withdraw during lockup period</Trans>
          </p>
        )}
      </TokenAmountInput>

      <RegularButton
        disabled={isError || withdrawing || !canWithdraw}
        className="w-full p-6 mt-8 font-semibold uppercase text-h6"
        onClick={handleWithdraw}
      >
        {withdrawing ? t`withdrawing...` : t`Unstake`}
      </RegularButton>
    </div>
  );
};
