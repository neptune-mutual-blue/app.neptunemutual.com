import { useRouter } from 'next/router'

import { CoverResolutionSources } from '@/common/Cover/CoverResolutionSources'
import { useCoverStatsContext } from '@/common/Cover/CoverStatsContext'
import { useAppConstants } from '@/src/context/AppConstants'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { Trans } from '@lingui/macro'

export const DedicatedLiquidityResolutionSources = ({
  coverInfo,
  info,
  children
}) => {
  const router = useRouter()
  const { reportingPeriod } = useCoverStatsContext()

  const { liquidityTokenDecimals } = useAppConstants()

  const totalLiquidity = info.totalLiquidity
  const reassuranceAmount = info.totalReassurance

  return (
    <CoverResolutionSources
      resolutionSources={coverInfo?.infoObj.resolutionSources || []}
      reportingPeriod={reportingPeriod}
    >
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
