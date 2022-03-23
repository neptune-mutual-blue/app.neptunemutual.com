import { useState } from "react";
import { useRouter } from "next/router";
import * as Tooltip from "@radix-ui/react-tooltip";

import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { Radio } from "@/components/UI/atoms/radio";
import { PolicyFeesAndExpiry } from "@/components/UI/organisms/PolicyFeesAndExpiry/PolicyFeesAndExpiry";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { monthNames } from "@/lib/dates";
import { convertFromUnits, isValidNumber } from "@/utils/bn";
import { usePurchasePolicy } from "@/src/hooks/usePurchasePolicy";
import { usePolicyFees } from "@/src/hooks/usePolicyFees";
import { useAppConstants } from "@/src/context/AppConstants";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { formatCurrency } from "@/utils/formatter/currency";
import InfoCircleIcon from "@/icons/InfoCircleIcon";
import { useCoverStatusInfo } from "@/src/hooks/useCoverStatusInfo";
import { Alert } from "@/components/UI/atoms/alert";
import Link from "next/link";
import { getParsedKey } from "@/src/helpers/cover";
import { DataLoadingIndicator } from "@/components/DataLoadingIndicator";

export const PurchasePolicyForm = ({ coverKey }) => {
  const router = useRouter();
  const [value, setValue] = useState();
  const [coverMonth, setCoverMonth] = useState();
  const { liquidityTokenAddress } = useAppConstants();
  const liquidityTokenSymbol = useTokenSymbol(liquidityTokenAddress);
  const statusInfo = useCoverStatusInfo(coverKey);

  const { loading: updatingFee, data: feeData } = usePolicyFees({
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
    updatingBalance,
  } = usePurchasePolicy({
    value,
    coverMonth,
    coverKey,
    feeAmount: feeData.fee,
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
  let loadingMessage = "";
  if (updatingFee) {
    loadingMessage = "Fetching...";
  } else if (updatingBalance) {
    loadingMessage = "Fetching Balance...";
  }

  if (statusInfo.status && statusInfo.status !== "Normal") {
    return (
      <Alert>
        Cannot purchase policy, since the cover status is{" "}
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
      <div className="px-3 mt-12">
        <div className="flex items-start gap-2">
          <h5
            className="block mb-4 font-semibold text-black uppercase text-h6"
            htmlFor="cover-period"
          >
            Select your coverage period
          </h5>
          {/* Tooltip */}
          <Tooltip.Root>
            <Tooltip.Trigger className="block">
              <span className="sr-only">Info</span>
              <InfoCircleIcon width={24} className="pr-1 fill-9B9B9B" />
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
            disabled={approving || purchasing}
            onChange={handleRadioChange}
            checked={coverMonth === "1"}
          />
          <Radio
            label={coverPeriodLabels[1]}
            id="period-2"
            value="2"
            name="cover-period"
            disabled={approving || purchasing}
            onChange={handleRadioChange}
            checked={coverMonth === "2"}
          />
          <Radio
            label={coverPeriodLabels[2]}
            id="period-3"
            value="3"
            name="cover-period"
            disabled={approving || purchasing}
            onChange={handleRadioChange}
            checked={coverMonth == "3"}
          />
        </div>
      </div>
      {value && coverMonth && (
        <PolicyFeesAndExpiry data={feeData} coverPeriod={coverMonth} />
      )}

      <div className="mt-4">
        <DataLoadingIndicator message={loadingMessage} />
        {!canPurchase ? (
          <RegularButton
            disabled={
              !!error ||
              approving ||
              !value ||
              !coverMonth ||
              updatingFee ||
              updatingBalance
            }
            className="w-full p-6 font-semibold uppercase text-h6"
            onClick={handleApprove}
          >
            {approving ? "Approving..." : <>Approve {liquidityTokenSymbol}</>}
          </RegularButton>
        ) : (
          <RegularButton
            disabled={
              !!error ||
              purchasing ||
              !value ||
              !coverMonth ||
              updatingFee ||
              updatingBalance
            }
            className="w-full p-6 font-semibold uppercase text-h6"
            onClick={() => {
              handlePurchase(() => {
                setValue("");
                setCoverMonth();
              });
            }}
          >
            {purchasing ? "Purchasing..." : "Purchase policy"}
          </RegularButton>
        )}
      </div>

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
        <div className="p-4 text-xs font-light leading-5 tracking-normal text-white bg-black rounded-xl max-w-15">
          <p className="">
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
