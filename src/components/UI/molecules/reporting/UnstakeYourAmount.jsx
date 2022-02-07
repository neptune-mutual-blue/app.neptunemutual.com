import { Alert } from "@/components/UI/atoms/alert";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Label } from "@/components/UI/atoms/label";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { useReportingUnstake } from "@/src/hooks/useReportingUnstake";
import { convertFromUnits } from "@/utils/bn";
import { useState } from "react";

const maxAmtToStake = 500;

const UnstakeYourAmount = ({ coverKey, incidentDate }) => {
  const [value, setValue] = useState();
  const {
    tokenAddress,
    tokenSymbol,
    canUnstake,
    myStakeInWinningCamp,
    handleUnstake,
  } = useReportingUnstake({
    coverKey,
    incidentDate,
    value,
  });

  const handleChooseMax = () => {
    setValue(maxAmtToStake);
  };

  const handleValueChange = (val) => {
    if (typeof val === "string") {
      setValue(val);
    }
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
            inputId={"reporting-unstake"}
            inputValue={value}
            handleChooseMax={handleChooseMax}
            onChange={handleValueChange}
            tokenSymbol={tokenSymbol}
            tokenAddress={tokenAddress}
          >
            <p>
              Staked:{" "}
              {convertFromUnits(myStakeInWinningCamp)
                .decimalPlaces(2)
                .toString()}{" "}
              {tokenSymbol}
            </p>
          </TokenAmountInput>
        </div>
        <RegularButton
          className={
            "w-64 py-6 text-h5 font-bold whitespace-nowrap tracking-wider leading-6 text-EEEEEE"
          }
          onClick={handleUnstake}
          disabled={!canUnstake}
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
