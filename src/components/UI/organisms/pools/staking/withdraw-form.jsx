import { RegularButton } from "@/components/UI/atoms/button/regular";
import { InputWithTrailingButton } from "@/components/UI/atoms/input/with-trailing-button";
import { Label } from "@/components/UI/atoms/label";
import { TokenBalance } from "@/components/UI/molecules/token-balance";
import { amountFormatter } from "@/utils/formatter";
import { useState } from "react";

export const WithdrawForm = ({ onWithdraw, unitName }) => {
  const [amtToWithdraw, setAmtToWithdraw] = useState();

  const handleChooseMax = () => {
    const MAX_VALUE_TO_WITHDRAW = 10000;
    setAmtToWithdraw(MAX_VALUE_TO_WITHDRAW);
  };

  const handleChange = (e) => {
    setAmtToWithdraw(e.target.value);
  };

  return (
    <div className="px-12">
      <Label className="font-semibold mb-4 mt-6 uppercase">
        Amount You wish to withdraw
      </Label>
      <InputWithTrailingButton
        value={amtToWithdraw}
        buttonProps={{
          children: "Max",
          onClick: handleChooseMax,
        }}
        inputProps={{
          id: "withdraw-amount",
          placeholder: "Enter Amount",
          value: amtToWithdraw,
          onChange: handleChange,
        }}
        unit={unitName}
      />
      <TokenBalance value={amtToWithdraw} unit={unitName} />

      <RegularButton
        onClick={onWithdraw}
        className={"w-full mt-8 p-6 text-h6 uppercase font-semibold"}
      >
        Collect
      </RegularButton>
    </div>
  );
};
