import { Dialog } from "@headlessui/react";
import { DisabledInput } from "@/components/UI/atoms/input/disabled-input";
import { Label } from "@/components/UI/atoms/label";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { useState } from "react";

export const ClaimCoverModal = ({ modalTitle, isOpen, onClose }) => {
  const [value, setValue] = useState();
  const [receiveAmount, setReceiveAmount] = useState();

  const maxValue = 50000;

  const handleChooseMax = () => {
    setValue(maxValue);
    setReceiveAmount(parseFloat(0.99 * maxValue).toFixed(2));
  };

  const handleChange = (e) => {
    const willRecieve = parseFloat(0.99 * e.target.value).toFixed(2);
    setValue(e.target.value);
    setReceiveAmount(willRecieve);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-lg w-full inline-block bg-F1F3F6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h2 w-full flex items-center">
          <img
            src="/_mocks/icons/okex.png"
            alt="policy"
            height={32}
            width={32}
          />
          <span className="pl-3">{modalTitle}</span>
        </Dialog.Title>
        <ModalCloseButton onClick={onClose}></ModalCloseButton>
        <div className="mt-6">
          <TokenAmountInput
            tokenSymbol={"cxDAI"}
            labelText={"ENTER YOUR CXDAI"}
            handleChooseMax={handleChooseMax}
            inputValue={value}
            id={"bond-amount"}
            onInput={handleChange}
          />
        </div>
        <div className="modal-unlock mt-8">
          <Label className="font-semibold mb-4">YOU WILL RECEIVE </Label>
          <DisabledInput value={receiveAmount} unit="DAI" />
          <p className="text-9B9B9B pt-2 px-3">Fee: 6.50%</p>
        </div>
        <RegularButton
          disabled={!value && true}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
        >
          Claim
        </RegularButton>
      </div>
    </Modal>
  );
};
