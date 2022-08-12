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
import { formatAmount } from "@/utils/formatter";
import { fromNow } from "@/utils/formatter/relative-time";
import { useCalculateLiquidity } from "@/src/hooks/useCalculateLiquidity";
import { useRemoveLiquidity } from "@/src/hooks/useRemoveLiquidity";
import { useAppConstants } from "@/src/context/AppConstants";
import { useLiquidityFormsContext } from "@/common/LiquidityForms/LiquidityFormsContext";
import { t, Trans } from "@lingui/macro";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { Checkbox } from "@/common/Checkbox/Checkbox";

export const WithdrawLiquidityForm = ({ setModalDisabled }) => {
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);
  const [podValue, setPodValue] = useState("");
  const [npmValue, setNpmValue] = useState("");
  const [npmErrorMsg, setNpmErrorMsg] = useState("");
  const [podErrorMsg, setPodErrorMsg] = useState("");
  const [isExit, setIsExit] = useState(false);

  const {
    NPMTokenAddress,
    liquidityTokenSymbol,
    NPMTokenSymbol,
    NPMTokenDecimals,
    liquidityTokenDecimals,
  } = useAppConstants();
  const { receiveAmount, loading: receiveAmountLoading } =
    useCalculateLiquidity({
      coverKey,
      podAmount: podValue || "0",
    });
  const {
    info: {
      myStake,
      minStakeToAddLiquidity,
      isAccrualComplete,
      withdrawalOpen,
      withdrawalClose,
      vaultTokenDecimals,
      vault: vaultTokenAddress,
      vaultTokenSymbol,
      myPodBalance: balance,
    },
  } = useLiquidityFormsContext();
  const {
    allowance,
    approving,
    withdrawing,
    loadingAllowance,
    handleApprove,
    handleWithdraw,
  } = useRemoveLiquidity({
    coverKey,
    value: podValue || "0",
    npmValue: npmValue || "0",
  });

  const unStakableAmount = toBN(myStake)
    .minus(minStakeToAddLiquidity)
    .toString();

  // Clear on modal close
  useEffect(() => {
    return () => {
      setPodValue("");
      setNpmValue("");
    };
  }, []);

  useEffect(() => {
    setModalDisabled(withdrawing);
  }, [setModalDisabled, withdrawing]);

  useEffect(() => {
    if (
      !isExit &&
      npmValue &&
      isGreater(convertToUnits(npmValue), unStakableAmount)
    ) {
      setNpmErrorMsg(t`Cannot go below minimum stake`);
    } else {
      setNpmErrorMsg("");
    }

    if (podValue && isGreater(convertToUnits(podValue), balance)) {
      setPodErrorMsg(t`Exceeds maximum balance`);
    } else if (podValue && isEqualTo(convertToUnits(podValue), 0)) {
      setPodErrorMsg(t`Insufficient Balance`);
    } else {
      setPodErrorMsg("");
    }
  }, [balance, npmValue, podValue, unStakableAmount, isExit]);

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
    loadingMessage = t`Calculating tokens...`;
  } else if (loadingAllowance) {
    loadingMessage = t`Fetching allowance...`;
  }

  const handleExit = (ev) => {
    setIsExit(ev.target.checked);
    if (ev.target.checked) {
      setNpmValue(convertFromUnits(myStake).toString());
      setPodValue(convertFromUnits(balance).toString());
    }
  };

  return (
    <div data-testid="withdraw-liquidity-form">
      <div className="overflow-y-auto max-h-[50vh] px-8 sm:px-12">
        <div className="flex flex-col mt-6">
          <TokenAmountInput
            labelText={t`Enter Npm Amount`}
            disabled={isExit}
            handleChooseMax={handleChooseNpmMax}
            inputValue={npmValue}
            id={"my-staked-amount"}
            onChange={handleNpmChange}
            tokenAddress={NPMTokenAddress}
            tokenSymbol={NPMTokenSymbol}
            tokenDecimals={NPMTokenDecimals}
            data-testid="npm-input"
          >
            {isGreater(myStake, "0") && (
              <TokenAmountWithPrefix
                amountInUnits={myStake}
                prefix={t`Your Stake:` + " "}
                symbol={NPMTokenSymbol}
                decimals={NPMTokenDecimals}
                data-testid="my-stake-prefix"
              />
            )}
            <TokenAmountWithPrefix
              amountInUnits={minStakeToAddLiquidity}
              prefix={t`Minimum Stake:` + " "}
              symbol={NPMTokenSymbol}
              decimals={NPMTokenDecimals}
              data-testid="minimum-stake-prefix"
            />
            {!isExit && npmErrorMsg && (
              <p className="text-FA5C2F" data-testid="npm-error">
                {npmErrorMsg}
              </p>
            )}
          </TokenAmountInput>
        </div>

        <div className="mt-6">
          <TokenAmountInput
            labelText={t`Enter your POD`}
            disabled={isExit}
            handleChooseMax={handleChoosePodMax}
            inputValue={podValue}
            id={"my-liquidity-amount"}
            onChange={handlePodChange}
            tokenBalance={balance}
            tokenSymbol={vaultTokenSymbol}
            tokenAddress={vaultTokenAddress}
            tokenDecimals={vaultTokenDecimals}
            data-testid="pod-input"
          />
          {podErrorMsg && (
            <p className="text-FA5C2F" data-testid="pod-error">
              {podErrorMsg}
            </p>
          )}
        </div>

        <div className="mt-6 modal-unlock">
          <ReceiveAmountInput
            labelText={t`You Will Receive`}
            tokenSymbol={liquidityTokenSymbol}
            inputValue={formatAmount(
              convertFromUnits(
                receiveAmount,
                liquidityTokenDecimals
              ).toString(),
              router.locale
            )}
            data-testid="receive-input"
          />
        </div>

        <h5 className="block mt-6 mb-1 font-semibold text-black uppercase text-h6">
          <Trans>NEXT UNLOCK CYCLE</Trans>
        </h5>

        <div>
          <span
            className="text-7398C0"
            title={fromNow(withdrawalOpen)}
            data-testid="open-date"
          >
            <strong>
              <Trans>Open:</Trans>{" "}
            </strong>
            {DateLib.toLongDateFormat(withdrawalOpen, router.locale)}
          </span>
        </div>

        <div>
          <span
            className="text-7398C0"
            title={fromNow(withdrawalClose)}
            data-testid="close-date"
          >
            <strong>
              <Trans>Close:</Trans>{" "}
            </strong>
            {DateLib.toLongDateFormat(withdrawalClose, router.locale)}
          </span>
        </div>

        <div className="flex items-center mt-8">
          <Checkbox
            id="exitCheckBox"
            name="checkexitliquidity"
            checked={isExit}
            onChange={(ev) => handleExit(ev)}
            data-testid="exit-checkbox"
          >
            Withdraw Full Liquidity
          </Checkbox>
        </div>
      </div>

      <div className="px-8 mt-4 sm:px-12">
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
              loadingAllowance ||
              !isAccrualComplete
            }
            data-testid="approve-button"
          >
            {approving ? t`Approving..` : t`Approve`}
          </RegularButton>
        ) : (
          <RegularButton
            onClick={() => {
              handleWithdraw(() => {
                setPodValue("");
                setNpmValue("");
              }, isExit);
            }}
            className="w-full p-6 font-semibold uppercase text-h6"
            disabled={
              withdrawing ||
              npmErrorMsg ||
              podErrorMsg ||
              receiveAmountLoading ||
              !npmValue ||
              !podValue ||
              loadingAllowance ||
              !isAccrualComplete
            }
            data-testid="withdraw-button"
          >
            {withdrawing ? t`Withdrawing..` : t`Withdraw`}
          </RegularButton>
        )}
      </div>
    </div>
  );
};
