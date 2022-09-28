import { useRouter } from 'next/router'
import { CoverResolutionSources } from '@/common/Cover/CoverResolutionSources'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { Trans } from '@lingui/macro'
import { useAppConstants } from '@/src/context/AppConstants'

export const DedicatedLiquidityResolutionSources = ({
  coverInfo,
  info,
  children
}) => {
  const router = useRouter()

  const { liquidityTokenDecimals } = useAppConstants()

  const totalLiquidity = info.totalLiquidity
  const reassuranceAmount = info.totalReassurance

  return (
    <CoverResolutionSources coverInfo={coverInfo}>
      <hr className='mt-4 mb-6 border-t border-B0C4DB/60' />
      <div
        className='flex justify-between pb-2'
        title={
          formatCurrency(
            convertFromUnits(totalLiquidity, liquidityTokenDecimals),
            router.locale
          ).long
        }
      >
        <span className=''>
          <Trans>Total Liquidity:</Trans>
        </span>
        <strong className='font-bold text-right'>
          {
            formatCurrency(
              convertFromUnits(totalLiquidity, liquidityTokenDecimals),
              router.locale
            ).short
          }
        </strong>
      </div>
      <div
        className='flex justify-between'
        title={
          formatCurrency(
            convertFromUnits(reassuranceAmount, liquidityTokenDecimals),
            router.locale
          ).long
        }
      >
        <span className=''>
          <Trans>Reassurance:</Trans>
        </span>
        <strong className='font-bold text-right'>
          {
            formatCurrency(
              convertFromUnits(reassuranceAmount, liquidityTokenDecimals),
              router.locale
            ).short
          }
        </strong>
      </div>

      {children}
    </CoverResolutionSources>
  )
}
