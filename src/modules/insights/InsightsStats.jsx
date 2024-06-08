import { useRouter } from 'next/router'

import { Loading } from '@/common/Loading'
import { StatsCard } from '@/src/modules/insights/StatsCard'
import { formatCurrency } from '@/utils/formatter/currency'
import { toBN } from '@/utils/bn'
import { useMemo } from 'react'

export const InsightsStats = ({ loading, tvlDistribution }) => {
  const router = useRouter()
  const locale = router.locale

  const {
    totalCapacity,
    totalCoveredAmount,
    activeCoveredAmount,
    totalCoverFee
  } = useMemo(() => {
    return tvlDistribution.reduce((acc, item) => {
      acc.totalCapacity = acc.totalCapacity.plus(item.capacity || 0)
      acc.totalCoveredAmount = acc.totalCoveredAmount.plus(item.covered || 0)
      acc.activeCoveredAmount = acc.activeCoveredAmount.plus(item.commitment || 0)
      acc.totalCoverFee = acc.totalCoverFee.plus(item.coverFeeEarned || 0)

      return acc
    }, {
      totalCapacity: toBN(0),
      totalCoveredAmount: toBN(0),
      activeCoveredAmount: toBN(0),
      totalCoverFee: toBN(0)
    })
  }, [tvlDistribution])

  return (
    <div>
      {loading
        ? <Loading />
        : <StatDisplay
            locale={locale}
            totalCapacity={totalCapacity}
            totalCoveredAmount={totalCoveredAmount}
            activeCoveredAmount={activeCoveredAmount}
            totalCoverFee={totalCoverFee}
          />}
    </div>
  )
}

const StatDisplay = ({
  locale,
  totalCapacity,
  totalCoveredAmount,
  activeCoveredAmount,
  totalCoverFee
}) => {
  return (
    <div className='flex flex-wrap items-start justify-between pb-6 lg:pb-10 gap-x-2 gap-y-4'>
      <StatsCard
        className='min-w-120'
        titleClass='text-999BAB lg:text-404040'
        valueClass='uppercase'
        title='Total Capacity'
        titleTooltip='Total capacity of the all products combined'
        value={
        formatCurrency(
          totalCapacity,
          locale
        ).short
      }
        tooltip={
        formatCurrency(
          totalCapacity,
          locale
        ).long
      }
      />
      <StatsCard
        className='min-w-120'
        titleClass='text-999BAB lg:text-404040'
        valueClass='uppercase'
        title='Covered'
        titleTooltip='Total amount covered till date'
        value={
        formatCurrency(
          totalCoveredAmount,
          locale
        ).short
      }
        tooltip={
        formatCurrency(
          totalCoveredAmount,
          locale
        ).long
      }
      />
      <StatsCard
        className='min-w-120'
        titleClass='text-999BAB lg:text-404040'
        valueClass='uppercase'
        title='Commitment'
        titleTooltip='Active commitment - Sum of amount covered of all active policies'
        value={
        formatCurrency(
          activeCoveredAmount,
          locale
        ).short
      }
        tooltip={
        formatCurrency(
          activeCoveredAmount,
          locale
        ).long
      }
      />
      <StatsCard
        className='min-w-120'
        titleClass='text-999BAB lg:text-404040'
        valueClass='uppercase'
        title='Cover Fee'
        titleTooltip='Total fee collected from all policy purchases till date'
        value={
        formatCurrency(
          totalCoverFee,
          locale
        ).short
      }
        tooltip={
        formatCurrency(
          totalCoverFee,
          locale
        ).long
      }
      />
    </div>
  )
}
