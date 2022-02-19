import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import DateLib from "@/lib/date/DateLib";

import { Label } from "@/components/UI/atoms/label";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Container } from "@/components/UI/atoms/container";
import { BondInfoCard } from "@/components/UI/organisms/pools/bond/BondInfoCard";
import { ClaimBondModal } from "@/components/UI/organisms/pools/bond/ClaimBondModal";
import { mergeAlternatively } from "@/utils/arrays";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { ReceiveAmountInput } from "@/components/UI/organisms/receive-amount-input";
import { convertFromUnits, isGreater, sumOf, weiAsAmount } from "@/utils/bn";
import { getToolTipDate, unixToDate } from "@/utils/date";
import { useBondInfo } from "@/src/hooks/useBondInfo";
import { useCreateBond } from "@/src/hooks/useCreateBond";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { useDelayedValueUpdate } from "@/src/hooks/useDelayedValueUpdate";
import { getAnnualDiscountRate, getDiscountedPrice } from "@/src/helpers/bond";
import { DAYS } from "@/src/config/constants";

const BondPage = () => {
  const { info } = useBondInfo();
  const [value, setValue] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const { account } = useWeb3React();
  const tokenAddress = info.lpTokenAddress;
  const tokenSymbol = useTokenSymbol(tokenAddress);
  const delayedValue = useDelayedValueUpdate({ value });

  const {
    balance,
    receiveAmount,
    approving,
    bonding,
    canBond,
    isError,
    handleApprove,
    handleBond,
  } = useCreateBond({ info, value: delayedValue });

  const vestingTermDays = BigNumber(info.vestingTerm)
    .dividedBy(DAYS)
    .decimalPlaces(3)
    .toString();

  const roi = getAnnualDiscountRate(info.discountRate, info.vestingTerm);

  const leftHalf = [
    {
      title: "Bond Price",
      value: `$${getDiscountedPrice(
        info.discountRate,
        convertFromUnits(info.marketPrice).toString()
      )}`,
      valueClasses: "text-h3 text-4e7dd9 mt-1",
    },
    {
      title: "Maximum Bond",
      value: `${weiAsAmount(info.maxBond)} NPM`,
      valueClasses: "text-sm text-9B9B9B mt-1",
      titleClasses: "mt-7",
    },
  ];

  const rightHalf = [
    {
      title: "Market Price",
      value: `$${weiAsAmount(info.marketPrice)}`,
      valueClasses: "text-h3 text-9B9B9B mt-1",
    },
    {
      title: "Your Bond",
      value: `${weiAsAmount(info.bondContribution)} NPM-USDC LP`,
      titleClasses: `mt-7 ${!account && "hidden"}`,
      valueClasses: `text-sm text-9B9B9B mt-1 ${!account && "hidden"}`,
    },
  ];

  const details = mergeAlternatively(leftHalf, rightHalf, {
    title: "",
    value: "",
  });

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

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
        <div className="receive mt-16">
          <ReceiveAmountInput
            labelText="You Will Receive"
            tokenSymbol="NPM"
            inputValue={receiveAmount}
          />
        </div>

        <div className="unlock mt-16">
          <Label className="mb-2" htmlFor="unlock-on">
            Will Unlock On
          </Label>
          <p
            id="unlock-on"
            className="text-7398C0 text-h4 font-medium"
            title={getToolTipDate(unlockTimestamp)}
          >
            {unixToDate(unlockTimestamp, "MMMM DD, YYYY hh:mm:ss A")} UTC
          </p>
        </div>

        {!canBond ? (
          <RegularButton
            disabled={isError || approving || !value}
            className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
            onClick={handleApprove}
          >
            {approving ? "Approving..." : <>Approve NPM-USDC LP</>}
          </RegularButton>
        ) : (
          <RegularButton
            disabled={isError || bonding}
            className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
            onClick={handleBond}
          >
            {bonding ? "Bonding..." : "Bond NPM-USDC LP"}
          </RegularButton>
        )}
      </div>
      <div>
        <BondInfoCard
          handleClaimModal={onOpen}
          details={details}
          roi={roi}
          claimable={info.claimable}
          vestingPeriod={vestingTermDays}
        />
      </div>

      {isGreater(info.claimable, "0") && (
        <ClaimBondModal
          isOpen={isOpen}
          onClose={onClose}
          modalTitle={"Claim Bond"}
          unlockDate={info.unlockDate}
          claimable={info.claimable}
        />
      )}
    </Container>
  );
};

export default BondPage;
