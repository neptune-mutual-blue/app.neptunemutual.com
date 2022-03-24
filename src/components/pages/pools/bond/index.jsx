import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import DateLib from "@/lib/date/DateLib";
import { Label } from "@/components/UI/atoms/label";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Container } from "@/components/UI/atoms/container";
import { BondInfoCard } from "@/components/UI/organisms/pools/bond/BondInfoCard";
import { mergeAlternatively } from "@/utils/arrays";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { ReceiveAmountInput } from "@/components/UI/organisms/receive-amount-input";
import { convertFromUnits, sumOf } from "@/utils/bn";
import { useBondInfo } from "@/src/hooks/useBondInfo";
import { useCreateBond } from "@/src/hooks/useCreateBond";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { getAnnualDiscountRate, getDiscountedPrice } from "@/src/helpers/bond";
import { formatCurrency } from "@/utils/formatter/currency";
import { fromNow } from "@/utils/formatter/relative-time";
import Link from "next/link";
import { useAppConstants } from "@/src/context/AppConstants";
import { getReplacedString } from "@/utils/string";
import { POOL_URLS } from "@/src/config/constants";
import { useNetwork } from "@/src/context/Network";
import { DataLoadingIndicator } from "@/components/DataLoadingIndicator";

const BondPage = () => {
  const { networkId } = useNetwork();
  const { info, refetch: refetchBondInfo } = useBondInfo();
  const [value, setValue] = useState();
  const { account } = useWeb3React();
  const tokenAddress = info.lpTokenAddress;
  const tokenSymbol = useTokenSymbol(tokenAddress);
  const { NPMTokenAddress, liquidityTokenAddress } = useAppConstants();

  const {
    balance,
    loadingBalance,
    receiveAmount,
    receiveAmountLoading,
    approving,
    loadingAllowance,
    bonding,
    canBond,
    error,
    handleApprove,
    handleBond,
  } = useCreateBond({ info, value, refetchBondInfo });
  const roi = getAnnualDiscountRate(info.discountRate, info.vestingTerm);

  const leftHalf = [
    {
      title: "Bond Price",
      value: formatCurrency(
        getDiscountedPrice(
          info.discountRate,
          convertFromUnits(info.marketPrice).toString()
        ),
        "USD"
      ).short,
      tooltip: getDiscountedPrice(
        info.discountRate,
        convertFromUnits(info.marketPrice).toString()
      ),
      valueClasses: "text-h3 text-4e7dd9 mt-1",
    },
    {
      title: "Maximum Bond",
      value: `${
        formatCurrency(convertFromUnits(info.maxBond).toString(), "NPM", true)
          .short
      }`,
      tooltip: `${
        formatCurrency(convertFromUnits(info.maxBond).toString(), "NPM", true)
          .long
      }`,
      valueClasses: "text-sm text-9B9B9B mt-1",
      titleClasses: "mt-7",
    },
  ];

  const rightHalf = [
    {
      title: "Market Price",
      value: formatCurrency(
        convertFromUnits(info.marketPrice).toString(),
        "USD"
      ).short,
      tooltip: convertFromUnits(info.marketPrice).toString(),
      valueClasses: "text-h3 text-9B9B9B mt-1",
    },
  ];

  if (account) {
    rightHalf.push({
      title: "Your Bond",
      value: `${
        formatCurrency(
          convertFromUnits(info.bondContribution).toString(),
          tokenSymbol,
          true
        ).short
      }`,
      tooltip: `${
        formatCurrency(
          convertFromUnits(info.bondContribution).toString(),
          tokenSymbol,
          true
        ).long
      }`,
      titleClasses: `mt-7`,
      valueClasses: `text-sm text-9B9B9B mt-1`,
    });
  }

  const details = mergeAlternatively(leftHalf, rightHalf, {
    title: "",
    value: "",
    tooltip: "",
  });

  const handleChange = (val) => {
    if (typeof val === "string") {
      setValue(val);
    }
  };

  const handleChooseMax = () => {
    setValue(convertFromUnits(balance).toString());
  };

  const unlockTimestamp = sumOf(DateLib.unix(), info?.vestingTerm || "0");
  let loadingMessage = "";
  if (receiveAmountLoading) {
    loadingMessage = "Calculating tokens...";
  } else if (loadingBalance) {
    loadingMessage = "Fetching balance...";
  } else if (loadingAllowance) {
    loadingMessage = "Fetching allowance...";
  }

  return (
    <Container
      className={"grid sm:gap-16 grid-cols-1 lg:grid-cols-3 pt-16 pb-36"}
    >
      <div className="max-w-lg col-span-2">
        <TokenAmountInput
          labelText={"Enter your amount"}
          inputValue={value}
          tokenBalance={balance}
          tokenSymbol={tokenSymbol}
          tokenAddress={tokenAddress}
          inputId={"bond-amount"}
          onChange={handleChange}
          disabled={approving || bonding}
          handleChooseMax={handleChooseMax}
        />
        {error && <p className="px-3 text-FA5C2F">{error}</p>}
        <div className="mt-16 receive">
          <ReceiveAmountInput
            labelText="You Will Receive"
            tokenSymbol="NPM"
            inputValue={convertFromUnits(receiveAmount).toString()}
          />
        </div>

        <div className="unlock mt-14">
          <Label className="mb-2" htmlFor="unlock-on">
            Will Unlock On
          </Label>
          <p
            id="unlock-on"
            className="font-medium text-7398C0 text-h4"
            title={DateLib.toLongDateFormat(unlockTimestamp)}
          >
            {fromNow(unlockTimestamp)}
          </p>
        </div>

        <div className="mt-4">
          <DataLoadingIndicator message={loadingMessage} />
          {!canBond ? (
            <RegularButton
              disabled={error || approving || !value || loadingMessage}
              className="w-full p-6 font-semibold uppercase text-h6"
              onClick={handleApprove}
            >
              {approving ? "Approving..." : <>Approve {tokenSymbol}</>}
            </RegularButton>
          ) : (
            <RegularButton
              disabled={error || bonding || loadingMessage}
              className="w-full p-6 font-semibold uppercase text-h6"
              onClick={async () => {
                await handleBond();
                refetchBondInfo();
              }}
            >
              {bonding ? "Bonding..." : <>Bond {tokenSymbol}</>}
            </RegularButton>
          )}
        </div>
      </div>
      <div className="row-start-1 mb-10 md:row-start-auto">
        <div className="flex justify-end mb-10">
          <a
            href={getReplacedString(POOL_URLS[networkId], {
              liquidityTokenAddress,
              NPMTokenAddress,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mr-8 font-medium text-h4 text-4e7dd9 hover:underline"
          >
            Get LP tokens
          </a>

          <Link href="/pools/bond/transactions">
            <a className="inline-block font-medium text-h4 text-4e7dd9 hover:underline">
              Transaction List
            </a>
          </Link>
        </div>
        <BondInfoCard
          info={info}
          details={details}
          roi={roi}
          refetchBondInfo={refetchBondInfo}
        />
      </div>
    </Container>
  );
};

export default BondPage;
