import { useRouter } from 'next/router'

import { useAppConstants } from '@/src/context/AppConstants'
import { StatsCard } from '@/src/modules/insights/StatsCard'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { Trans } from '@lingui/macro'

export const InsightsStats = ({ loading, statsData }) => {
  const router = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()

  return (
    <div>
      {loading ? <Trans>loading...</Trans> : <StatDisplay liquidityTokenDecimals={liquidityTokenDecimals} router={router} statsData={statsData} />}
    </div>
  )
}

const StatDisplay = ({ liquidityTokenDecimals, router, statsData }) => (
  <div className='grid flex-wrap items-start justify-between pb-6 grid-cols-analytics-stat-cards lg:flex lg:pb-10 gap-x-2 gap-y-4'>
    <StatsCard
      titleClass='text-999BAB lg:text-404040'
      valueClass='uppercase'
      title='Total Capacity'
      value={
        formatCurrency(
          convertFromUnits(
            statsData?.combined?.totalCapacity || 0,
            liquidityTokenDecimals
          ).toString(),
          router.locale
        ).short
      }
      tooltip={
        formatCurrency(
          convertFromUnits(
            statsData?.combined?.totalCapacity || 0,
            liquidityTokenDecimals
          ).toString(),
          router.locale
        ).long
      }
    />
    <StatsCard
      titleClass='text-999BAB lg:text-404040'
      valueClass='uppercase'
      title='Covered'
      value={
        formatCurrency(
          convertFromUnits(
            statsData?.combined?.totalCoveredAmount,
            liquidityTokenDecimals
          ).toString(),
          router.locale
        ).short
      }
      tooltip={
        formatCurrency(
          convertFromUnits(
            statsData?.combined?.totalCoveredAmount,
            liquidityTokenDecimals
          ).toString(),
          router.locale
        ).long
      }
    />
    <StatsCard
      titleClass='text-999BAB lg:text-404040'
      valueClass='uppercase'
      title='Commitment' value={
        formatCurrency(
          convertFromUnits(
            statsData?.combined?.activeCoveredAmount,
            liquidityTokenDecimals
          ).toString(),
          router.locale
        ).short
      }
      tooltip={
        formatCurrency(
          convertFromUnits(
            statsData?.combined?.activeCoveredAmount,
            liquidityTokenDecimals
          ).toString(),
          router.locale
        ).long
      }
    />
    <StatsCard
      titleClass='text-999BAB lg:text-404040'
      valueClass='uppercase'
      title='Cover Fee'
      value={
        formatCurrency(
          convertFromUnits(
            statsData?.combined?.totalCoverFee,
            liquidityTokenDecimals
          ).toString(),
          router.locale
        ).short
      }
      tooltip={
        formatCurrency(
          convertFromUnits(
            statsData?.combined?.totalCoverFee,
            liquidityTokenDecimals
          ).toString(),
          router.locale
        ).long
      }
    />
  </div>
)
