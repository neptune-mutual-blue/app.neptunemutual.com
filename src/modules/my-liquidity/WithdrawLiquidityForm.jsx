import { DataLoadingIndicator } from "@/common/DataLoadingIndicator";
import { TokenAmountWithPrefix } from "@/common/TokenAmountWithPrefix";
import { RegularButton } from "@/common/Button/RegularButton";
import { ReceiveAmountInput } from "@/common/ReceiveAmountInput/ReceiveAmountInput";
import { TokenAmountInput } from "@/common/TokenAmountInput/TokenAmountInput";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
import { useCalculateLiquidity } from "@/src/hooks/useCalculateLiquidity";
import { useRemoveLiquidity } from "@/src/hooks/useRemoveLiquidity";
import { useAppConstants } from "@/src/context/AppConstants";
import { useLiquidityFormsContext } from "@/common/LiquidityForms/LiquidityFormsContext";

export const WithdrawLiquidityForm = ({
  info,
  refetchInfo,
  setModalDisabled,
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
    return () => {
      setPodValue();
      setNpmValue();
    };
  }, []);

  useEffect(() => {
    setModalDisabled(withdrawing);
  }, [setModalDisabled, withdrawing]);

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
          inputValue={formatAmount(convertFromUnits(receiveAmount).toString())}
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
        {!isAccrualComplete && <p className="text-FA5C2F">Wait for accrual</p>}
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
  );
};
