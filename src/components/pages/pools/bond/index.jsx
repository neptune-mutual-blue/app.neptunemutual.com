import { Label } from "@/components/UI/atoms/label";
import { useState } from "react";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Container } from "@/components/UI/atoms/container";
import { BondsCard } from "@/components/UI/organisms/pools/card";
import { useBondInfo } from "@/components/pages/pools/bond/useBondInfo";
import { useUnlockDate } from "@/components/pages/pools/bond/useUnlockDate";
import { ClaimBondModal } from "@/components/UI/organisms/pools/bond/claim-bond-modal";
import { mergeAlternatively } from "@/utils/arrays";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { ReceiveAmountInput } from "@/components/UI/organisms/receive-amount-input";

const BondPage = () => {
  const [value, setValue] = useState();
  const [receiveAmount, setReceiveAmount] = useState();
  const [yourBondDisplay, setYourBondDisplay] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const maxValue = 50000;
  const { bondInfo } = useBondInfo();
  const { unlockDate } = useUnlockDate();

  //card value on the right
  const leftHalf = [
    {
      title: "Bond Price",
      value: `$${parseFloat(bondInfo?.bondPrice).toFixed(4)}`,
      valueClasses: "text-h3 text-4e7dd9 mt-1",
    },
    {
      title: "Maximum Bond",
      value: `${bondInfo?.max_bond} NPM`,
      valueClasses: "text-sm text-9B9B9B mt-1",
      titleClasses: "mt-7",
    },
  ];

  const rightHalf = [
    {
      title: "Market Price",
      value: `$${parseFloat(bondInfo?.marketPrice).toFixed(4)}`,
      valueClasses: "text-h3 text-9B9B9B mt-1",
    },
    {
      title: "Your Bond",
      value: `${bondInfo?.bonded} NPM`,
      titleClasses: `mt-7 ${!yourBondDisplay && "hidden"}`,
      valueClasses: `text-sm text-9B9B9B mt-1 ${!yourBondDisplay && "hidden"}`,
    },
  ];

  const details = mergeAlternatively(leftHalf, rightHalf, {
    title: "",
    value: "",
  });

  const handleChange = (val) => {
    if (typeof val === "string") {
      const willRecieve = parseFloat(0.99 * val).toFixed(2);
      console.log(typeof val, val * 0.99);
      setValue(val);
      setReceiveAmount(willRecieve);
    }
  };

  const handleApprove = () => {
    setShowButton(true);
    setYourBondDisplay(true);
  };

  const handleClaimModal = () => {
    onOpen();
  };

  const handleChooseMax = () => {
    setValue(maxValue);
    setReceiveAmount(parseFloat(0.99 * maxValue).toFixed(2));
  };

  function onClose() {
    setIsOpen(false);
  }

  function onOpen() {
    setIsOpen(true);
  }

  if (!bondInfo) {
    return <>loading...</>;
  }

  return (
    <Container className={"grid gap-16 grid-cols-1 lg:grid-cols-3 pt-16 pb-36"}>
      <div className="max-w-lg col-span-2">
        <div className="input-pool">
          <TokenAmountInput
            tokenSymbol={"NPM-USDC LP"}
            labelText={"Enter your amount"}
            handleChooseMax={handleChooseMax}
            inputValue={value}
            id={"bond-amount"}
            onInput={handleChange}
          />
        </div>
        <div className="receive mt-16">
          <ReceiveAmountInput
            labelText="You Will Receive"
            tokenSymbol="NPM"
            inputValue={receiveAmount}
            inputId="bond-liquidity-receive"
          />
        </div>

        <div className="unlock mt-16">
          <Label className="mb-2" htmlFor="unlock-on">
            Will Unlock On
          </Label>
          <p id="unlock-on" className="text-7398C0 text-h4 font-medium">
            {unlockDate ? unlockDate : <>Loading... !!</>}
          </p>
        </div>

        <RegularButton
          className={"w-full mt-8 p-6 text-h6 uppercase font-semibold"}
          onClick={handleApprove}
          disabled={!value}
        >
          Approve NPM-USDC LP
        </RegularButton>
      </div>
      <div>
        <BondsCard
          handleClaimModal={handleClaimModal}
          showButton={showButton}
          details={details}
          ROI={bondInfo.roi}
          vestingPeriod={bondInfo.vestingPeriod}
        />
      </div>
      {unlockDate && (
        <ClaimBondModal
          isOpen={isOpen}
          onClose={onClose}
          modalTitle={"Claim Bond"}
          unlockDate={unlockDate}
          claimableBond={bondInfo?.bonded}
        />
      )}
    </Container>
  );
};

export default BondPage;
