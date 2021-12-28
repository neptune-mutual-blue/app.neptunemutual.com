import { Dialog } from "@headlessui/react";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Label } from "@/components/UI/atoms/label";
import { Modal } from "@/components/UI/molecules/modal";
import CloseIcon from "@/icons/close.jsx";
import { InputWithTrailingButton } from "@/components/UI/atoms/input/with-trailing-button";
import { useState } from "react";
import { BalanceAndIcons } from "@/components/UI/molecules/balance-and-icons";
import NeptuneMutualCircleLogo from "@/icons/neptune-mutual-circle-logo";

export const AmountToStakeModal = ({
  id,
  handleStaked,
  modalTitle,
  unlockDate,
  claimableBond,
  isOpen,
  onClose,
  lockingPeriod,
}) => {
  const [inputValue, setInputValue] = useState(0);

  const handleChooseMax = () => {
    const MAX_VALUE_TO_STAKE = 10000;
    setInputValue(MAX_VALUE_TO_STAKE);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleStake = (id) => {
    handleStaked(id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-xl w-full inline-block bg-F1F3F6 align-middle text-left p-12 rounded-4xl relative">
        <Dialog.Title className="font-bold text-h2 flex">
          {modalTitle}
        </Dialog.Title>
        <button
          onClick={onClose}
          className="absolute right-12 top-7 flex justify-center items-center text-gray-300 hover:text-black focus:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-364253 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <span className="sr-only">Close</span>
          <CloseIcon />
        </button>
        <div className="mt-6">
          <Label className="font-semibold mb-4 uppercase">
            Amount You wish to stake
          </Label>
          <InputWithTrailingButton
            value={claimableBond}
            buttonProps={{
              children: "Max",
              onClick: handleChooseMax,
            }}
            inputProps={{
              id: "stake-amount",
              placeholder: "Enter Amount",
              value: inputValue,
              onChange: handleChange,
            }}
          />
          <BalanceAndIcons value={inputValue} unit={"NPM"} />
        </div>
        <div className="modal-unlock mt-8 mb-8">
          <Label className="mb-3" htmlFor="bond-amount">
            Locking Period
          </Label>
          <p id="modal-unlock-on" className="text-7398C0 text-h4 font-medium">
            {lockingPeriod} hours
          </p>
        </div>
        <RegularButton onClick={() => handleStake(id)} className="p-6 w-full">
          STAKE
        </RegularButton>
      </div>
    </Modal>
  );
};
