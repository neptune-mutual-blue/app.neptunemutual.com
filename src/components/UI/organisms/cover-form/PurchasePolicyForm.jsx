import { useRouter } from "next/router";
import * as Tooltip from "@radix-ui/react-tooltip";

import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { Radio } from "@/components/UI/atoms/radio";
import { PolicyFeesAndExpiry } from "@/components/UI/organisms/PolicyFeesAndExpiry/PolicyFeesAndExpiry";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { monthNames } from "@/lib/dates";
import { convertFromUnits, isValidNumber } from "@/utils/bn";
import { usePurchasePolicy } from "@/components/UI/organisms/cover-form/usePurchasePolicy";
import { useState } from "react";
import { usePolicyFees } from "@/components/UI/organisms/cover-form/usePolicyFees";
import { useAppConstants } from "@/src/context/AppConstants";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { formatCurrency } from "@/utils/formatter/currency";
import InfoCircleIcon from "@/icons/InfoCircleIcon";

export const PurchasePolicyForm = ({ coverKey }) => {
  const router = useRouter();
  const [value, setValue] = useState();
  const [coverMonth, setCoverMonth] = useState();
  const { liquidityTokenAddress } = useAppConstants();
  const liquidityTokenSymbol = useTokenSymbol(liquidityTokenAddress);
  const {
    loading: updatingFee,
    data: feeData,
    error: feeError,
  } = usePolicyFees({
    value,
    coverMonth,
    coverKey,
  });
  const {
    balance,
    approving,
    purchasing,
    canPurchase,
    error,
    handleApprove,
    handlePurchase,
  } = usePurchasePolicy({
    value,
    coverMonth,
    coverKey,
    feeAmount: feeData.fee,
    feeError,
  });

  const handleChange = (val) => {
    if (typeof val === "string") {
      setValue(val);
    }
  };

  const handleRadioChange = (e) => {
    setCoverMonth(e.target.value);
  };

  const handleChooseMax = () => {
    if (!balance) {
      return;
    }
    setValue(convertFromUnits(balance).toString());
  };

  const now = new Date();
  const coverPeriodLabels = [
    monthNames[(now.getMonth() + 0) % 12],
    monthNames[(now.getMonth() + 1) % 12],
    monthNames[(now.getMonth() + 2) % 12],
  ];

  return (
    <div className="max-w-md">
      <TokenAmountInput
        labelText={"Amount you wish to cover"}
        onChange={handleChange}
        error={!!error}
        handleChooseMax={handleChooseMax}
        tokenAddress={liquidityTokenAddress}
        tokenSymbol={liquidityTokenSymbol}
        tokenBalance={balance}
        inputId={"cover-amount"}
        inputValue={value}
        disabled={approving || purchasing}
      >
        {value && isValidNumber(value) && (
          <div
            className="flex items-center text-15aac8"
            title={formatCurrency(value, "cxDAI", true).long}
          >
            <p>
              You will receive: {formatCurrency(value, "cxDAI", true).short}
            </p>
          </div>
        )}
        {error && <p className="flex items-center text-FA5C2F">{error}</p>}
      </TokenAmountInput>
      <div className="mt-12 px-3">
        <div className="flex gap-2 items-start">
          <h5
            className="block uppercase text-black text-h6 font-semibold mb-4"
            htmlFor="cover-period"
          >
            Select your coverage period
          </h5>
          {/* Tooltip */}
          <Tooltip.Root>
            <Tooltip.Trigger className="block">
              <span className="sr-only">Info</span>
              <InfoCircleIcon width={24} className="fill-9B9B9B pr-1" />
            </Tooltip.Trigger>
            <CovergaeInfoTooltipContent />
          </Tooltip.Root>
        </div>
        <div className="flex">
          <Radio
            label={coverPeriodLabels[0]}
            id="period-1"
            value="1"
            name="cover-period"
            onChange={handleRadioChange}
          />
          <Radio
            label={coverPeriodLabels[1]}
            id="period-2"
            value="2"
            name="cover-period"
            onChange={handleRadioChange}
          />
          <Radio
            label={coverPeriodLabels[2]}
            id="period-3"
            value="3"
            name="cover-period"
            onChange={handleRadioChange}
          />
        </div>
      </div>
      {value && coverMonth && (
        <PolicyFeesAndExpiry
          fetching={updatingFee}
          data={feeData}
          coverPeriod={coverMonth}
        />
      )}

      {!canPurchase ? (
        <RegularButton
          disabled={!!error || approving}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
          onClick={handleApprove}
        >
          {approving ? "Approving..." : <>Approve {liquidityTokenSymbol}</>}
        </RegularButton>
      ) : (
        <RegularButton
          disabled={!!error || purchasing}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
          onClick={handlePurchase}
        >
          {purchasing ? "Purchasing..." : "Purchase policy"}
        </RegularButton>
      )}

      <div className="mt-20">
        <OutlinedButton className="rounded-big" onClick={() => router.back()}>
          &#x27F5;&nbsp;Back
        </OutlinedButton>
      </div>
    </div>
  );
};

const CovergaeInfoTooltipContent = () => {
  return (
    <>
      <Tooltip.Content side="right">
        <div className="text-xs bg-black p-4 rounded-xl max-w-[15rem]">
          <p className="text-white tracking-normal">
            Coverage period will cover from date of purchase up to the month you
            have selected.
          </p>
        </div>
        <Tooltip.Arrow
          offset={32}
          width={16}
          height={12}
          className="fill-black"
        />
      </Tooltip.Content>
    </>
  );
};
