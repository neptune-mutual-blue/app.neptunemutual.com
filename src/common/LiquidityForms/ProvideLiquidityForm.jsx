import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  convertFromUnits,
  isGreater,
  convertToUnits,
  isEqualTo,
  toBN,
} from "@/utils/bn";
import { OutlinedButton } from "@/common/Button/OutlinedButton";
import { TokenAmountInput } from "@/common/TokenAmountInput/TokenAmountInput";
import { RegularButton } from "@/common/Button/RegularButton";
import { ReceiveAmountInput } from "@/common/ReceiveAmountInput/ReceiveAmountInput";
import { useProvideLiquidity } from "@/src/hooks/useProvideLiquidity";
import { useCalculatePods } from "@/src/hooks/provide-liquidity/useCalculatePods";
import { useAppConstants } from "@/src/context/AppConstants";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import DateLib from "@/lib/date/DateLib";
import { fromNow } from "@/utils/formatter/relative-time";
import { Alert } from "@/common/Alert/Alert";
import Link from "next/link";
import { getParsedKey } from "@/src/helpers/cover";
import { useCoverStatusInfo } from "@/src/hooks/useCoverStatusInfo";
import { DataLoadingIndicator } from "@/common/DataLoadingIndicator";
import { TokenAmountWithPrefix } from "@/common/TokenAmountWithPrefix";
import { useLiquidityFormsContext } from "@/common/LiquidityForms/LiquidityFormsContext";
import { useToast } from "@/lib/toast/context";
import { TOAST_DEFAULT_TIMEOUT } from "@/src/config/toast";
import OpenInNewIcon from "@/icons/OpenInNewIcon";

export const ProvideLiquidityForm = ({ coverKey, info }) => {
  const [lqValue, setLqValue] = useState();
  const [npmValue, setNPMValue] = useState();
  const router = useRouter();
  const [npmErrorMsg, setNpmErrorMsg] = useState("");
  const [lqErrorMsg, setLqErrorMsg] = useState("");

  const { liquidityTokenAddress, NPMTokenAddress } = useAppConstants();
  const liquidityTokenSymbol = useTokenSymbol(liquidityTokenAddress);
  const npmTokenSymbol = useTokenSymbol(NPMTokenAddress);

  const toast = useToast();

  const statusInfo = useCoverStatusInfo(coverKey);
  const {
    lqTokenBalance,
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
    podSymbol,
    lqBalanceLoading,
    npmBalanceLoading,
    lqAllowanceLoading,
    npmAllowanceLoading,
  } = useProvideLiquidity({
    coverKey,
    lqValue,
    npmValue,
  });
  const { minStakeToAddLiquidity, myStake } = useLiquidityFormsContext();

  const { receiveAmount, loading: receiveAmountLoading } = useCalculatePods({
    coverKey,
    value: lqValue,
  });

  const ViewToastLiquidityLink = () => (
    <Link href="/my-liquidity">
      <a className="flex items-center">
        <span className="inline-block">View provided liquidity</span>
        <OpenInNewIcon className="w-4 h-4 ml-2" fill="currentColor" />
      </a>
    </Link>
  );

  const requiredStake = toBN(minStakeToAddLiquidity).minus(myStake).toString();
  useEffect(() => {
    if (npmValue && isGreater(requiredStake, convertToUnits(npmValue))) {
      setNpmErrorMsg("Insufficient Stake");
    } else if (npmValue && isEqualTo(convertToUnits(npmValue), "0")) {
      // TODO: Remove once protocol is fixed, if user already staked the `minStakeToAddLiquidity`,
      // then user should be able to provide ZERO for this input.
      setNpmErrorMsg("Please specify an amount");
    } else if (npmValue && isGreater(convertToUnits(npmValue), npmBalance)) {
      setNpmErrorMsg("Exceeds maximum balance");
    } else {
      setNpmErrorMsg("");
    }

    if (lqValue && isGreater(convertToUnits(lqValue), lqTokenBalance)) {
      setLqErrorMsg("Exceeds maximum balance");
    } else if (lqValue && isEqualTo(convertToUnits(lqValue), 0)) {
      setLqErrorMsg("Please specify an amount");
    } else {
      setLqErrorMsg("");
    }
  }, [lqTokenBalance, lqValue, npmBalance, npmValue, requiredStake]);

  const handleMaxNPM = () => {
    if (!npmBalance) {
      return;
    }
    setNPMValue(convertFromUnits(npmBalance).toString());
  };

  const handleNPMChange = (val) => {
    setNPMValue(val);
  };

  const handleMaxLq = () => {
    if (!lqTokenBalance) {
      return;
    }
    setLqValue(convertFromUnits(lqTokenBalance).toString());
  };

  const handleLqChange = (val) => {
    setLqValue(val);
  };

  const handleSuccessViewProvidedLiquidity = () => {
    toast?.pushSuccess({
      title: "Added Liquidity Successfully",
      message: <ViewToastLiquidityLink />,
      lifetime: TOAST_DEFAULT_TIMEOUT,
    });
  };

  const hasBothAllowances = hasLqTokenAllowance && hasNPMTokenAllowance;

  if (statusInfo.status && statusInfo.status !== "Normal") {
    return (
      <Alert>
        Cannot add liquidity, since the cover status is{" "}
        <Link
          href={`/reporting/${getParsedKey(coverKey)}/${
            statusInfo.activeIncidentDate
          }/details`}
        >
          <a className="font-medium underline hover:no-underline">
            {statusInfo.status}
          </a>
        </Link>
      </Alert>
    );
  }

  let loadingMessage = "";
  if (receiveAmountLoading) {
    loadingMessage = "Calculating tokens...";
  } else if (lqBalanceLoading || npmBalanceLoading) {
    loadingMessage = "Fetching balances...";
  } else if (npmAllowanceLoading) {
    loadingMessage = `Fetching ${npmTokenSymbol} allowance...`;
  } else if (lqAllowanceLoading) {
    loadingMessage = `Fetching ${liquidityTokenSymbol} allowance...`;
  }

  return (
    <div className="max-w-md">
      <div className="pb-12">
        <TokenAmountInput
          labelText={"Enter your NPM stake"}
          onChange={handleNPMChange}
          handleChooseMax={handleMaxNPM}
          error={npmErrorMsg}
          tokenAddress={NPMTokenAddress}
          tokenSymbol={npmTokenSymbol}
          tokenBalance={npmBalance || "0"}
          inputId={"npm-stake"}
          inputValue={npmValue}
          disabled={lqApproving || providing}
        >
          {isGreater(minStakeToAddLiquidity, myStake) && (
            <TokenAmountWithPrefix
              amountInUnits={minStakeToAddLiquidity}
              prefix="Minimum Stake: "
              symbol={npmTokenSymbol}
            />
          )}
          {isGreater(myStake, "0") && (
            <TokenAmountWithPrefix
              amountInUnits={myStake}
              prefix="Your Stake: "
              symbol={npmTokenSymbol}
            />
          )}

          {npmErrorMsg && (
            <p className="flex items-center text-FA5C2F">{npmErrorMsg}</p>
          )}
        </TokenAmountInput>
      </div>

      <div className="pb-12">
        <TokenAmountInput
          labelText={"Enter Amount you wish to provide"}
          onChange={handleLqChange}
          handleChooseMax={handleMaxLq}
          error={isError}
          tokenAddress={liquidityTokenAddress}
          tokenSymbol={liquidityTokenSymbol}
          tokenBalance={lqTokenBalance || "0"}
          inputId={"dai-amount"}
          inputValue={lqValue}
          disabled={lqApproving || providing}
        >
          {lqErrorMsg && (
            <p className="flex items-center text-FA5C2F">{lqErrorMsg}</p>
          )}
        </TokenAmountInput>
      </div>

      <div className="pb-12">
        <ReceiveAmountInput
          labelText="You Will Receive"
          tokenSymbol={podSymbol}
          inputValue={receiveAmount}
        />
      </div>

      <h5 className="block mb-1 font-semibold text-black uppercase text-h6">
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

      <div className="mt-6">
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
              "Approving..."
            ) : (
              <>Approve {liquidityTokenSymbol || "Liquidity"}</>
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
              "Approving..."
            ) : (
              <>Approve {npmTokenSymbol || "Stake"}</>
            )}
          </RegularButton>
        )}

        {hasBothAllowances && (
          <RegularButton
            disabled={
              isError ||
              providing ||
              !lqValue ||
              !npmValue ||
              npmErrorMsg ||
              lqErrorMsg ||
              loadingMessage
            }
            className="w-full p-6 font-semibold uppercase text-h6"
            onClick={() => {
              handleProvide(() => {
                handleSuccessViewProvidedLiquidity();
                setNPMValue("");
                setLqValue("");
              });
            }}
          >
            {providing ? "Providing Liquidity..." : <>Provide Liquidity</>}
          </RegularButton>
        )}
      </div>

      <div className="mt-16">
        <OutlinedButton
          className="block m-auto rounded-big sm:m-0"
          onClick={() => router.back()}
        >
          &#x27F5;&nbsp;Back
        </OutlinedButton>
      </div>
    </div>
  );
};
