import { Label } from "@/common/components/Label/Label";
import { InputWithTrailingButton } from "@/common/components/Input/InputWithTrailingButton";
import { TokenBalance } from "@/src/common/components/TokenBalance";

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
