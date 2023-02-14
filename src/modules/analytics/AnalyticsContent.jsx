import { useState, useEffect } from 'react'
import { AnalyticsTitle } from '@/src/modules/analytics/AnalyticsTitle'
import { useNetworkStats } from '@/src/hooks/useNetworkStats'
import useCoverEarningAnalytics from '@/src/hooks/useCoverEarningAnalytics'
import PreviousNext from '@/common/PreviousNext'
import { AnalyticsStats } from '@/modules/analytics/AnalyticsStats'
import { AnalyticsTVLTable } from '@/modules/analytics/AnalyticsTVLTable'
import CoverEarning from '@/modules/analytics/CoverEarning'

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
  In: 'In Consensus'
}

const dropdownLabels = [AllDropdownOptions.GROWTH, AllDropdownOptions.OTHER_INSIGHTS]

const DROPDOWN_OPTIONS = Object.values(AllDropdownOptions).map(value => ({
  label: value, value: value, type: dropdownLabels.includes(value) ? 'label' : 'option'
}))

export const AnalyticsContent = () => {
  const [selectedValue, setSelectedValue] = useState(AllDropdownOptions.TVL_DISTRIBUTION)
  const [selected, setSelected] = useState(DROPDOWN_OPTIONS.find((option) => option.value === AllDropdownOptions.TVL_DISTRIBUTION))

  useEffect(() => {
    if (selected) {
      setSelectedValue(selected.value)
    }
  }, [selected])

  const { data: statsData, loading } = useNetworkStats()

  const { hasNext: coverEarningHasNext, hasPrevious: coverEarningHasPrevious, labels, onNext: onCoverEarningNext, onPrevious: onCoverEarningPrevious, yAxisData } = useCoverEarningAnalytics()

  const getTrailingTitleComponent = () => {
    switch (selectedValue) {
      case AllDropdownOptions.TVL_DISTRIBUTION:
        return (
          <div className='text-21AD8C text-sm leading-5'>
            {loading ? '' : `${statsData?.combined?.availableCovers} Covers, ${statsData?.combined?.reportingCovers} Reporting`}
          </div>
        )
      case AllDropdownOptions.COVER_EARNINGS:
        return (
          <PreviousNext onNext={onCoverEarningNext} onPrevious={onCoverEarningPrevious} hasNext={coverEarningHasNext} hasPrevious={coverEarningHasPrevious} />
        )
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
      default:
        return null
    }
  }

  return (
    <>
      <AnalyticsTitle setSelected={setSelected} selected={selected} options={DROPDOWN_OPTIONS} loading={loading} trailing={getTrailingTitleComponent()} />

      <div>
        {getAnalyticsComponent()}
      </div>

    </>
  )
}
