import { Label } from "@/components/UI/atoms/label";
import { InputWithTrailingButton } from "@/components/UI/atoms/input/with-trailing-button";
import { TokenBalance } from "@/components/UI/molecules/token-balance";

export const TokenAmountInput = ({
  tokenAddress,
  tokenSymbol,
  labelText = null,
  handleChooseMax,
  inputValue,
  inputId,
  onInput,
  tokenBalance,
  error,
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
        }}
        unit={tokenSymbol}
        inputProps={{
          id: inputId,
          placeholder: "Enter Amount",
          value: inputValue,
          onChange: onInput,
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
