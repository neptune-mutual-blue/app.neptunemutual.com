import { useRouter } from 'next/router'

import { Loading } from '@/common/Loading'
import { StatsCard } from '@/src/modules/insights/StatsCard'
import { formatCurrency } from '@/utils/formatter/currency'

export const InsightsStats = ({ loading, statsData }) => {
  const router = useRouter()

  return (
    <div>
      {loading ? <Loading /> : <StatDisplay router={router} statsData={statsData} />}
    </div>
  )
}

const StatDisplay = ({ router, statsData }) => {
  return (
    <div className='flex flex-wrap items-start justify-between pb-6 lg:pb-10 gap-x-2 gap-y-4'>
      <StatsCard
        className='min-w-120'
        titleClass='text-999BAB lg:text-404040'
        valueClass='uppercase'
        title='Total Capacity'
        value={
        formatCurrency(
          statsData?.combined?.totalCapacity || 0,
          router.locale
        ).short
      }
        tooltip={
        formatCurrency(
          statsData?.combined?.totalCapacity || 0,
          router.locale
        ).long
      }
      />
      <StatsCard
        className='min-w-120'
        titleClass='text-999BAB lg:text-404040'
        valueClass='uppercase'
        title='Covered'
        value={
        formatCurrency(
          statsData?.combined?.totalCoveredAmount,
          router.locale
        ).short
      }
        tooltip={
        formatCurrency(
          statsData?.combined?.totalCoveredAmount,
          router.locale
        ).long
      }
      />
      <StatsCard
        className='min-w-120'
        titleClass='text-999BAB lg:text-404040'
        valueClass='uppercase'
        title='Commitment' value={
        formatCurrency(
          statsData?.combined?.activeCoveredAmount,
          router.locale
        ).short
      }
        tooltip={
        formatCurrency(
          statsData?.combined?.activeCoveredAmount,
          router.locale
        ).long
      }
      />
      <StatsCard
        className='min-w-120'
        titleClass='text-999BAB lg:text-404040'
        valueClass='uppercase'
        title='Cover Fee'
        value={
        formatCurrency(
          statsData?.combined?.totalCoverFee,
          router.locale
        ).short
      }
        tooltip={
        formatCurrency(
          statsData?.combined?.totalCoverFee,
          router.locale
        ).long
      }
      />
    </div>
  )
}
