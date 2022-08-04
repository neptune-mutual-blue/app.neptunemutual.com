import { useState } from "react";
import { useRouter } from "next/router";

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
import { Alert } from "@/common/Alert/Alert";
import Link from "next/link";
import { DataLoadingIndicator } from "@/common/DataLoadingIndicator";
import { t, Trans } from "@lingui/macro";
import { useCoverStatsContext } from "@/common/Cover/CoverStatsContext";
import { Label } from "@/common/Label/Label";
import { RegularInput } from "@/common/Input/RegularInput";
import { BackButton } from "@/common/BackButton/BackButton";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";
import { isValidProduct } from "@/src/helpers/cover";
export const PurchasePolicyForm = ({ coverKey, productKey }) => {
  const router = useRouter();

  const isDiversified = isValidProduct(productKey);

  const [value, setValue] = useState("");
  const [referralCode, setReferralCode] = useState("");
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
    liquidityTokenSymbol,
    referralCode,
  });

  const {
    isUserWhitelisted,
    requiresWhitelist,
    activeIncidentDate,
    productStatus,
  } = useCoverStatsContext();

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

  const cover_id = safeParseBytes32String(coverKey);
  const product_id = safeParseBytes32String(productKey);
  const status = productStatus;
  if (status && status !== "Normal") {
    return (
      <Alert>
        <Trans>Cannot purchase policy, since the cover status is</Trans>{" "}
        <Link
          href={
            !isDiversified
              ? `/reporting/${cover_id}/${activeIncidentDate}/details`
              : `/reporting/${cover_id}/product/${product_id}/${activeIncidentDate}/details`
          }
        >
          <a className="font-medium underline hover:no-underline">{status}</a>
        </Link>
      </Alert>
    );
  }

  return (
    <div className="max-w-lg" data-testid="purchase-policy-form">
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
        buttonClassName="hidden"
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
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-4">
          <label
            className="block font-semibold text-black uppercase text-h6"
            htmlFor="cover-period"
          >
            <Trans>Select your coverage period</Trans>
          </label>
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

      <div className="mt-11">
        <Label htmlFor={"incident_title"} className={"mb-2"}>
          <Trans>Referral Code</Trans>
        </Label>
        <RegularInput
          className="leading-none disabled:cursor-not-allowed !text-h5"
          inputProps={{
            id: "referral_code",
            placeholder: t`Enter Referral Code`,
            value: referralCode,
            onChange: (e) => setReferralCode(e.target.value),
            disabled: approving,
          }}
        />
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
                setReferralCode("");
                setCoverMonth("");
              });
            }}
          >
            {purchasing ? t`Purchasing...` : t`Purchase policy`}
          </RegularButton>
        )}
      </div>

      <div className="flex justify-center mt-20 md:justify-start">
        <BackButton onClick={() => router.back()} />
      </div>
    </div>
  );
};
