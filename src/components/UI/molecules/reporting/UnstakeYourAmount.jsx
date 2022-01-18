import { Alert } from "@/components/UI/atoms/alert";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Label } from "@/components/UI/atoms/label";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { useState } from "react";

const maxAmtToStake = 500;

const UnstakeYourAmount = () => {
  const [unstakedAmount, setUnstakedAmount] = useState();

  const handleChooseMax = () => {
    setUnstakedAmount(maxAmtToStake);
  };

  const handleUnstakedAmtChange = (val) => {
    if (typeof val === "string") {
      setUnstakedAmount(val);
    }
  };

  const handleUnstakeClick = () => {
    console.log("unstake NPM clicked");
  };

  return (
    <>
      <Label
        htmlFor={"reporting-unstake"}
        className="font-semibold mb-4 uppercase"
      >
        {"Unstake"}
      </Label>
      <div className="flex flex-wrap items-start gap-8 mb-11">
        <div className="flex-auto">
          <TokenAmountInput
            tokenSymbol={"NPM"}
            handleChooseMax={handleChooseMax}
            inputValue={unstakedAmount}
            inputId={"reporting-unstake"}
            onChange={handleUnstakedAmtChange}
          />
        </div>
        <RegularButton
          className={
            "w-64 py-6 text-h5 font-bold whitespace-nowrap tracking-wider leading-6 text-EEEEEE"
          }
          onClick={handleUnstakeClick}
          disabled={!unstakedAmount}
        >
          UNSTAKE NPM
        </RegularButton>
      </div>
      <Alert>
        The incident has been resolved. Majority reporters can now unstake their
        token and claim the reward.
      </Alert>
    </>
  );
};

export default UnstakeYourAmount;
