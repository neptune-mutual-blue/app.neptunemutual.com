import { InputWithTrailingButton } from '@/common/Input/InputWithTrailingButton'
import { Label } from '@/common/Label/Label'
import { TokenBalance } from '@/common/TokenBalance'
import { classNames } from '@/utils/classnames'

export const TokenAmountInput = ({
  tokenAddress,
  tokenSymbol,
  labelText = <></>,
  handleChooseMax,
  inputValue,
  inputId = '',
  onChange,
  tokenBalance = null,
  tokenDecimals = 18,
  error = false,
  disabled,
  children = null,
  buttonClassName = '',
  ...rest
}) => {
  return (
    <div className={classNames(disabled && 'opacity-40 cursor-not-allowed')}>
      {labelText && (
        <Label htmlFor={inputId} className='mb-4 font-semibold uppercase'>
          {labelText}
        </Label>
      )}

      <InputWithTrailingButton
        decimalLimit={tokenDecimals}
        error={error}
        buttonProps={{
          children: 'Max',
          onClick: handleChooseMax,
          disabled: disabled,
          buttonClassName
        }}
        unit={tokenSymbol}
        inputProps={{
          id: inputId,
          disabled: disabled,
          placeholder: 'Enter Amount',
          value: inputValue,
          onChange: onChange,
          allowNegativeValue: false,
          ...rest
        }}
      />
      <TokenBalance
        tokenAddress={tokenAddress}
        tokenDecimals={tokenDecimals}
        balance={tokenBalance}
        unit={tokenSymbol}
        disabled={disabled}
      >
        {children}
      </TokenBalance>

    </div>
  )
}
