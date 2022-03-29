import { DataLoadingIndicator } from "@/components/DataLoadingIndicator";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Label } from "@/components/UI/atoms/label";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";

import { useStakingPoolDeposit } from "@/src/hooks/useStakingPoolDeposit";

import { useState, useEffect } from "react";

import { convertFromUnits } from "@/utils/bn";
import { explainInterval } from "@/utils/formatter/interval";
import { formatCurrency } from "@/utils/formatter/currency";

export const StakeForm = ({
  refetchInfo,
  stakingTokenSymbol,
  poolKey,
  info,
  lockupPeriod,
  modalOpen,
}) => {
  const tokenAddress = info.stakingToken;
  const [inputValue, setInputValue] = useState();

  const {
    balance,
    loadingBalance,
    updateBalance,
    maxStakableAmount,
    isError,
    errorMsg,
    canDeposit,
    approving,
    loadingAllowance,
    updateAllowance,
    depositing,
    handleDeposit,
    handleApprove,
  } = useStakingPoolDeposit({
    refetchInfo,
    value: inputValue,
    tokenAddress,
    tokenSymbol: stakingTokenSymbol,
    poolKey,
    maximumStake: info.maximumStake,
  });

  useEffect(() => {
    if (modalOpen) {
      if (updateBalance) updateBalance();
      if (updateAllowance) updateAllowance();
      return;
    }

    // Clear on modal close
    setInputValue();
  }, [modalOpen, updateBalance, updateAllowance]);

  const handleChooseMax = () => {
    setInputValue(convertFromUnits(maxStakableAmount).toString());
  };

  const handleChange = (val) => {
    if (typeof val === "string") {
      setInputValue(val);
    }
  };

  const onDepositSuccess = () => {
    onClose();
  };

  let loadingMessage = "";
  if (loadingBalance) {
    loadingMessage = "Fetching balance...";
  } else if (loadingAllowance) {
    loadingMessage = "Fetching allowance...";
  }

  return (
    <>
      <div className="mt-6">
        <TokenAmountInput
          labelText={"Amount You Wish To Stake"}
          tokenBalance={balance}
          tokenSymbol={stakingTokenSymbol}
          tokenAddress={tokenAddress}
          handleChooseMax={handleChooseMax}
          inputValue={inputValue}
          id={"staked-amount"}
          disabled={approving || depositing}
          onChange={handleChange}
        >
          <p>
            Maximum Limit:{" "}
            <span
              title={`${
                formatCurrency(
                  convertFromUnits(info.maximumStake).toString(),
                  stakingTokenSymbol,
                  true
                ).long
              }`}
            >
              {
                formatCurrency(
                  convertFromUnits(info.maximumStake).toString(),
                  stakingTokenSymbol,
                  true
                ).short
              }
            </span>
          </p>
          {errorMsg && (
            <p className="flex items-center text-FA5C2F">{errorMsg}</p>
          )}
        </TokenAmountInput>
      </div>
      <div className="mt-8 modal-unlock">
        <Label className="mb-3" htmlFor="modal-unlock-on">
          Lockup Period
        </Label>
        <p id="modal-unlock-on" className="font-medium text-7398C0 text-h4">
          {explainInterval(lockupPeriod)}
        </p>
      </div>

      <div className="mt-4">
        <DataLoadingIndicator message={loadingMessage} />
        {!canDeposit ? (
          <RegularButton
            disabled={isError || approving || !inputValue || loadingMessage}
            className="w-full p-6 font-semibold uppercase text-h6"
            onClick={handleApprove}
          >
            {approving ? "Approving..." : <>Approve {stakingTokenSymbol}</>}
          </RegularButton>
        ) : (
          <RegularButton
            disabled={isError || depositing || loadingMessage}
            className="w-full p-6 font-semibold uppercase text-h6"
            onClick={() => handleDeposit(onDepositSuccess)}
          >
            {depositing ? "Staking..." : "Stake"}
          </RegularButton>
        )}
      </div>
    </>
  );
};
