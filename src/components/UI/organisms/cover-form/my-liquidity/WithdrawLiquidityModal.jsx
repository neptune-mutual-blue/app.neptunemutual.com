import { useRouter } from "next/router";
import { useState } from "react";
import { Dialog } from "@headlessui/react";

import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { ReceiveAmountInput } from "@/components/UI/organisms/receive-amount-input";
import { convertFromUnits, isGreater } from "@/utils/bn";
import { toBytes32 } from "@/src/helpers/cover";
import { useCalculateLiquidity } from "@/src/hooks/provide-liquidity/useCalculateLiquidity";
import { formatAmount } from "@/utils/formatter";
import { useRemoveLiquidity } from "@/src/hooks/provide-liquidity/useRemoveLiquidity";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";

export const WithdrawLiquidityModal = ({
  modalTitle,
  isOpen,
  onClose,
  info,
}) => {
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = toBytes32(cover_id);

  const [value, setValue] = useState();
  const { receiveAmount } = useCalculateLiquidity({
    coverKey,
    podAmount: value,
  });
  const { balance, vaultTokenAddress, handleWithdraw, withDrawing } =
    useRemoveLiquidity({
      coverKey,
      value,
    });
  const vaultTokenSymbol = useTokenSymbol(vaultTokenAddress);

  const handleChooseMax = () => {
    setValue(convertFromUnits(balance).toString());
  };

  const handleChange = (val) => {
    if (typeof val === "string") {
      setValue(val);
    }
  };

  const now = DateLib.unix();
  const canWithdraw =
    value &&
    isGreater(now, info.withdrawalOpen) &&
    isGreater(info.withdrawalClose, now);

  return (
    <Modal isOpen={isOpen} onClose={onClose} disabled={withDrawing}>
      <div className="max-w-xl w-full inline-block bg-f1f3f6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h2 flex">
          {modalTitle}
        </Dialog.Title>

        <ModalCloseButton
          disabled={withDrawing}
          onClick={onClose}
        ></ModalCloseButton>

        <div className="mt-6">
          <TokenAmountInput
            labelText={"Enter your POD"}
            tokenSymbol={vaultTokenSymbol}
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

        <h5 className="block  text-black text-h6 font-semibold mt-6 mb-1 uppercase">
          NEXT UNLOCK CYCLE
        </h5>
        <div>
          <span className="text-7398C0" title={fromNow(info.withdrawalOpen)}>
            <strong>Open: </strong>
            {DateLib.toLongDateFormat(info.withdrawalOpen, "UTC")}
          </span>
        </div>
        <div>
          <span className="text-7398C0" title={fromNow(info.withdrawalClose)}>
            <strong>Close: </strong>
            {DateLib.toLongDateFormat(info.withdrawalClose, "UTC")}
          </span>
        </div>

        <RegularButton
          onClick={handleWithdraw}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
          disabled={canWithdraw}
        >
          {withDrawing ? "Withdrawing" : "Withdraw"}
        </RegularButton>
      </div>
    </Modal>
  );
};
