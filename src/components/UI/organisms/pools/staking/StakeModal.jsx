import * as Dialog from "@radix-ui/react-dialog";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Label } from "@/components/UI/atoms/label";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { useEffect, useState } from "react";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { convertFromUnits } from "@/utils/bn";
import { useStakingPoolDeposit } from "@/src/hooks/useStakingPoolDeposit";
import { explainInterval } from "@/utils/formatter/interval";
import { formatCurrency } from "@/utils/formatter/currency";
import { ModalWrapper } from "@/components/UI/molecules/modal/modal-wrapper";
import { DataLoadingIndicator } from "@/components/DataLoadingIndicator";

export const StakeModal = ({
  info,
  refetchInfo,
  poolKey,
  modalTitle,
  isOpen,
  onClose,
  stakingTokenSymbol,
  lockupPeriod,
}) => {
  const tokenAddress = info.stakingToken;
  const [inputValue, setInputValue] = useState();

  const {
    balance,
    loadingBalance,
    maxStakableAmount,
    isError,
    errorMsg,
    canDeposit,
    approving,
    loadingAllowance,
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
    if (isOpen) return;

    // Clear on modal close
    setInputValue();
  }, [isOpen]);

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
    <Modal isOpen={isOpen} onClose={onClose} disabled={approving || depositing}>
      <ModalWrapper>
        <Dialog.Title className="flex items-center font-bold font-sora text-h2">
          {modalTitle}
        </Dialog.Title>

        <ModalCloseButton
          disabled={approving || depositing}
          onClick={onClose}
        ></ModalCloseButton>

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
      </ModalWrapper>
    </Modal>
  );
};
