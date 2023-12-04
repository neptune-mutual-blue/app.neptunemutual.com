import { InputWithTrailingButton } from '@/common/Input/InputWithTrailingButton'
import { Label } from '@/common/Label/Label'
import { TokenBalance } from '@/common/TokenBalance'
import { classNames } from '@/utils/classnames'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const TokenAmountInput = ({
  tokenAddress,
  tokenSymbol,
  labelText = '',
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
  useLingui()

  return (
    <div className={classNames(disabled && 'opacity-40 cursor-not-allowed')}>
      {labelText && (
        <Label htmlFor={inputId} className='mb-4 font-semibold uppercase'>
          {labelText}
        </Label>
      )}

      <InputWithTrailingButton
        error={error}
        buttonProps={{
          children: t`Max`,
          onClick: handleChooseMax,
          disabled: disabled,
          buttonClassName
        }}
        unit={tokenSymbol}
        inputProps={{
          id: inputId,
          disabled: disabled,
          placeholder: t`Enter Amount`,
          value: inputValue,
          onChange: onChange,
          allowNegativeValue: false,
          decimalsLimit: tokenDecimals,
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
