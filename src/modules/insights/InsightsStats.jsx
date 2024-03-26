import { Loading } from '@/common/Loading'
import { useLanguageContext } from '@/src/i18n/i18n'
import { StatsCard } from '@/src/modules/insights/StatsCard'
import { formatCurrency } from '@/utils/formatter/currency'

export const InsightsStats = ({ loading, statsData }) => {
  const { locale } = useLanguageContext()

  return (
    <div>
      {loading ? <Loading /> : <StatDisplay locale={locale} statsData={statsData} />}
    </div>
  )
}

const StatDisplay = ({ locale, statsData }) => {
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
          locale
        ).short
      }
        tooltip={
        formatCurrency(
          statsData?.combined?.totalCapacity || 0,
          locale
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
          locale
        ).short
      }
        tooltip={
        formatCurrency(
          statsData?.combined?.totalCoveredAmount,
          locale
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
          locale
        ).short
      }
        tooltip={
        formatCurrency(
          statsData?.combined?.activeCoveredAmount,
          locale
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
          locale
        ).short
      }
        tooltip={
        formatCurrency(
          statsData?.combined?.totalCoverFee,
          locale
        ).long
      }
      />
    </div>
  )
}
