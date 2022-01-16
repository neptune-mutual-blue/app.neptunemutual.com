import { RegularButton } from "@/components/UI/atoms/button/regular";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { useState } from "react";

export const WithdrawForm = ({ onWithdraw, unitName }) => {
  const [amtToWithdraw, setAmtToWithdraw] = useState();

  const handleChooseMax = () => {
    const MAX_VALUE_TO_WITHDRAW = 10000;
    setAmtToWithdraw(MAX_VALUE_TO_WITHDRAW);
  };

  const handleChange = (val) => {
    if (typeof val === "string") {
      setAmtToWithdraw(val);
    }
  };

  return (
    <div className="px-12 mt-6">
      <TokenAmountInput
        inputId={"withdraw-amount"}
        inputValue={amtToWithdraw}
        handleChooseMax={handleChooseMax}
        labelText={"Amount you wish to withdraw"}
        onChange={handleChange}
        tokenSymbol={unitName}
      />

      <RegularButton
        onClick={onWithdraw}
        className={"w-full mt-8 p-6 text-h6 uppercase font-semibold"}
        disabled={!amtToWithdraw}
      >
        Collect
      </RegularButton>
    </div>
  );
};
