import { Label } from "@/common/Label/Label";
import { InputWithTrailingButton } from "@/common/Input/InputWithTrailingButton";
import { TokenBalance } from "@/common/TokenBalance";
import { t } from "@lingui/macro";

export const TokenAmountInput = ({
  tokenAddress,
  tokenSymbol,
  labelText,
  handleChooseMax,
  inputValue,
  inputId,
  onChange,
  tokenBalance,
  tokenDecimals = 12,
  error,
  disabled,
  children,
  ...rest
}) => {
  return (
    <>
      {labelText && (
        <Label htmlFor={inputId} className="mb-4 font-semibold uppercase">
          {labelText}
        </Label>
      )}
      <InputWithTrailingButton
        decimalLimit={typeof tokenDecimals === "number" ? tokenDecimals : 12}
        error={error}
        buttonProps={{
          children: t`Max`,
          onClick: handleChooseMax,
          disabled: disabled,
        }}
        unit={tokenSymbol}
        inputProps={{
          id: inputId,
          disabled: disabled,
          placeholder: t`Enter Amount`,
          value: inputValue,
          onChange: onChange,
          allowNegativeValue: false,
          ...rest,
        }}
      />
      <TokenBalance
        tokenAddress={tokenAddress}
        tokenDecimals={tokenDecimals}
        balance={tokenBalance}
        unit={tokenSymbol}
      >
        {children}
      </TokenBalance>
    </>
  );
};
