import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  convertFromUnits,
  isGreater,
  convertToUnits,
  isEqualTo,
  toBN,
} from "@/utils/bn";
import { TokenAmountInput } from "@/common/TokenAmountInput/TokenAmountInput";
import { RegularButton } from "@/common/Button/RegularButton";
import { ReceiveAmountInput } from "@/common/ReceiveAmountInput/ReceiveAmountInput";
import { useProvideLiquidity } from "@/src/hooks/useProvideLiquidity";
import { useCalculatePods } from "@/src/hooks/provide-liquidity/useCalculatePods";
import { useAppConstants } from "@/src/context/AppConstants";
import DateLib from "@/lib/date/DateLib";
import { fromNow } from "@/utils/formatter/relative-time";
import { Alert } from "@/common/Alert/Alert";
import Link from "next/link";
import { DataLoadingIndicator } from "@/common/DataLoadingIndicator";
import { TokenAmountWithPrefix } from "@/common/TokenAmountWithPrefix";
import { useLiquidityFormsContext } from "@/common/LiquidityForms/LiquidityFormsContext";
import { t, Trans } from "@lingui/macro";
import { useCoverStatsContext } from "@/common/Cover/CoverStatsContext";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";
import { BackButton } from "@/common/BackButton/BackButton";

export const ProvideLiquidityForm = ({ coverKey, info }) => {
  const [lqValue, setLqValue] = useState("");
  const [npmValue, setNPMValue] = useState("");
  const router = useRouter();
  const [npmErrorMsg, setNpmErrorMsg] = useState("");
  const [lqErrorMsg, setLqErrorMsg] = useState("");

  const {
    liquidityTokenAddress,
    NPMTokenAddress,
    liquidityTokenSymbol,
    NPMTokenSymbol,
    liquidityTokenDecimals,
    NPMTokenDecimals: npmTokenDecimals,
  } = useAppConstants();

  const { status, activeIncidentDate } = useCoverStatsContext();

  const {
    info: {
      minStakeToAddLiquidity,
      myStake,
      myStablecoinBalance,
      vaultTokenSymbol,
      vault: vaultTokenAddress,
    },
  } = useLiquidityFormsContext();

  const requiredStake = toBN(minStakeToAddLiquidity).minus(myStake).toString();

  const {
    npmBalance,
    lqApproving,
    npmApproving,
    hasLqTokenAllowance,
    hasNPMTokenAllowance,
    // canProvideLiquidity,
    handleLqTokenApprove,
    handleNPMTokenApprove,
    handleProvide,
    isError,
    providing,
    npmBalanceLoading,
    lqAllowanceLoading,
    npmAllowanceLoading,
  } = useProvideLiquidity({
    coverKey,
    lqValue,
    npmValue: !npmValue && isEqualTo(requiredStake, "0") ? 0 : npmValue,
    liquidityTokenDecimals,
    npmTokenDecimals,
  });

  const { receiveAmount, loading: receiveAmountLoading } = useCalculatePods({
    coverKey,
    value: lqValue,
    podAddress: vaultTokenAddress,
  });

  useEffect(() => {
    if (
      npmValue &&
      isGreater(requiredStake, convertToUnits(npmValue, npmTokenDecimals))
    ) {
      setNpmErrorMsg(t`Insufficient Stake`);
    } else if (
      npmValue &&
      !isEqualTo(requiredStake, "0") &&
      isEqualTo(convertToUnits(npmValue, npmTokenDecimals), "0")
    ) {
      setNpmErrorMsg(t`Please specify an amount`);
    } else if (
      npmValue &&
      isGreater(convertToUnits(npmValue, npmTokenDecimals), npmBalance)
    ) {
      setNpmErrorMsg(t`Exceeds maximum balance`);
    } else {
      setNpmErrorMsg("");
    }

    if (
      lqValue &&
      isGreater(
        convertToUnits(lqValue, liquidityTokenDecimals),
        myStablecoinBalance
      )
    ) {
      setLqErrorMsg(t`Exceeds maximum balance`);
    } else if (
      lqValue &&
      isEqualTo(convertToUnits(lqValue, liquidityTokenDecimals), 0)
    ) {
      setLqErrorMsg(t`Please specify an amount`);
    } else {
      setLqErrorMsg("");
    }
  }, [
    liquidityTokenDecimals,
    lqValue,
    myStablecoinBalance,
    npmBalance,
    npmTokenDecimals,
    npmValue,
    requiredStake,
  ]);

  const handleMaxNPM = () => {
    if (!npmBalance) {
      return;
    }
    setNPMValue(convertFromUnits(npmBalance, npmTokenDecimals).toString());
  };

  const handleNPMChange = (val) => {
    if (typeof val === "string") {
      setNPMValue(val);
    }
  };

  const handleMaxLq = () => {
    setLqValue(
      convertFromUnits(myStablecoinBalance, liquidityTokenDecimals).toString()
    );
  };

  const handleLqChange = (val) => {
    if (typeof val === "string") {
      setLqValue(val);
    }
  };

  const hasBothAllowances = hasLqTokenAllowance && hasNPMTokenAllowance;

  if (status && status !== "Normal") {
    return (
      <Alert>
        <Trans>Cannot add liquidity, since the cover status is</Trans>{" "}
        <Link
          href={`/reporting/${safeParseBytes32String(
            coverKey
          )}/${activeIncidentDate}/details`}
        >
          <a className="font-medium underline hover:no-underline">{status}</a>
        </Link>
      </Alert>
    );
  }

  let loadingMessage = "";
  if (receiveAmountLoading) {
    loadingMessage = t`Calculating tokens...`;
  } else if (npmBalanceLoading) {
    loadingMessage = t`Fetching balances...`;
  } else if (npmAllowanceLoading) {
    loadingMessage = t`Fetching ${NPMTokenSymbol} allowance...`;
  } else if (lqAllowanceLoading) {
    loadingMessage = t`Fetching ${liquidityTokenSymbol} allowance...`;
  }

  return (
    <div className="max-w-md" data-testid="add-liquidity-form">
      <div className="mb-16">
        <TokenAmountInput
          labelText={t`Enter your NPM stake`}
          onChange={handleNPMChange}
          handleChooseMax={handleMaxNPM}
          error={npmErrorMsg}
          tokenAddress={NPMTokenAddress}
          tokenSymbol={NPMTokenSymbol}
          tokenBalance={npmBalance || "0"}
          tokenDecimals={npmTokenDecimals}
          inputId={"npm-stake"}
          inputValue={npmValue}
          disabled={lqApproving || providing}
        >
          {isGreater(minStakeToAddLiquidity, myStake) && (
            <TokenAmountWithPrefix
              amountInUnits={minStakeToAddLiquidity}
              prefix={t`Minimum Stake:` + " "}
              symbol={NPMTokenSymbol}
              decimals={npmTokenDecimals}
            />
          )}
          {isGreater(myStake, "0") && (
            <TokenAmountWithPrefix
              amountInUnits={myStake}
              prefix={t`Your Stake:` + " "}
              symbol={NPMTokenSymbol}
              decimals={npmTokenDecimals}
            />
          )}

          {npmErrorMsg && (
            <p className="flex items-center text-FA5C2F">{npmErrorMsg}</p>
          )}
        </TokenAmountInput>
      </div>

      <div className="mb-16">
        <TokenAmountInput
          labelText={t`Enter Amount you wish to provide`}
          onChange={handleLqChange}
          handleChooseMax={handleMaxLq}
          error={isError}
          tokenAddress={liquidityTokenAddress}
          tokenSymbol={liquidityTokenSymbol}
          tokenDecimals={liquidityTokenDecimals}
          tokenBalance={myStablecoinBalance || "0"}
          inputId={"dai-amount"}
          inputValue={lqValue}
          disabled={lqApproving || providing}
        >
          {lqErrorMsg && (
            <p className="flex items-center text-FA5C2F">{lqErrorMsg}</p>
          )}
        </TokenAmountInput>
      </div>

      <div className="mb-16">
        <ReceiveAmountInput
          labelText={t`You Will Receive`}
          tokenSymbol={vaultTokenSymbol}
          inputValue={receiveAmount}
        />
      </div>

      <h5 className="block mb-3 font-semibold text-black uppercase text-h6">
        <Trans>NEXT UNLOCK CYCLE</Trans>
      </h5>
      <div>
        <span className="text-7398C0" title={fromNow(info.withdrawalOpen)}>
          <strong>
            <Trans>Open:</Trans>{" "}
          </strong>
          {DateLib.toLongDateFormat(info.withdrawalOpen, router.locale)}
        </span>
      </div>
      <div>
        <span className="text-7398C0" title={fromNow(info.withdrawalClose)}>
          <strong>
            <Trans>Close:</Trans>{" "}
          </strong>
          {DateLib.toLongDateFormat(info.withdrawalClose, router.locale)}
        </span>
      </div>

      <div className="mt-2">
        <DataLoadingIndicator message={loadingMessage} />
        {!hasBothAllowances && (
          <RegularButton
            disabled={
              hasLqTokenAllowance || lqApproving || lqErrorMsg || loadingMessage
            }
            className="w-full p-6 font-semibold uppercase text-h6"
            onClick={handleLqTokenApprove}
          >
            {lqApproving ? (
              t`Approving...`
            ) : (
              <>
                <Trans>Approve</Trans> {liquidityTokenSymbol || t`Liquidity`}
              </>
            )}
          </RegularButton>
        )}

        {!hasBothAllowances && (
          <RegularButton
            disabled={
              hasNPMTokenAllowance ||
              npmApproving ||
              npmErrorMsg ||
              loadingMessage
            }
            className="w-full p-6 mt-8 font-semibold uppercase text-h6"
            onClick={handleNPMTokenApprove}
          >
            {npmApproving ? (
              t`Approving...`
            ) : (
              <>
                <Trans>Approve</Trans> {NPMTokenSymbol || t`Stake`}
              </>
            )}
          </RegularButton>
        )}

        {hasBothAllowances && (
          <RegularButton
            disabled={
              isError ||
              providing ||
              !lqValue ||
              (!npmValue && !isEqualTo(requiredStake, "0")) ||
              npmErrorMsg ||
              lqErrorMsg ||
              loadingMessage
            }
            className="w-full p-6 font-semibold uppercase text-h6"
            onClick={() => {
              handleProvide(() => {
                setNPMValue("");
                setLqValue("");
              });
            }}
          >
            {providing ? (
              t`Providing Liquidity...`
            ) : (
              <>
                <Trans>Provide Liquidity</Trans>
              </>
            )}
          </RegularButton>
        )}
      </div>

      <div className="mt-16">
        <BackButton onClick={() => router.back()} />
      </div>
    </div>
  );
};
