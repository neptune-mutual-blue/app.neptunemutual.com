import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import InfoCircleIcon from "@/icons/info-circle";
import { useConstants } from "@/components/pages/cover/useConstants";
import { Container } from "@/components/UI/atoms/container";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { Radio } from "@/components/UI/atoms/radio";
import { Label } from "@/components/UI/atoms/label";
import { InputWithTrailingButton } from "@/components/UI/atoms/input/with-trailing-button";
import { CoverPurchaseDetails } from "@/components/UI/organisms/cover-purchase-details/CoverPurchaseDetails";
import { TokenBalance } from "@/components/UI/molecules/token-balance";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";

export const CoverForm = () => {
  const router = useRouter();

  const [value, setValue] = useState();
  const [coverMonth, setCoverMonth] = useState();

  const { fees, maxValue } = useConstants();

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleRadioChange = (e) => {
    setCoverMonth(e.target.value);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getMonthsToCover = () => {
    const date = new Date();
    let month = date.getMonth();
    console.log(month, month + 1, month + 2);
    return month;
  };

  const handleMaxButtonClick = () => {
    setValue(maxValue);
  };

  if (!fees && !maxValue) {
    return <>loading...</>;
  }

  return (
    <div className="max-w-md">
      <TokenAmountInput
        labelText={"Amount you wish to cover"}
        onInput={handleChange}
        handleChooseMax={handleMaxButtonClick}
        tokenSymbol={"DAI"}
        inputId={"cover-amount"}
        inputValue={value}
      />
      {value !== undefined && parseInt(value) !== NaN && (
        <div className="px-3 flex items-center text-15aac8">
          <p>You will receive: {value} cxDAI</p>

          <Link href="#">
            <a className="ml-3">
              <span className="sr-only">Info</span>
              <InfoCircleIcon width={24} fill="currentColor" />
            </a>
          </Link>
        </div>
      )}
      <div className="mt-12 px-3">
        <h5
          className="block uppercase text-black text-h6 font-semibold mb-4"
          htmlFor="cover-period"
        >
          Select your coverage period
        </h5>
        <div className="flex">
          <Radio
            label="january"
            id="january"
            name="cover-period"
            onChange={handleRadioChange}
          />
          <Radio
            label="february"
            id="february"
            name="cover-period"
            onChange={handleRadioChange}
          />
          <Radio
            label="march"
            id="march"
            name="cover-period"
            onChange={handleRadioChange}
          />
        </div>
      </div>
      {value && coverMonth && (
        <CoverPurchaseDetails
          fees={fees}
          daiValue={value}
          claimEnd={coverMonth}
        />
      )}
      <RegularButton className="w-full mt-8 p-6 text-h6 uppercase font-semibold">
        Approve Dai
      </RegularButton>

      <div className="mt-16">
        <OutlinedButton className="rounded-big" onClick={() => router.back()}>
          &#x27F5;&nbsp;Back
        </OutlinedButton>
      </div>
    </div>
  );
};
