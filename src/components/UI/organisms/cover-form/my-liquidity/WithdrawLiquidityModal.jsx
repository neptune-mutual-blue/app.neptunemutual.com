import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { ReceiveAmountInput } from "@/components/UI/organisms/receive-amount-input";
import {
  convertFromUnits,
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
} from "@/utils/bn";
import { toBytes32 } from "@/src/helpers/cover";
import { useCalculateLiquidity } from "@/src/hooks/provide-liquidity/useCalculateLiquidity";
import { formatAmount } from "@/utils/formatter";
import { useRemoveLiquidity } from "@/src/hooks/provide-liquidity/useRemoveLiquidity";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { useAppConstants } from "@/src/context/AppConstants";

export const WithdrawLiquidityModal = ({
  modalTitle,
  isOpen,
  onClose,
  info,
  myStake,
}) => {
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = toBytes32(cover_id);
  const [podValue, setPodValue] = useState();
  const [npmValue, setNpmValue] = useState();

  const { liquidityTokenAddress, NPMTokenAddress } = useAppConstants();
  const { receiveAmount } = useCalculateLiquidity({
    coverKey,
    podAmount: podValue,
  });
  const liquidityTokenSymbol = useTokenSymbol(liquidityTokenAddress);
  const npmTokenSymbol = useTokenSymbol(NPMTokenAddress);
  const {
    balance,
    allowance,
    approving,
    withdrawing,
    handleApprove,
    handleWithdraw,
    vaultTokenSymbol,
    vaultTokenAddress,
  } = useRemoveLiquidity({
    coverKey,
    value: podValue || "0",
    npmValue: npmValue || "0",
  });

  // Clear on modal close
  useEffect(() => {
    if (isOpen) return;

    setPodValue();
    setNpmValue();
  }, [isOpen]);

  const handleChooseNpmMax = () => {
    setNpmValue(convertFromUnits(myStake).toString());
  };

  const handleChoosePodMax = () => {
    setPodValue(convertFromUnits(balance).toString());
  };

  const handleNpmChange = (val) => {
    if (typeof val === "string") {
      setNpmValue(val);
    }
  };

  const handlePodChange = (val) => {
    if (typeof val === "string") {
      setPodValue(val);
    }
  };

  const now = DateLib.unix();
  const canWithdraw =
    podValue &&
    isValidNumber(podValue) &&
    isGreaterOrEqual(allowance, convertToUnits(podValue || "0"));
  isGreater(now, info.withdrawalOpen) && isGreater(info.withdrawalClose, now);

  return (
    <Modal isOpen={isOpen} onClose={onClose} disabled={withdrawing}>
      <div className="max-w-xl max-h-90vh overflow-y-auto w-full inline-block bg-f1f3f6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h2 flex">
          {modalTitle}
        </Dialog.Title>

        <ModalCloseButton
          disabled={withdrawing}
          onClick={onClose}
        ></ModalCloseButton>

        <div className="mt-6">
          <TokenAmountInput
            labelText={"Enter Npm Amount"}
            tokenSymbol={npmTokenSymbol}
            handleChooseMax={handleChooseNpmMax}
            inputValue={npmValue}
            id={"my-staked-amount"}
            onChange={handleNpmChange}
            tokenAddress={NPMTokenAddress}
          >
            {isGreater(myStake, "0") && (
              <>
                Staked: {convertFromUnits(myStake).toString()} {npmTokenSymbol}
              </>
            )}
          </TokenAmountInput>
        </div>
        <div className="mt-6">
          <TokenAmountInput
            labelText={"Enter your POD"}
            tokenSymbol={vaultTokenSymbol}
            handleChooseMax={handleChoosePodMax}
            inputValue={podValue}
            id={"my-liquidity-amount"}
            onChange={handlePodChange}
            tokenBalance={balance}
            tokenAddress={vaultTokenAddress}
          />
        </div>
        <div className="modal-unlock mt-6">
          <ReceiveAmountInput
            labelText="You Will Receive"
            tokenSymbol={liquidityTokenSymbol}
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
            {DateLib.toLongDateFormat(info.withdrawalOpen)}
          </span>
        </div>
        <div>
          <span className="text-7398C0" title={fromNow(info.withdrawalClose)}>
            <strong>Close: </strong>
            {DateLib.toLongDateFormat(info.withdrawalClose)}
          </span>
        </div>

        {!canWithdraw ? (
          <RegularButton
            onClick={handleApprove}
            className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
            disabled={approving}
          >
            {approving ? "Approving.." : "Approve"}
          </RegularButton>
        ) : (
          <RegularButton
            onClick={handleWithdraw}
            className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
            disabled={withdrawing}
          >
            {withdrawing ? "Withdrawing.." : "Withdraw"}
          </RegularButton>
        )}
      </div>
    </Modal>
  );
};
