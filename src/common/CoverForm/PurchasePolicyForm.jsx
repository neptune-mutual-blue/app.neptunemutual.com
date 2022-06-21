import { useState } from "react";
import { useRouter } from "next/router";
import * as Tooltip from "@radix-ui/react-tooltip";

import { Radio } from "@/common/Radio/Radio";
import { PolicyFeesAndExpiry } from "@/common/PolicyFeesAndExpiry/PolicyFeesAndExpiry";
import { TokenAmountInput } from "@/common/TokenAmountInput/TokenAmountInput";
import { RegularButton } from "@/common/Button/RegularButton";
import { getMonthNames } from "@/lib/dates";
import { convertFromUnits, isValidNumber } from "@/utils/bn";
import { usePurchasePolicy } from "@/src/hooks/usePurchasePolicy";
import { usePolicyFees } from "@/src/hooks/usePolicyFees";
import { useAppConstants } from "@/src/context/AppConstants";
import { formatCurrency } from "@/utils/formatter/currency";
import InfoCircleIcon from "@/icons/InfoCircleIcon";
import { Alert } from "@/common/Alert/Alert";
import Link from "next/link";
import { DataLoadingIndicator } from "@/common/DataLoadingIndicator";
import { t, Trans } from "@lingui/macro";
import { useCoverStatsContext } from "@/common/Cover/CoverStatsContext";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";
import { BackButton } from "@/common/BackButton/BackButton";

export const PurchasePolicyForm = ({ coverKey, productKey }) => {
  const router = useRouter();

  const [value, setValue] = useState("");
  const [coverMonth, setCoverMonth] = useState("");
  const {
    liquidityTokenAddress,
    liquidityTokenDecimals,
    liquidityTokenSymbol,
  } = useAppConstants();
  const { availableLiquidity: availableLiquidityInWei } =
    useCoverStatsContext();
  const availableLiquidity = convertFromUnits(
    availableLiquidityInWei,
    liquidityTokenDecimals
  ).toString();

  const monthNames = getMonthNames(router.locale);

  const { loading: updatingFee, data: feeData } = usePolicyFees({
    value,
    liquidityTokenDecimals,
    coverMonth,
    coverKey,
    productKey,
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
    updatingAllowance,
  } = usePurchasePolicy({
    value,
    coverMonth,
    coverKey,
    productKey,
    feeAmount: feeData.fee,
    availableLiquidity,
  });

  const { isUserWhitelisted, requiresWhitelist, activeIncidentDate, status } =
    useCoverStatsContext();

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
    setValue(convertFromUnits(balance, liquidityTokenDecimals).toString());
  };

  const now = new Date();
  const coverPeriodLabels = [
    monthNames[(now.getMonth() + 0) % 12],
    monthNames[(now.getMonth() + 1) % 12],
    monthNames[(now.getMonth() + 2) % 12],
  ];
  let loadingMessage = "";
  if (updatingFee) {
    loadingMessage = t`Fetching...`;
  } else if (updatingAllowance) {
    loadingMessage = t`Fetching Allowance...`;
  } else if (updatingBalance) {
    loadingMessage = t`Fetching Balance...`;
  }

  if (requiresWhitelist && !isUserWhitelisted) {
    return (
      <Alert>
        <Trans>You are not whitelisted</Trans>
      </Alert>
    );
  }
  if (status && status !== "Normal") {
    return (
      <Alert>
        <Trans>Cannot purchase policy, since the cover status is</Trans>{" "}
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

  return (
    <div className="max-w-md" data-testid="purchase-policy-form">
      <TokenAmountInput
        labelText={t`Amount you wish to cover`}
        onChange={handleChange}
        error={!!error}
        handleChooseMax={handleChooseMax}
        tokenAddress={liquidityTokenAddress}
        tokenSymbol={liquidityTokenSymbol}
        tokenDecimals={liquidityTokenDecimals}
        tokenBalance={balance}
        inputId={"cover-amount"}
        inputValue={value}
        disabled={approving || purchasing}
      >
        {value && isValidNumber(value) && (
          <div
            className="flex items-center text-15aac8"
            title={formatCurrency(value, router.locale, "cxDAI", true).long}
          >
            <p>
              <Trans>You will receive:</Trans>{" "}
              {formatCurrency(value, router.locale, "cxDAI", true).short}
            </p>
          </div>
        )}
        {error && <p className="flex items-center text-FA5C2F">{error}</p>}
      </TokenAmountInput>
      <div className="px-3 mt-12">
        <div className="flex items-center gap-2 mb-4">
          <label
            className="block font-semibold text-black uppercase text-h6"
            htmlFor="cover-period"
          >
            <Trans>Select your coverage period</Trans>
          </label>
          {/* Tooltip */}
          <Tooltip.Root>
            <Tooltip.Trigger className="block">
              <span className="sr-only">Info</span>
              <InfoCircleIcon
                width={18}
                height={18}
                className="pr-1 fill-9B9B9B"
              />
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
      {value && coverMonth && <PolicyFeesAndExpiry data={feeData} />}

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
            {approving ? (
              t`Approving...`
            ) : (
              <>
                <Trans>Approve</Trans> {liquidityTokenSymbol}
              </>
            )}
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
                setCoverMonth("");
              });
            }}
          >
            {purchasing ? t`Purchasing...` : t`Purchase policy`}
          </RegularButton>
        )}
      </div>

      <div className="mt-20">
        <BackButton onClick={() => router.back()} />
      </div>
    </div>
  );
};

const CovergaeInfoTooltipContent = () => {
  return (
    <>
      <Tooltip.Content side="right" sideOffset={7}>
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
