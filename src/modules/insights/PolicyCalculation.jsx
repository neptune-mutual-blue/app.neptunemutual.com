import { useRouter } from 'next/router'

import ArrowRight from '@/icons/ArrowRight'
import { getActions } from '@/src/config/cover/actions'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { isValidProduct } from '@/src/helpers/cover'
import { useLanguageContext } from '@/src/i18n/i18n'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { useLingui } from '@lingui/react'

export const PolicyCalculation = ({
  feeData,
  loading,
  selected,
  amount
}) => {
  const router = useRouter()
  const { networkId } = useNetwork()
  const { liquidityTokenDecimals, liquidityTokenSymbol } = useAppConstants()
  const { locale } = useLanguageContext()

  const coverFee = convertFromUnits(feeData?.fee || '0', liquidityTokenDecimals).toString()
  const formattedCoverFee = formatCurrency(
    coverFee,
    locale,
    liquidityTokenSymbol,
    true
  ).short
  const coverRate = Number(feeData?.rate || '0') / 100

  const { i18n } = useLingui()

  const actions = getActions(i18n, networkId)

  const handleBuyCover = () => {
    const link = actions.purchase.getHref(
      selected?.coverKey,
      isValidProduct(selected?.productKey) ? selected?.productKey : ''
    )

    const routerObject = {
      pathname: link
    }

    if (amount) { routerObject.query = { amount } }
    router.push(routerObject)
  }

  return (
    <div>
      <div className='block pb-2 text-sm font-normal uppercase text-01052D'>
        Your policy fee is
      </div>
      <div className='flex items-end justify-between'>

        <div
          className='block text-lg font-semibold leading-6 uppercase text-01052D'
          title={
            !loading
              ? formatCurrency(
                coverFee,
                locale,
                liquidityTokenSymbol,
                true
              ).long
              : 'fetching...'
          }
        >
          {
            loading
              ? (
                <i className='capitalize'>Fetching fees...</i>
                )
              : (
                <>
                  {formattedCoverFee} ({coverRate}%)
                </>
                )
          }
        </div>
        <div>
          <button
            className='flex items-center gap-1 px-0 py-0 mx-0 my-0 text-sm font-bold leading-5 text-4B7EE1 disabled:cursor-not-allowed'
            onClick={handleBuyCover}
            disabled={!selected}
          >
            Buy Cover <ArrowRight className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  )
}
