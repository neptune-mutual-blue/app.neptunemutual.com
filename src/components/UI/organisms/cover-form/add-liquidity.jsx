import { useRouter } from "next/router";
import { useState } from "react";
import { useConstants } from "@/components/pages/cover/useConstants";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { ReceiveAmountInput } from "@/components/UI/organisms/receive-amount-input";
import { UnlockDate } from "@/components/UI/organisms/unlock-date";
import { useToast } from "@/lib/toast/context";
import OpenInNewIcon from "@/icons/open-in-new";

const ERROR_TIMEOUT = 30000; // 30 seconds

export const CoverFormAddLiquidity = () => {
  const router = useRouter();
  const toast = useToast();

  const [value, setValue] = useState();
  const [receiveAmount, setReceiveAmount] = useState();
  const { fees, maxValue } = useConstants();

  const handleChooseMax = () => {
    setValue(maxValue);
    setReceiveAmount(parseFloat(0.99 * maxValue).toFixed(2));
  };

  const handleChange = (e) => {
    const willRecieve = parseFloat(0.99 * e.target.value).toFixed(2);
    setValue(e.target.value);
    setReceiveAmount(willRecieve);
  };

  const handleProvideLiquidity = () => {
    toast?.pushSuccess({
      title: "Liquidity has been added",
      message: (
        <p className="flex">
          View transaction{" "}
          <OpenInNewIcon className="h-4 w-4 ml-2" fill="currentColor" />
        </p>
      ),
      lifetime: ERROR_TIMEOUT,
    });
  };

  if (!fees && !maxValue) {
    return <>loading...</>;
  }

  return (
    <div className="max-w-md">
      <div className="pb-16">
        <TokenAmountInput
          labelText={"Amount you wish to cover"}
          onInput={handleChange}
          handleChooseMax={handleChooseMax}
          tokenSymbol={"DAI"}
          inputId={"cover-amount"}
          inputValue={value}
        />
      </div>

      <div className="pb-16">
        <ReceiveAmountInput
          labelText="You Will Receive"
          tokenSymbol="DAI"
          inputValue={receiveAmount}
          inputId="add-liquidity-receive"
        />
      </div>

      <div>
        <UnlockDate dateValue="September 22, 2021 12:34:00 PM UTC" />
      </div>

      <RegularButton
        onClick={handleProvideLiquidity}
        disabled={!value}
        className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
      >
        Provide Liquidity
      </RegularButton>

      <div className="mt-16">
        <OutlinedButton className="rounded-big" onClick={() => router.back()}>
          &#x27F5;&nbsp;Back
        </OutlinedButton>
      </div>
    </div>
  );
};
