import { useEffect, useState } from 'react'
import { AnalyticsTitle } from '@/src/modules/analytics/AnalyticsTitle'
import { useNetworkStats } from '@/src/hooks/useNetworkStats'
import { useProtocolDayData } from '@/src/hooks/useProtocolDayData'
import { useProtocolUsersData } from '@/src/hooks/useProtocolUsersData'
import { useFetchAnalyticsTVLStats } from '@/src/services/aggregated-stats/analytics'
import useCoverEarningAnalytics from '@/src/hooks/useCoverEarningAnalytics'
import PreviousNext from '@/common/PreviousNext'
import { AnalyticsStats } from '@/modules/analytics/AnalyticsStats'
import { AnalyticsTVLTable } from '@/modules/analytics/AnalyticsTVLTable'
import CoverEarning from '@/modules/analytics/CoverEarning'
import { TotalCapacityChart } from '@/common/TotalCapacityChart'
import { TopAccounts } from '@/modules/analytics/TopAccounts'
import { TOP_ACCOUNTS_ROWS_PER_PAGE } from '@/src/config/constants'
import Consensus from '@/modules/analytics/Consensus'
import ConsensusDetails from '@/modules/analytics/ConsensusDetails'
import { BackButton } from '@/common/BackButton/BackButton'
import { useConsensusAnalytics } from '@/src/hooks/useConsensusAnalytics'

const AllDropdownOptions = {
  TVL_DISTRIBUTION: 'TVL Distribution',
  QUICK_INFO: 'Quick Info',
  GROWTH: 'Growth',
  DEMAND: 'Demand',
  COVER_TVL: 'Cover TVL',
  TOTAL_CAPACITY: 'Total Capacity',
  OTHER_INSIGHTS: 'Other Insights',
  TOP_ACCOUNTS: 'Top Accounts',
  COVER_EARNINGS: 'Cover Earnings',
  IN_CONSENSUS: 'In Consensus'
}

const dropdownLabels = [AllDropdownOptions.GROWTH, AllDropdownOptions.OTHER_INSIGHTS]

const DROPDOWN_OPTIONS = Object.values(AllDropdownOptions).map(value => ({
  label: value, value: value, type: dropdownLabels.includes(value) ? 'label' : 'option'
}))

export const AnalyticsContent = () => {
  const [selected, setSelected] = useState(DROPDOWN_OPTIONS.find((option) => option.value === AllDropdownOptions.TVL_DISTRIBUTION))

  const { data: statsData, loading } = useNetworkStats()

  const { data: { totalCovered, totalLiquidity, totalCapacity }, fetchData: fetchProtocolDayData } = useProtocolDayData(false)
  const { data: userData } = useProtocolUsersData()

  const { data: TVLStats, loading: tvlStatsLoading } = useFetchAnalyticsTVLStats()

  const [consensusIndex, setConsensusIndex] = useState(-1)

  const [currentPage, setCurrentPage] = useState(1)
  const {
    hasNext: coverEarningHasNext,
    hasPrevious: coverEarningHasPrevious,
    labels,
    onNext: onCoverEarningNext,
    onPrevious: onCoverEarningPrevious,
    yAxisData,
    fetchData: fetchCoverEarningData,
    loading: coverEarningLoading
  } = useCoverEarningAnalytics()

  const {
    data: consensusData,
    loading: consensusLoading,
    fetchData: fetchConsensusData,
    setData: setConsensusData
  } = useConsensusAnalytics()

  useEffect(() => {
    // Lazy loading data
    if (selected.value === AllDropdownOptions.IN_CONSENSUS) {
      fetchConsensusData()
    }

    if (selected.value === AllDropdownOptions.COVER_EARNINGS) {
      fetchCoverEarningData()
    }

    if ([AllDropdownOptions.COVER_TVL, AllDropdownOptions.DEMAND, AllDropdownOptions.TOTAL_CAPACITY].includes(selected.value)) {
      fetchProtocolDayData()
    }
    // eslint-disable-next-line
  }, [selected.value])

  const ReportLabels = (
    <div className='text-sm leading-5 text-21AD8C'>
      {tvlStatsLoading ? '' : `${statsData?.combined?.availableCovers} Covers, ${statsData?.combined?.reportingCovers} Reporting`}
    </div>
  )

  const getTrailingTitleComponent = () => {
    switch (selected.value) {
      case AllDropdownOptions.COVER_EARNINGS:
        return (
          <div className='mb-4'>
            <PreviousNext
              onNext={onCoverEarningNext}
              onPrevious={onCoverEarningPrevious}
              hasNext={coverEarningHasNext}
              hasPrevious={coverEarningHasPrevious}
            />
          </div>
        )
      case AllDropdownOptions.TOP_ACCOUNTS:
        return (
          <PreviousNext
            onNext={() => setCurrentPage(currentPage + 1)}
            onPrevious={() => setCurrentPage(currentPage - 1)}
            hasNext={currentPage < (Math.abs(userData.length / TOP_ACCOUNTS_ROWS_PER_PAGE))}
            hasPrevious={currentPage > 1}
          />
        )
      default:
        return ReportLabels
    }
  }

  const getAnalyticsComponent = () => {
    switch (selected.value) {
      case AllDropdownOptions.TVL_DISTRIBUTION:
        return (
          <>
            <AnalyticsStats loading={loading} statsData={statsData} />
            <AnalyticsTVLTable data={TVLStats} loading={tvlStatsLoading} />
          </>
        )

      case AllDropdownOptions.DEMAND:
        return <TotalCapacityChart data={totalCovered} />

      case AllDropdownOptions.COVER_TVL:
        return <TotalCapacityChart data={totalLiquidity} />

      case AllDropdownOptions.TOTAL_CAPACITY:
        return <TotalCapacityChart data={totalCapacity} />

      case AllDropdownOptions.TOP_ACCOUNTS:
        return <TopAccounts userData={userData} page={currentPage} />

      case AllDropdownOptions.COVER_EARNINGS:
        return (
          <CoverEarning labels={labels} yAxisData={yAxisData} loading={coverEarningLoading} />
        )

      case AllDropdownOptions.IN_CONSENSUS:
        return (
          <Consensus loading={consensusLoading} data={consensusData} setData={setConsensusData} setConsensusIndex={setConsensusIndex} />
        )

      default:
        return null
    }
  }

  const leading = consensusIndex !== -1
    ? (
      <BackButton
        onClick={() => {
          setConsensusIndex(-1)
        }}
        className='py-2.5 px-3 text-sm mr-4'
      />
      )
    : null

  return (
    <>
      <AnalyticsTitle
        setSelected={setSelected}
        selected={selected}
        options={DROPDOWN_OPTIONS}
        trailing={consensusIndex === -1 ? null : getTrailingTitleComponent()}
        title={consensusIndex !== -1 ? 'Consensus Details' : undefined}
        trailAfterDropdownInMobile={selected.value === AllDropdownOptions.COVER_EARNINGS}
        leading={leading}
      />

      <div>
        {consensusIndex !== -1 ? <ConsensusDetails consensusIndex={consensusIndex} data={consensusData} setConsensusIndex={setConsensusIndex} /> : getAnalyticsComponent()}
      </div>
    </>
  )
}
