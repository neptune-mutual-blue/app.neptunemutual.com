import { t } from '@lingui/macro'
import { InputWithTrailingButton } from '@/common/Input/InputWithTrailingButton'

export const AmountHandler = ({ liquidityTokenSymbol, liquidityTokenDecimals, error, approving, purchasing, value, handleChange }) => {
  return (
    <div>
      <InputWithTrailingButton
        decimalLimit={liquidityTokenDecimals}
        error={!!error}
        buttonProps={{
          children: t`Max`,
          onClick: () => {},
          disabled: approving || purchasing,
          buttonClassName: 'hidden'
        }}
        unit={liquidityTokenSymbol}
        unitClass='!text-black font-semibold'
        inputProps={{
          id: 'cover-amount',
          disabled: approving || purchasing,
          placeholder: t`Enter Amount`,
          value: value,
          onChange: handleChange,
          allowNegativeValue: false,
          className: 'py-3 pl-3'
        }}
      />
    </div>
  )
}
