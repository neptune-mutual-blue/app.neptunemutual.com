import { Dialog } from "@headlessui/react";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { useState } from "react";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { ReceiveAmountInput } from "@/components/UI/organisms/receive-amount-input";

export const WithdrawLiquidityModal = ({
  id,
  modalTitle,
  isOpen,
  onClose,
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

  const handleWithdraw = (_id) => {
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
            labelText={"Enter your POD"}
            tokenSymbol={unitName}
            handleChooseMax={handleChooseMax}
            inputValue={inputValue}
            id={"staked-amount"}
            onInput={handleChange}
          />
        </div>
        <div className="modal-unlock mt-6">
          <ReceiveAmountInput
            labelText="You Will Receive"
            tokenSymbol="POD"
            inputValue=""
            inputId="my-liquidity-receive"
          />
        </div>
        <RegularButton
          onClick={() => handleWithdraw(id)}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
        >
          Withdraw
        </RegularButton>
      </div>
    </Modal>
  );
};
