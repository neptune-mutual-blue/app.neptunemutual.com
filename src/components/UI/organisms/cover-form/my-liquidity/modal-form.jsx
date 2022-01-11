import { Dialog } from "@headlessui/react";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { useState } from "react";
import { useConstants } from "@/components/pages/cover/useConstants";
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

  const [value, setValue] = useState();
  const [receiveAmount, setReceiveAmount] = useState();
  const { maxValue } = useConstants();

  const handleChooseMax = () => {
    setValue(maxValue);
    setReceiveAmount(parseFloat(0.99 * maxValue).toFixed(2));
  };

   const handleChange = (e) => {
    const willRecieve = parseFloat(0.99 * e.target.value).toFixed(2);
    setValue(e.target.value);
    setReceiveAmount(willRecieve);
  };

  const handleWithdraw = (_id) => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-xl w-full inline-block bg-f1f3f6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h2 flex">
          {modalTitle}
        </Dialog.Title>

        <ModalCloseButton onClick={onClose}></ModalCloseButton>

        <div className="mt-6">
          <TokenAmountInput
            labelText={"Enter your POD"}
            tokenSymbol={unitName}
            handleChooseMax={handleChooseMax}
            inputValue={value}
            id={"my-liquidity-amount"}
            onInput={handleChange}
          />
        </div>
        <div className="modal-unlock mt-6">
          <ReceiveAmountInput
            labelText="You Will Receive"
            tokenSymbol="DAI"
            inputValue={receiveAmount}
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
