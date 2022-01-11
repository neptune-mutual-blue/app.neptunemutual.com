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

  const handleUnstakedAmtChange = (e) => {
    setUnstakedAmount(e.target.value);
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
      <div className="flex flex-wrap items-start gap-6 mb-11">
        <div>
          <TokenAmountInput
            tokenSymbol={"NPM"}
            handleChooseMax={handleChooseMax}
            inputValue={unstakedAmount}
            inputId={"reporting-unstake"}
            onInput={handleUnstakedAmtChange}
          />
        </div>
        <RegularButton
          className={"flex-auto px-8 py-6 text-h5 font-bold whitespace-nowrap"}
          onClick={handleUnstakeClick}
          disabled={!unstakedAmount && true}
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
