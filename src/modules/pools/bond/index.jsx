import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import DateLib from "@/lib/date/DateLib";
import { Label } from "@/common/Label/Label";
import { RegularButton } from "@/common/Button/RegularButton";
import { Container } from "@/common/Container/Container";
import { BondInfoCard } from "@/src/modules/pools/bond/BondInfoCard";
import { mergeAlternatively } from "@/utils/arrays";
import { TokenAmountInput } from "@/common/TokenAmountInput/TokenAmountInput";
import { ReceiveAmountInput } from "@/common/ReceiveAmountInput/ReceiveAmountInput";
import { convertFromUnits, convertToUnits, sumOf } from "@/utils/bn";
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
import { DataLoadingIndicator } from "@/common/DataLoadingIndicator";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";
import { useTransactionHistory } from "@/src/hooks/useTransactionHistory";
import { TransactionHistory } from "@/src/services/transactions/transaction-history";

const BondPage = () => {
  const { networkId } = useNetwork();
  const { info, refetch: refetchBondInfo } = useBondInfo();
  const [value, setValue] = useState("");
  const { account } = useWeb3React();
  const tokenAddress = info.lpTokenAddress;
  const tokenSymbol = useTokenSymbol(tokenAddress);
  const { NPMTokenAddress, liquidityTokenAddress, getPriceByAddress } =
    useAppConstants();
  const router = useRouter();

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

  useTransactionHistory((instance, { pushError, pushSuccess }) => {
    TransactionHistory.process(
      TransactionHistory.METHODS.CREATE_BOND,
      TransactionHistory.callback(instance, {
        success: ({ hash }) => {
          pushSuccess(t`Created bond successfully`, hash);
        },
        failure: ({ hash }) => {
          pushError(t`Could not create bond`, hash);
        },
      })
    );
  });

  const roi = getAnnualDiscountRate(info.discountRate, info.vestingTerm);
  const marketPrice = convertToUnits(
    getPriceByAddress(NPMTokenAddress)
  ).toString();

  const leftHalf = [
    {
      title: t`Bond Price`,
      value: formatCurrency(
        getDiscountedPrice(
          info.discountRate,
          convertFromUnits(marketPrice).toString()
        ),
        router.locale,
        "USD"
      ).short,
      tooltip: getDiscountedPrice(
        info.discountRate,
        convertFromUnits(marketPrice).toString()
      ),
      valueClasses: "text-h3 text-4e7dd9 mt-1",
    },
    {
      title: t`Maximum Bond`,
      value: `${
        formatCurrency(
          convertFromUnits(info.maxBond).toString(),
          router.locale,
          "NPM",
          true
        ).short
      }`,
      tooltip: `${
        formatCurrency(
          convertFromUnits(info.maxBond).toString(),
          router.locale,
          "NPM",
          true
        ).long
      }`,
      valueClasses: "text-sm text-9B9B9B mt-1",
      titleClasses: "mt-7",
    },
  ];

  const rightHalf = [
    {
      title: t`Market Price`,
      value: formatCurrency(
        convertFromUnits(marketPrice).toString(),
        router.locale,
        "USD"
      ).short,
      tooltip: convertFromUnits(marketPrice).toString(),
      valueClasses: "text-h3 text-9B9B9B mt-1",
    },
  ];

  const claimable = convertFromUnits(info.claimable).toNumber();

  if (account) {
    rightHalf.push({
      title: t`Your Bond`,
      value: claimable
        ? `${formatCurrency(claimable, router.locale, "NPM", true).short}`
        : "",
      tooltip: `${
        formatCurrency(
          convertFromUnits(info.claimable).toString(),
          router.locale,
          "NPM",
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
    loadingMessage = t`Calculating tokens...`;
  } else if (loadingBalance) {
    loadingMessage = t`Fetching balance...`;
  } else if (loadingAllowance) {
    loadingMessage = t`Fetching allowance...`;
  }

  return (
    <Container
      className={"grid sm:gap-16 grid-cols-1 lg:grid-cols-3 pt-16 pb-36"}
    >
      <div className="max-w-lg col-span-2">
        <TokenAmountInput
          labelText={t`Enter your amount`}
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
            labelText={t`You Will Receive`}
            tokenSymbol="NPM"
            inputValue={convertFromUnits(receiveAmount).toString()}
          />
        </div>

        <div className="unlock mt-14">
          <Label className="mb-2" htmlFor="unlock-on">
            <Trans>Will Unlock On</Trans>
          </Label>
          <p
            id="unlock-on"
            className="font-medium text-7398C0 text-h4"
            title={DateLib.toLongDateFormat(unlockTimestamp, router.locale)}
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
              {approving ? (
                t`Approving...`
              ) : (
                <>
                  <Trans>Approve</Trans> {tokenSymbol}
                </>
              )}
            </RegularButton>
          ) : (
            <RegularButton
              disabled={error || bonding || loadingMessage}
              className="w-full p-6 font-semibold uppercase text-h6"
              onClick={() => {
                handleBond(() => {
                  setValue("");
                });
              }}
            >
              {bonding ? (
                t`Bonding...`
              ) : (
                <>
                  <Trans>Bond</Trans> {tokenSymbol}
                </>
              )}
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
            rel="noopener noreferrer nofollow"
            className="inline-block mr-8 font-medium text-h4 text-4e7dd9 hover:underline"
          >
            <Trans>Get LP tokens</Trans>
          </a>

          <Link href="/pools/bond/transactions">
            <a className="inline-block font-medium text-h4 text-4e7dd9 hover:underline">
              <Trans>Transaction List</Trans>
            </a>
          </Link>
        </div>
        <BondInfoCard
          account={account}
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
