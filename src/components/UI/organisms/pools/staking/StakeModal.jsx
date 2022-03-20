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
    maxStakableAmount,
    isError,
    errorMsg,
    canDeposit,
    approving,
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} disabled={approving || depositing}>
      <div className="relative inline-block w-full max-w-xl p-12 overflow-y-auto text-left align-middle max-h-90vh bg-f1f3f6 rounded-3xl">
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

        {!canDeposit ? (
          <RegularButton
            disabled={isError || approving || !inputValue}
            className="w-full p-6 mt-8 font-semibold uppercase text-h6"
            onClick={handleApprove}
          >
            {approving ? "Approving..." : <>Approve {stakingTokenSymbol}</>}
          </RegularButton>
        ) : (
          <RegularButton
            disabled={isError || depositing}
            className="w-full p-6 mt-8 font-semibold uppercase text-h6"
            onClick={() => handleDeposit(onDepositSuccess)}
          >
            {depositing ? "Staking..." : "Stake"}
          </RegularButton>
        )}
      </div>
    </Modal>
  );
};
