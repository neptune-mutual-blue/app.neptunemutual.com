import { Dialog } from "@headlessui/react";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Label } from "@/components/UI/atoms/label";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { useState } from "react";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { convertFromUnits } from "@/utils/bn";
import { useStakingPoolDeposit } from "@/src/hooks/useStakingPoolDeposit";

export const StakeModal = ({
  info,
  poolKey,
  modalTitle,
  isOpen,
  onClose,
  unitName,
  lockupPeriod,
}) => {
  const [inputValue, setInputValue] = useState();

  const {
    balance,
    isError,
    canDeposit,
    approving,
    depositing,
    handleDeposit,
    handleApprove,
  } = useStakingPoolDeposit({
    value: inputValue,
    tokenAddress: info.stakingToken,
    tokenSymbol: unitName,
    poolKey,
    maximumStake: info.maximumStake,
  });

  const tokenAddress = info.stakingToken;

  const handleChooseMax = () => {
    // Use `info.maximumStake` instead of balance
    setInputValue(convertFromUnits(info.maximumStake).toString());
  };

  const handleChange = (val) => {
    if (typeof val === "string") {
      setInputValue(val);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} disabled={approving || depositing}>
      <div className="max-w-xl w-full inline-block bg-f1f3f6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h2 flex">
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
            tokenSymbol={unitName}
            tokenAddress={tokenAddress}
            handleChooseMax={handleChooseMax}
            inputValue={inputValue}
            id={"staked-amount"}
            disabled={approving || depositing}
            onChange={handleChange}
          />
        </div>
        <div className="modal-unlock mt-8">
          <Label className="mb-3" htmlFor="modal-unlock-on">
            Locking Period
          </Label>
          <p id="modal-unlock-on" className="text-7398C0 text-h4 font-medium">
            {lockupPeriod} hours
          </p>
        </div>

        {!canDeposit ? (
          <RegularButton
            disabled={isError || approving || !inputValue}
            className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
            onClick={handleApprove}
          >
            {approving ? "Approving..." : <>Approve {unitName}</>}
          </RegularButton>
        ) : (
          <RegularButton
            disabled={isError || depositing}
            className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
            onClick={handleDeposit}
          >
            {depositing ? "Staking..." : "Stake"}
          </RegularButton>
        )}
      </div>
    </Modal>
  );
};
