import { Label } from "@/src/common/components/label";
import { InputWithTrailingButton } from "@/src/common/components/input/with-trailing-button";
import { TokenBalance } from "@/src/common/components/token-balance";

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
  allowNegative,
}) => {
  return (
    <>
      {labelText && (
        <Label htmlFor={inputId} className="mb-4 font-semibold uppercase">
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
          allowNegative: allowNegative ?? false,
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
