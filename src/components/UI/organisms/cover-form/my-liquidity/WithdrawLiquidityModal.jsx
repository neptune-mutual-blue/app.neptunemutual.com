import { useRouter } from "next/router";
import { useState } from "react";
import { Dialog } from "@headlessui/react";

import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { ReceiveAmountInput } from "@/components/UI/organisms/receive-amount-input";
import { convertFromUnits } from "@/utils/bn";
import { toBytes32 } from "@/src/helpers/cover";
import { useCalculateLiquidity } from "@/src/hooks/provide-liquidity/useCalculateLiquidity";
import { formatAmount } from "@/utils/formatter";
import { useRemoveLiquidity } from "@/src/hooks/provide-liquidity/useRemoveLiquidity";

export const WithdrawLiquidityModal = ({
  modalTitle,
  isOpen,
  onClose,
  unitName,
}) => {
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = toBytes32(cover_id);

  const [value, setValue] = useState();
  const { receiveAmount } = useCalculateLiquidity({
    coverKey,
    podAmount: value,
  });
  const { balance, vaultTokenAddress, handleWithdraw } = useRemoveLiquidity({
    coverKey,
    value,
  });

  const handleChooseMax = () => {
    setValue(convertFromUnits(balance).toString());
  };

  const handleChange = (val) => {
    if (typeof val === "string") {
      setValue(val);
    }
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
            onChange={handleChange}
            tokenBalance={balance}
            tokenAddress={vaultTokenAddress}
          />
        </div>
        <div className="modal-unlock mt-6">
          <ReceiveAmountInput
            labelText="You Will Receive"
            tokenSymbol="DAI"
            inputValue={formatAmount(
              convertFromUnits(receiveAmount).toString()
            )}
            inputId="my-liquidity-receive"
          />
        </div>
        <RegularButton
          onClick={handleWithdraw}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
          disabled={!value}
        >
          Withdraw
        </RegularButton>
      </div>
    </Modal>
  );
};
