import ArrowRight from '@/icons/ArrowRight'
import { actions } from '@/src/config/cover/actions'
import { useAppConstants } from '@/src/context/AppConstants'
import { isValidProduct } from '@/src/helpers/cover'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { useRouter } from 'next/router'

export const PolicyCalculation = ({
  feeData,
  loading,
  selected,
  amount
}) => {
  const router = useRouter()
  const { liquidityTokenDecimals, liquidityTokenSymbol } = useAppConstants()

  const coverFee = convertFromUnits(feeData?.fee || '', liquidityTokenDecimals).toString()
  const formattedCoverFee = formatCurrency(
    coverFee,
    router.locale,
    liquidityTokenSymbol,
    true
  ).short
  const coverRate = Number(feeData?.rate || '0') / 100

  const handleBuyCover = () => {
    const link = actions.purchase.getHref(
      selected?.coverKey,
      isValidProduct(selected?.productKey) ? selected?.productKey : ''
    )

    const routerObject = {
      pathname: link
    }

    if (amount) routerObject.query = { amount }
    router.push(routerObject)
  }

  return (
    <div>
      <div className='block pb-2 text-sm font-normal uppercase font-poppins text-01052D'>
        Your policy fee is
      </div>
      <div className='flex items-end justify-between'>

        <div
          className='block text-lg font-semibold leading-6 uppercase text-01052D'
          title={
            !loading
              ? formatCurrency(
                coverFee,
                router.locale,
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
