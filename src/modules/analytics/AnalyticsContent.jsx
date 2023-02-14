import { useState, useEffect } from 'react'
import { AnalyticsTitle } from '@/src/modules/analytics/AnalyticsTitle'
import { useNetworkStats } from '@/src/hooks/useNetworkStats'
import useCoverEarningAnalytics from '@/src/hooks/useCoverEarningAnalytics'
import PreviousNext from '@/common/PreviousNext'
import { AnalyticsStats } from '@/modules/analytics/AnalyticsStats'
import { AnalyticsTVLTable } from '@/modules/analytics/AnalyticsTVLTable'
import CoverEarning from '@/modules/analytics/CoverEarning'
import Consensus from '@/modules/analytics/Consensus'

const AllDropdownOptions = {
  TVL_DISTRIBUTION: 'TVL Distribution',
  QUICK_INFO: 'Quick Info',
  GROWTH: 'Growth',
  DEMAND: 'Demand',
  COVER_TVL: 'Cover TVL',
  POOL_TVL: 'Pool TVL',
  OTHER_INSIGHTS: 'Other Insights',
  TOP: 'Top Accounts',
  PREMIUM: 'Premium Earned',
  COVER_EARNINGS: 'Cover Earnings',
  IN_CONSENSUS: 'In Consensus'
}

const dropdownLabels = [AllDropdownOptions.GROWTH, AllDropdownOptions.OTHER_INSIGHTS]

const DROPDOWN_OPTIONS = Object.values(AllDropdownOptions).map(value => ({
  label: value, value: value, type: dropdownLabels.includes(value) ? 'label' : 'option'
}))

export const AnalyticsContent = () => {
  const [selectedValue, setSelectedValue] = useState(AllDropdownOptions.IN_CONSENSUS)
  const [selected, setSelected] = useState(DROPDOWN_OPTIONS.find((option) => option.value === AllDropdownOptions.IN_CONSENSUS))

  useEffect(() => {
    if (selected) {
      setSelectedValue(selected.value)
    }
  }, [selected])

  const { data: statsData, loading } = useNetworkStats()

  const { hasNext: coverEarningHasNext, hasPrevious: coverEarningHasPrevious, labels, onNext: onCoverEarningNext, onPrevious: onCoverEarningPrevious, yAxisData } = useCoverEarningAnalytics()
  const stats = (
    <div className='text-21AD8C text-sm leading-5'>
      {loading ? '' : `${statsData?.combined?.availableCovers} Covers, ${statsData?.combined?.reportingCovers} Reporting`}
    </div>
  )

  const getTrailingTitleComponent = () => {
    switch (selectedValue) {
      case AllDropdownOptions.TVL_DISTRIBUTION:
        return stats
      case AllDropdownOptions.COVER_EARNINGS:
        return (
          <PreviousNext onNext={onCoverEarningNext} onPrevious={onCoverEarningPrevious} hasNext={coverEarningHasNext} hasPrevious={coverEarningHasPrevious} />
        )
      case AllDropdownOptions.IN_CONSENSUS:
        return stats
      default:
        return null
    }
  }

  const getAnalyticsComponent = () => {
    switch (selectedValue) {
      case AllDropdownOptions.TVL_DISTRIBUTION:
        return (
          <>
            <AnalyticsStats loading={loading} statsData={statsData} />
            <AnalyticsTVLTable />
          </>
        )
      case AllDropdownOptions.COVER_EARNINGS:
        return (
          <CoverEarning labels={labels} yAxisData={yAxisData} />
        )
      case AllDropdownOptions.IN_CONSENSUS:
        return (
          <Consensus />
        )
      default:
        return null
    }
  }

  return (
    <>
      <AnalyticsTitle setSelected={setSelected} selected={selected} options={DROPDOWN_OPTIONS} trailing={getTrailingTitleComponent()} />

      <div className='overflow-hidden' style={{ maxHeight: '458px' }}>
        {getAnalyticsComponent()}
      </div>

    </>
  )
}
