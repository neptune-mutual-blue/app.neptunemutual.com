import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { convertFromUnits, sumOf, isGreater, convertToUnits } from "@/utils/bn";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { ReceiveAmountInput } from "@/components/UI/organisms/receive-amount-input";
import { UnlockDate } from "@/components/UI/organisms/unlock-date";
import { useProvideLiquidity } from "@/src/hooks/provide-liquidity/useProvideLiquidity";
import { useCalculatePods } from "@/src/hooks/provide-liquidity/useCalculatePods";
import { useAppConstants } from "@/src/context/AppConstants";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import DateLib from "@/lib/date/DateLib";
import { fromNow } from "@/utils/formatter/relative-time";

export const ProvideLiquidityForm = ({ coverKey, info }) => {
  const [lqValue, setLqValue] = useState();
  const [npmValue, setNPMValue] = useState();
  const router = useRouter();
  const [npmErrorMsg, setNpmErrorMsg] = useState("");
  const [lqErrorMsg, setLqErrorMsg] = useState("");

  const { liquidityTokenAddress, NPMTokenAddress } = useAppConstants();
  const liquidityTokenSymbol = useTokenSymbol(liquidityTokenAddress);
  const npmTokenSymbol = useTokenSymbol(NPMTokenAddress);
  const {
    lqTokenBalance,
    npmBalance,
    lqApproving,
    npmApproving,
    hasLqTokenAllowance,
    hasNPMTokenAllowance,
    minNpmStake,
    // canProvideLiquidity,
    handleLqTokenApprove,
    handleNPMTokenApprove,
    handleProvide,
    isError,
    providing,
    podSymbol,
  } = useProvideLiquidity({
    coverKey,
    lqValue,
    npmValue,
  });

  const { receiveAmount } = useCalculatePods({ coverKey, value: lqValue });

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

  const unlockTimestamp = sumOf(DateLib.unix(), info?.lockup || "0");

  useEffect(() => {
    if (isGreater(minNpmStake, convertToUnits(npmValue || "0"))) {
      setNpmErrorMsg("Insufficient Stake");
    } else if (
      npmBalance &&
      npmValue > +convertFromUnits(npmBalance).toString()
    ) {
      setNpmErrorMsg("Insufficient Balance");
    } else {
      setNpmErrorMsg("");
    }
    if (
      lqTokenBalance &&
      lqValue > +convertFromUnits(lqTokenBalance).toString()
    ) {
      setLqErrorMsg("Insufficient Balance");
    } else {
      setLqErrorMsg("");
    }
  }, [npmValue, npmBalance, lqValue, lqTokenBalance]);

  return (
    <div className="max-w-md">
      <div className="pb-16">
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
          {isGreater(minNpmStake, "0") && (
            <>
              Minimum Stake: {convertFromUnits(minNpmStake).toString()}{" "}
              {npmTokenSymbol}
            </>
          )}
          {npmErrorMsg && (
            <p className="flex items-center text-FA5C2F">{npmErrorMsg}</p>
          )}
        </TokenAmountInput>
      </div>

      <div className="pb-16">
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

      <div className="pb-16">
        <ReceiveAmountInput
          labelText="You Will Receive"
          tokenSymbol={podSymbol}
          inputValue={receiveAmount}
        />
      </div>

      <div>
        <UnlockDate
          title={DateLib.toLongDateFormat(unlockTimestamp, "UTC")}
          value={fromNow(unlockTimestamp)}
        />
      </div>

      {!hasLqTokenAllowance && (
        <RegularButton
          disabled={lqApproving}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
          onClick={handleLqTokenApprove}
        >
          {lqApproving ? "Approving..." : <>Approve {liquidityTokenSymbol}</>}
        </RegularButton>
      )}

      {!hasNPMTokenAllowance && (
        <RegularButton
          disabled={npmApproving}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
          onClick={handleNPMTokenApprove}
        >
          {npmApproving ? "Approving..." : <>Approve {npmTokenSymbol}</>}
        </RegularButton>
      )}

      {hasLqTokenAllowance && hasNPMTokenAllowance && (
        <RegularButton
          disabled={isError || providing}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
          onClick={handleProvide}
        >
          {providing ? "Providing Liquidity..." : <>Provide Liquidity</>}
        </RegularButton>
      )}

      <div className="mt-16">
        <OutlinedButton className="rounded-big" onClick={() => router.back()}>
          &#x27F5;&nbsp;Back
        </OutlinedButton>
      </div>
    </div>
  );
};
