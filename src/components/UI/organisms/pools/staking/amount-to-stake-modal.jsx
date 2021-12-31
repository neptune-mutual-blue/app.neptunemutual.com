import { Dialog } from "@headlessui/react";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Label } from "@/components/UI/atoms/label";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { useState } from "react";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";

export const AmountToStakeModal = ({
  id,
  onStake,
  modalTitle,
  isOpen,
  onClose,
  lockingPeriod,
  unitName,
}) => {
  const [inputValue, setInputValue] = useState();

  const handleChooseMax = () => {
    const MAX_VALUE_TO_STAKE = 10000;
    setInputValue(MAX_VALUE_TO_STAKE);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleStake = (_id) => {
    onStake(_id, parseInt(inputValue));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-xl w-full inline-block bg-F1F3F6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h2 flex">
          {modalTitle}
        </Dialog.Title>

        <ModalCloseButton onClick={onClose}></ModalCloseButton>

        <div className="mt-6">
          <TokenAmountInput
            labelText={"Amount You Wish To Stake"}
            tokenSymbol={unitName}
            handleChooseMax={handleChooseMax}
            inputValue={inputValue}
            id={"staked-amount"}
            onInput={handleChange}
          />
        </div>
        <div className="modal-unlock mt-8">
          <Label className="mb-3" htmlFor="bond-amount">
            Locking Period
          </Label>
          <p id="modal-unlock-on" className="text-7398C0 text-h4 font-medium">
            {lockingPeriod} hours
          </p>
        </div>
        <RegularButton
          onClick={() => handleStake(id)}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
        >
          Stake
        </RegularButton>
      </div>
    </Modal>
  );
};
