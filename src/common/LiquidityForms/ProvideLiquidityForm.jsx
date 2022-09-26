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
import { useCalculatePods } from "@/src/hooks/useCalculatePods";
import { useAppConstants } from "@/src/context/AppConstants";
import DateLib from "@/lib/date/DateLib";
import { fromNow } from "@/utils/formatter/relative-time";
import { Alert } from "@/common/Alert/Alert";
import Link from "next/link";
import { DataLoadingIndicator } from "@/common/DataLoadingIndicator";
import { TokenAmountWithPrefix } from "@/common/TokenAmountWithPrefix";
import { useLiquidityFormsContext } from "@/common/LiquidityForms/LiquidityFormsContext";
import { t, Trans } from "@lingui/macro";
import { BackButton } from "@/common/BackButton/BackButton";
import { useCoverActiveReportings } from "@/src/hooks/useCoverActiveReportings";
import { Routes } from "@/src/config/routes";

export const ProvideLiquidityForm = ({ coverKey, info, isDiversified }) => {
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
    npmValue,
    liquidityTokenDecimals,
    npmTokenDecimals,
  });

  const {
    info: {
      minStakeToAddLiquidity,
      myStake,
      myStablecoinBalance,
      vaultTokenSymbol,
      vault: vaultTokenAddress,
    },
  } = useLiquidityFormsContext();

  const { receiveAmount, loading: receiveAmountLoading } = useCalculatePods({
    coverKey,
    value: lqValue,
    podAddress: vaultTokenAddress,
  });

  const { data: activeReportings } = useCoverActiveReportings({ coverKey });

  const requiredStake = toBN(minStakeToAddLiquidity).minus(myStake).toString();

  useEffect(() => {
    if (
      npmValue &&
      isGreater(requiredStake, convertToUnits(npmValue, npmTokenDecimals))
    ) {
      setNpmErrorMsg(t`Insufficient Stake`);
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

  if (activeReportings.length > 0) {
    const status = activeReportings[0].status;
    const incidentDate = activeReportings[0].incidentDate;
    const productKey = activeReportings[0].productKey;

    const statusLink = (
      <Link href={Routes.ViewReport(coverKey, productKey, incidentDate)}>
        <a className="font-medium underline hover:no-underline">{status}</a>
      </Link>
    );

    return isDiversified ? (
      <Alert>
        <Trans>
          Cannot add liquidity, as one of the product&apos;s status is not
          normal
        </Trans>
      </Alert>
    ) : (
      <Alert>
        <Trans>
          Cannot add liquidity, since the cover status is {statusLink}
        </Trans>
      </Alert>
    );
  }

  let loadingMessage = "";
  if (receiveAmountLoading) {
    loadingMessage = t`Calculating tokens...`;
  } else if (npmBalanceLoading) {
    loadingMessage = t`Fetching balance...`;
  } else if (npmAllowanceLoading) {
    loadingMessage = t`Fetching ${NPMTokenSymbol} allowance...`;
  } else if (lqAllowanceLoading) {
    loadingMessage = t`Fetching ${liquidityTokenSymbol} allowance...`;
  }

  const isInvalidNpm = toBN(requiredStake).isGreaterThan(0) ? !npmValue : false;

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
            <Trans comment="Liquidity Withdrawal Period Open Date">Open:</Trans>{" "}
          </strong>
          {DateLib.toLongDateFormat(info.withdrawalOpen, router.locale)}
        </span>
      </div>
      <div>
        <span className="text-7398C0" title={fromNow(info.withdrawalClose)}>
          <strong>
            <Trans comment="Liquidity Withdrawal Period Closing Date">
              Close:
            </Trans>{" "}
          </strong>
          {DateLib.toLongDateFormat(info.withdrawalClose, router.locale)}
        </span>
      </div>

      <div className="mt-2">
        <DataLoadingIndicator message={loadingMessage} />
        {!hasBothAllowances && (
          <div className="flex items-center gap-x-10">
            <RegularButton
              disabled={
                hasLqTokenAllowance ||
                lqApproving ||
                lqErrorMsg ||
                loadingMessage
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

            <RegularButton
              disabled={
                hasNPMTokenAllowance ||
                npmApproving ||
                npmErrorMsg ||
                loadingMessage
              }
              className="w-full p-6 font-semibold uppercase text-h6"
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
          </div>
        )}

        {hasBothAllowances && (
          <RegularButton
            disabled={
              isError ||
              providing ||
              !lqValue ||
              isInvalidNpm ||
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

      <div className="flex justify-center mt-16 md:justify-start">
        <BackButton onClick={() => router.back()} />
      </div>
    </div>
  );
};
