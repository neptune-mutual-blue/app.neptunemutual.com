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
  isEqualTo,
  toBN,
} from "@/utils/bn";
import DateLib from "@/lib/date/DateLib";

import { toBytes32 } from "@/src/helpers/cover";
import { formatAmount } from "@/utils/formatter";
import { fromNow } from "@/utils/formatter/relative-time";

import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { useCalculateLiquidity } from "@/components/LiquidityForms/useCalculateLiquidity";
import { useRemoveLiquidity } from "@/components/LiquidityForms/useRemoveLiquidity";
import { useAppConstants } from "@/src/context/AppConstants";
import { DataLoadingIndicator } from "@/components/DataLoadingIndicator";
import { useLiquidityFormsContext } from "@/components/LiquidityForms/LiquidityFormsContext";
import { TokenAmountWithPrefix } from "@/components/TokenAmountWithPrefix";

export const WithdrawLiquidityModal = ({
  modalTitle,
  isOpen,
  onClose,
  info,
  refetchInfo,
}) => {
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = toBytes32(cover_id);
  const [podValue, setPodValue] = useState();
  const [npmValue, setNpmValue] = useState();
  const [npmErrorMsg, setNpmErrorMsg] = useState("");
  const [podErrorMsg, setPodErrorMsg] = useState("");

  const { liquidityTokenAddress, NPMTokenAddress } = useAppConstants();
  const { receiveAmount, loading: receiveAmountLoading } =
    useCalculateLiquidity({
      coverKey,
      podAmount: podValue || "0",
    });
  const liquidityTokenSymbol = useTokenSymbol(liquidityTokenAddress);
  const npmTokenSymbol = useTokenSymbol(NPMTokenAddress);
  const { myStake, minStakeToAddLiquidity, isAccrualComplete } =
    useLiquidityFormsContext();
  const {
    podBalance: balance,
    allowance,
    approving,
    withdrawing,
    loadingAllowance,
    loadingPodBalance: loadingBalance,
    handleApprove,
    handleWithdraw,
    vaultTokenSymbol,
    vaultTokenAddress,
  } = useRemoveLiquidity({
    coverKey,
    value: podValue || "0",
    npmValue: npmValue || "0",
    refetchInfo,
  });

  const unStakableAmount = toBN(myStake)
    .minus(minStakeToAddLiquidity)
    .toString();

  // Clear on modal close
  useEffect(() => {
    if (isOpen) return;

    setPodValue();
    setNpmValue();
  }, [isOpen]);

  useEffect(() => {
    if (npmValue && isGreater(convertToUnits(npmValue), unStakableAmount)) {
      setNpmErrorMsg("Cannot go below minimum stake");
    } else {
      setNpmErrorMsg("");
    }

    if (podValue && isGreater(convertToUnits(podValue), balance)) {
      setPodErrorMsg("Exceeds maximum balance");
    } else if (podValue && isEqualTo(convertToUnits(podValue), 0)) {
      setPodErrorMsg("Insufficient Balance");
    } else {
      setPodErrorMsg("");
    }
  }, [balance, npmValue, podValue, unStakableAmount]);

  const handleChooseNpmMax = () => {
    setNpmValue(convertFromUnits(unStakableAmount).toString());
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

  const canWithdraw =
    podValue &&
    isValidNumber(podValue) &&
    isGreaterOrEqual(allowance, convertToUnits(podValue || "0"));

  let loadingMessage = "";
  if (receiveAmountLoading) {
    loadingMessage = "Calculating tokens...";
  } else if (loadingBalance) {
    loadingMessage = "Fetching balance...";
  } else if (loadingAllowance) {
    loadingMessage = "Fetching allowance...";
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} disabled={withdrawing}>
      <div className="relative inline-block w-full max-w-xl p-12 overflow-y-auto text-left align-middle min-w-300 md:min-w-600 max-h-90vh bg-f1f3f6 rounded-3xl">
        <Dialog.Title className="flex font-bold font-sora text-h2">
          {modalTitle}
        </Dialog.Title>

        <ModalCloseButton
          disabled={withdrawing}
          onClick={onClose}
        ></ModalCloseButton>
        <div className="overflow-y-auto max-h-[70vh] pr-2">
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
                <TokenAmountWithPrefix
                  amountInUnits={myStake}
                  prefix="Your Stake: "
                  symbol={npmTokenSymbol}
                />
              )}
              <TokenAmountWithPrefix
                amountInUnits={minStakeToAddLiquidity}
                prefix="Minimum Stake: "
                symbol={npmTokenSymbol}
              />
              {npmErrorMsg && <p className="text-FA5C2F">{npmErrorMsg}</p>}
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
            {podErrorMsg && <p className="text-FA5C2F">{podErrorMsg}</p>}
          </div>
          <div className="mt-6 modal-unlock">
            <ReceiveAmountInput
              labelText="You Will Receive"
              tokenSymbol={liquidityTokenSymbol}
              inputValue={formatAmount(
                convertFromUnits(receiveAmount).toString()
              )}
              inputId="my-liquidity-receive"
            />
          </div>

          <h5 className="block mt-6 mb-1 font-semibold text-black uppercase text-h6">
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

          <div className="mt-4">
            {!isAccrualComplete && (
              <p className="text-FA5C2F">Wait for accrual</p>
            )}
            <DataLoadingIndicator message={loadingMessage} />
            {!canWithdraw ? (
              <RegularButton
                onClick={handleApprove}
                className="w-full p-6 font-semibold uppercase text-h6"
                disabled={
                  approving ||
                  npmErrorMsg ||
                  podErrorMsg ||
                  receiveAmountLoading ||
                  !npmValue ||
                  !podValue ||
                  loadingBalance ||
                  loadingAllowance ||
                  !isAccrualComplete
                }
              >
                {approving ? "Approving.." : "Approve"}
              </RegularButton>
            ) : (
              <RegularButton
                onClick={() => {
                  handleWithdraw(() => {
                    setPodValue("");
                    setNpmValue("");
                  });
                }}
                className="w-full p-6 font-semibold uppercase text-h6"
                disabled={
                  withdrawing ||
                  npmErrorMsg ||
                  podErrorMsg ||
                  receiveAmountLoading ||
                  !npmValue ||
                  !podValue ||
                  loadingBalance ||
                  loadingAllowance ||
                  !isAccrualComplete
                }
              >
                {withdrawing ? "Withdrawing.." : "Withdraw"}
              </RegularButton>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
