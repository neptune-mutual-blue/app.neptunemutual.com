import { InputWithTrailingButton } from "@/components/UI/atoms/input/with-trailing-button";
import { Label } from "@/components/UI/atoms/label";
import Link from "next/link";
import { useState } from "react";
import OpenInNewIcon from "@/icons/open-in-new";
import AddCircleIcon from "@/icons/add-circle";
import { DisabledInput } from "@/components/UI/atoms/input/disabled-input";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Container } from "@/components/UI/atoms/container";
import { BondsCard } from "@/components/UI/organisms/pools/card";
import { useBondInfo } from "@/components/pages/pools/bond/useBondInfo";
import { useUnlockDate } from "@/components/pages/pools/bond/useUnlockDate";
import { ClaimBondModal } from "@/components/UI/organisms/pools/bond/claim-bond-modal";
import { mergeAlternatively } from "@/utils/arrays";

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
      valueClasses: "text-h3 text-4E7DD9 mt-1",
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

  const handleChange = (e) => {
    const willRecieve = parseFloat(0.99 * e.target.value).toFixed(2);
    setValue(e.target.value);
    setReceiveAmount(willRecieve);
  };

  const handleApprove = (e) => {
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
    <Container className={"grid gap-16 grid-cols-1 lg:grid-cols-3 mt-16 pb-36"}>
      <div className="max-w-lg col-span-2">
        <div className="input-pool">
          <Label className="mb-4" htmlFor="bond-amount">
            Enter your amount
          </Label>
          <InputWithTrailingButton
            buttonProps={{
              children: "Max",
              onClick: handleChooseMax,
            }}
            inputProps={{
              id: "bond-amount",
              placeholder: "Enter Amount",
              value: value,
              onChange: handleChange,
            }}
            unit={"NPM-USDC LP"}
          />
          <div className="flex justify-between items-start text-9B9B9B px-3 mt-2">
            <p>
              {value !== undefined && !isNaN(parseInt(value)) && (
                <>Balance: {value} NPM-USDC LP</>
              )}
            </p>
            <div className="flex">
              <Link href="#">
                <a className="ml-3">
                  <span className="sr-only">Open In New Tab</span>
                  <OpenInNewIcon fill="currentColor" />
                </a>
              </Link>
              <Link href="#">
                <a className="ml-3">
                  <span className="sr-only">Add to Metamask</span>
                  <AddCircleIcon fill="currentColor" />
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="receive mt-16">
          <Label className="mb-4" htmlFor="receive-amount">
            You will receive
          </Label>

          <DisabledInput value={receiveAmount} unit={"NPM"} />
        </div>

        <div className="unlock mt-16">
          <Label className="mb-2" htmlFor="bond-amount">
            Will Unlock On
          </Label>
          <p id="unlock-on" className="text-7398C0 text-h4 font-medium">
            {unlockDate ? unlockDate : <>Loading... !!</>}
          </p>
        </div>

        <RegularButton
          className={"w-full mt-8 p-6 text-h6 uppercase font-semibold"}
          onClick={handleApprove}
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
