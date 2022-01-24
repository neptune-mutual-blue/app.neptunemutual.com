import { RegularButton } from "@/components/UI/atoms/button/regular";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { useStakingPoolWithdraw } from "@/src/hooks/useStakingPoolWithdraw";
import {
  convertFromUnits,
  convertToUnits,
  isGreater,
  isValidNumber,
} from "@/utils/bn";
import { unixToDate } from "@/utils/date";
import { formatAmount } from "@/utils/formatter";
import dayjs from "dayjs";
import { useState } from "react";

export const WithdrawForm = ({
  info,
  poolKey,
  stakingTokenSymbol,
  stakedAmount,
}) => {
  const [inputValue, setInputValue] = useState();

  const { withdrawing, handleWithdraw } = useStakingPoolWithdraw({
    value: inputValue,
    tokenAddress: info.stakingToken,
    tokenSymbol: stakingTokenSymbol,
    poolKey,
  });

  console.log(
    unixToDate(info.canWithdrawFrom, "MMMM DD, YYYY hh:mm:ss A") + " UTC"
  );
  const now = dayjs().unix();
  const canWithdraw = isGreater(now, info.canWithdrawFrom);
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
        labelText={"Amount you wish to withdraw"}
        onChange={handleChange}
        tokenSymbol={stakingTokenSymbol}
        tokenAddress={stakingTokenAddress}
      >
        Staked: {formatAmount(convertFromUnits(stakedAmount).toString())}{" "}
        {stakingTokenSymbol}
      </TokenAmountInput>

      <RegularButton
        disabled={isError || withdrawing || !canWithdraw}
        className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
        onClick={handleWithdraw}
      >
        {withdrawing ? "Unstaking..." : "Unstake"}
      </RegularButton>
    </div>
  );
};
