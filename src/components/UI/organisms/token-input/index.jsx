import { Label } from "@/components/UI/atoms/label";
import { InputWithTrailingButton } from "@/components/UI/atoms/input/with-trailing-button";
import { TokenBalance } from "@/components/UI/molecules/token-balance";

export const TokenInput = ({
  address,
  tokenSymbol,
  labelText,
  handleChooseMax,
  inputValue,
  onInput,
}) => (
  <>
    <Label className="font-semibold mb-4 uppercase">{labelText}</Label>
    <InputWithTrailingButton
      value={inputValue}
      buttonProps={{
        children: "Max",
        onClick: handleChooseMax,
      }}
      unit={tokenSymbol}
      inputProps={{
        id: "amount",
        placeholder: "Enter Amount",
        value: inputValue,
        onChange: onInput,
      }}
    />
    <TokenBalance value={inputValue} unit={tokenSymbol} />
  </>
);
