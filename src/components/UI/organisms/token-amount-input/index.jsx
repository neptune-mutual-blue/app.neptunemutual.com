import { Label } from "@/components/UI/atoms/label";
import { InputWithTrailingButton } from "@/components/UI/atoms/input/with-trailing-button";
import { TokenBalance } from "@/components/UI/molecules/token-balance";

export const TokenAmountInput = ({
  tokenAddress,
  tokenSymbol,
  labelText,
  handleChooseMax,
  inputValue,
  inputId,
  onChange,
  tokenBalance,
  error,
  disabled,
  children,
}) => {
  return (
    <>
      {labelText && (
        <Label htmlFor={inputId} className="font-semibold mb-4 uppercase">
          {labelText}
        </Label>
      )}
      <InputWithTrailingButton
        error={error}
        buttonProps={{
          children: "Max",
          onClick: handleChooseMax,
          disabled: disabled,
        }}
        unit={tokenSymbol}
        inputProps={{
          id: inputId,
          disabled: disabled,
          placeholder: "Enter Amount",
          value: inputValue,
          onChange: onChange,
        }}
      />
      <TokenBalance
        tokenAddress={tokenAddress}
        balance={tokenBalance}
        unit={tokenSymbol}
      >
        {children}
      </TokenBalance>
    </>
  );
};
