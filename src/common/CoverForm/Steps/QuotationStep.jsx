import {
  PolicyFeesAndExpiry
} from '@/common/PolicyFeesAndExpiry/PolicyFeesAndExpiry'
import { useLanguageContext } from '@/src/i18n/i18n'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { Trans } from '@lingui/macro'

const QuotationStep = ({ value, coverMonth, coverageLag, feeData, liquidityTokenDecimals, liquidityTokenSymbol, referralCode }) => {
  const { fee } = feeData
  const { locale } = useLanguageContext()

  const coverFee = convertFromUnits(fee, liquidityTokenDecimals).toString()

  return (
    <div className='mb-6'>
      <p className='text-lg text-center text-999BAB'><Trans>You Will Pay</Trans></p>
      <p
        className='mt-1 mb-8 font-bold text-center text-display-md text-4E7DD9'
        title={
                formatCurrency(
                  coverFee,
                  locale,
                  liquidityTokenSymbol,
                  true
                ).long
              }
      >{formatCurrency(
        coverFee,
        locale,
        liquidityTokenSymbol,
        true
      ).short}
      </p>
      <div className='w-full px-2 py-6 mt-8 text-center rounded-lg md:px-8 bg-F3F5F7'>
        {value && coverMonth && <PolicyFeesAndExpiry value={value} data={feeData} coverageLag={coverageLag} referralCode={referralCode} />}
      </div>
    </div>
  )
}

export default QuotationStep
