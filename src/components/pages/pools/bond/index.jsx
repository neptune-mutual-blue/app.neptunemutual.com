import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import DateLib from "@/lib/date/DateLib";
import RefreshDoubleIcon from "@/icons/RefreshDoubleIcon";
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
import { useDebounce } from "@/src/hooks/useDebounce";
import { getAnnualDiscountRate, getDiscountedPrice } from "@/src/helpers/bond";
import { formatCurrency } from "@/utils/formatter/currency";
import { fromNow } from "@/utils/formatter/relative-time";
import Link from "next/link";
import { useAppConstants } from "@/src/context/AppConstants";
import { getReplacedString } from "@/utils/string";
import { POOL_URLS } from "@/src/config/constants";
import { useAppContext } from "@/src/context/AppWrapper";

const BondPage = () => {
  const { networkId } = useAppContext();
  const { info, refetch: refetchBondInfo } = useBondInfo();
  const [value, setValue] = useState();
  const { account } = useWeb3React();
  const tokenAddress = info.lpTokenAddress;
  const tokenSymbol = useTokenSymbol(tokenAddress);
  const delayedValue = useDebounce(value, 200);
  const { NPMTokenAddress, liquidityTokenAddress } = useAppConstants();

  const {
    balance,
    receiveAmount,
    receiveAmountLoading,
    approving,
    bonding,
    canBond,
    error,
    handleApprove,
    handleBond,
  } = useCreateBond({ info, value: delayedValue });
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

  return (
    <Container className={"grid gap-16 grid-cols-1 lg:grid-cols-3 pt-16 pb-36"}>
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
        <div className="receive mt-16">
          <ReceiveAmountInput
            labelText="You Will Receive"
            tokenSymbol="NPM"
            inputValue={convertFromUnits(receiveAmount).toString()}
          />
          <div className="text-xs tracking-normal px-2 py-1 mt-2 flex justify-end items-center">
            {receiveAmountLoading && (
              <>
                <RefreshDoubleIcon className="w-3 h-3 text-4e7dd9 animate-spin mr-2" />
                <p>Fetching...</p>
              </>
            )}
          </div>
        </div>

        <div className="unlock mt-14">
          <Label className="mb-2" htmlFor="unlock-on">
            Will Unlock On
          </Label>
          <p
            id="unlock-on"
            className="text-7398C0 text-h4 font-medium"
            title={DateLib.toLongDateFormat(unlockTimestamp)}
          >
            {fromNow(unlockTimestamp)}
          </p>
        </div>

        {!canBond ? (
          <RegularButton
            disabled={error || approving || !value}
            className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
            onClick={handleApprove}
          >
            {approving ? "Approving..." : <>Approve {tokenSymbol}</>}
          </RegularButton>
        ) : (
          <RegularButton
            disabled={error || bonding}
            className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
            onClick={async () => {
              await handleBond();
              refetchBondInfo();
            }}
          >
            {bonding ? "Bonding..." : <>Bond {tokenSymbol}</>}
          </RegularButton>
        )}
      </div>
      <div>
        <div className="flex justify-end mb-10">
          <a
            href={getReplacedString(POOL_URLS[networkId], {
              liquidityTokenAddress,
              NPMTokenAddress,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mr-8 text-h4 font-medium text-4e7dd9 hover:underline"
          >
            Get LP tokens
          </a>

          <Link href="/pools/bond/transactions">
            <a className="inline-block text-h4 font-medium text-4e7dd9 hover:underline">
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
