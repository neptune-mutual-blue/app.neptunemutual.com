import { useRouter } from "next/router";
import { useState } from "react";

import { convertFromUnits, sumOf } from "@/utils/bn";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { ReceiveAmountInput } from "@/components/UI/organisms/receive-amount-input";
import { UnlockDate } from "@/components/UI/organisms/unlock-date";
import { useProvideLiquidity } from "@/src/hooks/provide-liquidity/useProvideLiquidity";
import { useCalculatePods } from "@/src/hooks/provide-liquidity/useCalculatePods";
import { useAppConstants } from "@/src/context/AppConstants";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import dayjs from "dayjs";
import { unixToDate } from "@/utils/date";

export const ProvideLiquidityForm = ({ coverKey, info }) => {
  const [value, setValue] = useState();
  const router = useRouter();

  const { liquidityTokenAddress } = useAppConstants();
  const liquidityTokenSymbol = useTokenSymbol(liquidityTokenAddress);
  const {
    balance,
    approving,
    canProvideLiquidity,
    handleApprove,
    handleProvide,
    isError,
    providing,
    podSymbol,
  } = useProvideLiquidity({
    coverKey,
    value,
  });

  const { receiveAmount } = useCalculatePods({ coverKey, value });

  const handleChooseMax = () => {
    if (!balance) {
      return;
    }
    setValue(convertFromUnits(balance).toString());
  };

  const handleChange = (val) => {
    setValue(val);
  };

  const unlockTimestamp = sumOf(dayjs().unix(), info?.lockup || "0");

  return (
    <div className="max-w-md">
      <div className="pb-16">
        <TokenAmountInput
          labelText={"Enter Amount you wish to provide"}
          onChange={handleChange}
          handleChooseMax={handleChooseMax}
          error={isError}
          tokenAddress={liquidityTokenAddress}
          tokenSymbol={liquidityTokenSymbol}
          tokenBalance={balance || "0"}
          inputId={"cover-amount"}
          inputValue={value}
        />
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
          dateValue={`${unixToDate(
            unlockTimestamp,
            "MMMM DD, YYYY hh:mm:ss A"
          )} UTC`}
        />
      </div>

      {!canProvideLiquidity ? (
        <RegularButton
          disabled={isError || approving}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
          onClick={handleApprove}
        >
          {approving ? "Approving..." : <>Approve DAI</>}
        </RegularButton>
      ) : (
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
