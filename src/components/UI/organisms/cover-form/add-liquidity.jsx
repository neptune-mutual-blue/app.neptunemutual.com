import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import InfoCircleIcon from "@/icons/info-circle";
import { useConstants } from "@/components/pages/cover/useConstants";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { Radio } from "@/components/UI/atoms/radio";
import { CoverPurchaseDetails } from "@/components/UI/organisms/cover-purchase-details/CoverPurchaseDetails";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Label } from "@/components/UI/atoms/label"

export const CoverFormAddLiquidity = () => {
  const router = useRouter();

  const [value, setValue] = useState();
  const [coverMonth, setCoverMonth] = useState();

  const { fees, maxValue } = useConstants();

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleMaxButtonClick = () => {
    setValue(maxValue);
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
          handleChooseMax={handleMaxButtonClick}
          tokenSymbol={"DAI"}
          inputId={"cover-amount"}
          inputValue={value}
        />
      </div>

      <div className="pb-16">
        <Label className="font-semibold mb-4 uppercase">You Will Receive</Label>
        <div className="flex rounded-lg shadow-sm text-black text-h4 relative">
          <div className="flex items-stretch flex-grow focus-within:z-10">
            <input
              className="focus:ring-4E7DD9 focus:border-4E7DD9 bg-transparent block w-full rounded-lg py-6 pl-6 border border-B0C4DB"
            />
          </div>
          <div className="absolute right-0 h-full flex items-center pr-6 text-9B9B9B ">
            POD
          </div>
        </div>
      </div>

      <div >
        <Label className="font-semibold mb-1 uppercase">Unlock Date</Label>
        <div>
          <span className="text-7398C0">September 22, 2021 12:34:00 PM UTC</span>
        </div>
      </div>

      <RegularButton className="w-full mt-8 p-6 text-h6 uppercase font-semibold">
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
