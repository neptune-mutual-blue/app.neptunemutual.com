import { useEffect, useState } from 'react'
import { InsightsTitle } from '@/src/modules/insights/InsightsTitle'
import { useNetworkStats } from '@/src/hooks/useNetworkStats'
import { useProtocolDayData } from '@/src/hooks/useProtocolDayData'
import { useProtocolUsersData } from '@/src/hooks/useProtocolUsersData'
import { useFetchInsightsTVLStats } from '@/src/services/aggregated-stats/insights'
import useCoverEarningInsights from '@/src/hooks/useCoverEarningInsights'
import PreviousNext from '@/common/PreviousNext'
import { InsightsStats } from '@/modules/insights/InsightsStats'
import { InsightsTVLTable } from '@/modules/insights/InsightsTVLTable'
import CoverEarning from '@/modules/insights/CoverEarning'
import { TotalCapacityChart } from '@/common/TotalCapacityChart'
import { TopAccounts } from '@/modules/insights/TopAccounts'
import { TOP_ACCOUNTS_ROWS_PER_PAGE } from '@/src/config/constants'
import Consensus from '@/modules/insights/Consensus'
import { InsightsQuickInfoTable } from './InsightsQuickInfoTable'
import ConsensusDetails from '@/modules/insights/ConsensusDetails'
import { BackButton } from '@/common/BackButton/BackButton'
import { useConsensusInsights } from '@/src/hooks/useConsensusInsights'
import { useFlattenedCoverProducts } from '@/src/hooks/useFlattenedCoverProducts'

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

export const InsightsContent = () => {
  const [selected, setSelected] = useState(DROPDOWN_OPTIONS.find((option) => option.value === AllDropdownOptions.TVL_DISTRIBUTION))

  const { data: statsData, loading } = useNetworkStats()

  const { data: { totalCovered, totalLiquidity, totalCapacity }, fetchData: fetchProtocolDayData } = useProtocolDayData(false)
  const { data: userData } = useProtocolUsersData()

  const { data: flattenedCovers, loading: flattenedCoversLoading, fetchData: fetchFlattenedCoversData } = useFlattenedCoverProducts(false, true, true)

  const { data: TVLStats, loading: tvlStatsLoading } = useFetchInsightsTVLStats()

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
  } = useCoverEarningInsights()

  const {
    data: consensusData,
    loading: consensusLoading,
    fetchData: fetchConsensusData,
    setData: setConsensusData
  } = useConsensusInsights()

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

    if (selected.value === AllDropdownOptions.QUICK_INFO) {
      fetchFlattenedCoversData()
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

  const getInsightsComponent = () => {
    switch (selected.value) {
      case AllDropdownOptions.TVL_DISTRIBUTION:
        return (
          <>
            <InsightsStats loading={loading} statsData={statsData} />
            <InsightsTVLTable data={TVLStats} loading={tvlStatsLoading} />
          </>
        )
      case AllDropdownOptions.QUICK_INFO:
        return (
          <>
            <InsightsStats loading={loading} statsData={statsData} />
            <InsightsQuickInfoTable flattenedCovers={flattenedCovers} loading={flattenedCoversLoading} />
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
      <InsightsTitle
        setSelected={setSelected}
        selected={selected}
        options={DROPDOWN_OPTIONS}
        trailing={consensusIndex === -1 ? null : getTrailingTitleComponent()}
        title={consensusIndex !== -1 ? 'Consensus Details' : undefined}
        trailAfterDropdownInMobile={selected.value === AllDropdownOptions.COVER_EARNINGS}
        leading={leading}
      />

      <div>
        {consensusIndex !== -1
          ? (
            <ConsensusDetails
              consensusIndex={consensusIndex}
              data={consensusData}
              setConsensusIndex={setConsensusIndex}
            />
            )
          : getInsightsComponent()}
      </div>
    </>
  )
}
