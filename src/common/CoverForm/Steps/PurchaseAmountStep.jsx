import { InputWithTrailingButton } from '@/common/Input/InputWithTrailingButton'
import { formatCurrency } from '@/utils/formatter/currency'
import { t, Trans } from '@lingui/macro'
import { useRouter } from 'next/router'

const PurchaseAmountStep = ({ handleChange, error, liquidityTokenSymbol, liquidityTokenDecimals, value, approving, purchasing, availableLiquidity }) => {
  const router = useRouter()

  return (
    <>
      <p className='font-bold text-center text-receipt-info text-01052D'><Trans>How Much Protection Do You Require?</Trans></p>
      <p className='mt-1 mb-8 text-lg text-center text-999BAB'>Don&apos;t worry, you&apos;re not required to make a purchase just yet.</p>
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
          allowNegativeValue: false
        }}
      />
      {error && error !== 'Please connect your wallet' && <p className='flex items-center text-FA5C2F'>{error}</p>}

      <div className='w-full px-8 py-6 mt-8 text-center rounded-lg bg-F3F5F7'>Maximum Available {formatCurrency(availableLiquidity, router.locale).short}</div>
    </>
  )
}

export default PurchaseAmountStep
