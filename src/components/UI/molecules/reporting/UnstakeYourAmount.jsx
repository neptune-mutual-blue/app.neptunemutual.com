import { Alert } from "@/components/UI/atoms/alert";
import { RegularButton } from "@/components/UI/atoms/button/regular";
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
      <div className="flex flex-wrap items-center justify-between mb-11">
        <div className="max-w-lg">
          <TokenAmountInput
            labelText={"Unstake"}
            tokenSymbol={"NPM"}
            handleChooseMax={handleChooseMax}
            inputValue={unstakedAmount}
            inputId={"stake-to-cast-vote"}
            onInput={handleUnstakedAmtChange}
          />
        </div>
        <RegularButton className={"px-18 py-6"} onClick={handleUnstakeClick}>
          Unstake NPM
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
