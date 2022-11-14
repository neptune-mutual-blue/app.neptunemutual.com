import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import { isValidNumber } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { Trans } from '@lingui/macro'
import { useRouter } from 'next/router'

const PurchaseAmountStep = ({ handleChange, error, liquidityTokenAddress, liquidityTokenSymbol, liquidityTokenDecimals, balance, value, approving, purchasing, availableLiquidity }) => {
  const router = useRouter()

  return (
    <>
      <p className='font-bold text-center text-h4 text-01052D'><Trans>How Much Protection Do You Require?</Trans></p>
      <p className='mt-1 mb-8 text-lg text-center text-999BAB'>Don&apos;t worry, you&apos;re not required to make a purchase just yet.</p>
      <TokenAmountInput
        onChange={handleChange}
        error={!!error}
        handleChooseMax={() => {}}
        tokenAddress={liquidityTokenAddress}
        tokenSymbol={liquidityTokenSymbol}
        tokenDecimals={liquidityTokenDecimals}
        tokenBalance={balance}
        inputId='cover-amount'
        inputValue={value}
        disabled={approving || purchasing}
        buttonClassName='hidden'
      >
        {value && isValidNumber(value) && (
          <div
            className='flex items-center text-15aac8'
            title={formatCurrency(value, router.locale, 'cx' + liquidityTokenSymbol, true).long}
          >
            <p>
              <Trans>You will receive:</Trans>{' '}
              {formatCurrency(value, router.locale, 'cx' + liquidityTokenSymbol, true).short}
            </p>
          </div>
        )}
        {error && <p className='flex items-center text-FA5C2F'>{error}</p>}
      </TokenAmountInput>
      <div className='w-full px-8 py-6 mt-8 text-center rounded-lg bg-F3F5F7'>Maximum Available {formatCurrency(availableLiquidity, router.locale).short}</div>
    </>
  )
}

export default PurchaseAmountStep
