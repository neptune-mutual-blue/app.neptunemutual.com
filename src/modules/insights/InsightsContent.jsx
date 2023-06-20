import {
  useEffect,
  useState
} from 'react'

import { BackButton } from '@/common/BackButton/BackButton'
import { OutlineButtonList } from '@/common/OutlineButtonList/OutlineButtonList'
import PreviousNext from '@/common/PreviousNext'
import { TotalCapacityChart } from '@/common/TotalCapacityChart'
import { AbbreviatedNetworkNames } from '@/lib/connect-wallet/config/chains'
import Consensus from '@/modules/insights/Consensus'
import ConsensusDetails from '@/modules/insights/ConsensusDetails'
import CoverEarning from '@/modules/insights/CoverEarning'
import { GasPriceSummary } from '@/modules/insights/GasPriceSummary'
import { HistoricalRoi } from '@/modules/insights/HistoricalRoi'
import { HistoricalRoiByCover } from '@/modules/insights/HistoricalRoiByCover'
import { InsightsStats } from '@/modules/insights/InsightsStats'
import { InsightsTVLTable } from '@/modules/insights/InsightsTVLTable'
import {
  ProtectionChart
} from '@/modules/insights/ProtectionChart/ProtectionChart'
import {
  TopAccountsByLiquidity
} from '@/modules/insights/TopAccountsByLiquidity'
import {
  TopAccountsByProtection
} from '@/modules/insights/TopAccountsByProtection'
import { TOP_ACCOUNTS_ROWS_PER_PAGE } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { useConsensusInsights } from '@/src/hooks/useConsensusInsights'
import useCoverEarningInsights from '@/src/hooks/useCoverEarningInsights'
import { useCoverInsightsData } from '@/src/hooks/useCoverInsightsData'
import { useGasSummaryData } from '@/src/hooks/useGasSummaryData'
import { useHistoricalData } from '@/src/hooks/useHistoricalData'
import {
  useHistoricalRoiDataByCover
} from '@/src/hooks/useHistoricalRoiByCover'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'
import { useNetworkStats } from '@/src/hooks/useNetworkStats'
import { useProtectionChartData } from '@/src/hooks/useProtectionChartData'
import { useProtocolDayData } from '@/src/hooks/useProtocolDayData'
import {
  useTopAccountsByLiquidity
} from '@/src/hooks/useTopAccountsByLiquidity'
import {
  useTopAccountsByProtection
} from '@/src/hooks/useTopAccountsByProtection'
import { InsightsTitle } from '@/src/modules/insights/InsightsTitle'
import {
  useFetchInsightsTVLStats
} from '@/src/services/aggregated-stats/insights'

import { InsightsQuickInfoTable } from './InsightsQuickInfoTable'

const AllDropdownOptions = {
  QUICK_INFO: 'Quick Info',
  TVL_DISTRIBUTION: 'TVL Distribution',
  GROWTH: 'Growth',
  HISTORICAL_ROI: 'LP\'s Historical ROI',
  HISTORICAL_ROI_BY_COVER: 'LP\'s Historical ROI by Cover',
  MONTHLY_DISTRIBUTION: 'Protection by Month (Distribution)',
  MONTHLY_EARNING: 'Protection by Month (Earning)',
  COVER_SOLD: 'Cover Sold by Pool',
  COVER_PREMIUM: 'Cover Premium by Pool',
  COVER_EXPIRING: 'Cover Expiring This Month',
  DEMAND: 'Demand',
  COVER_TVL: 'Cover TVL',
  TOTAL_CAPACITY: 'Total Capacity',
  OTHER_INSIGHTS: 'Other Insights',
  GAS_PRICE_SUMMARY: 'Gas Price Summary',
  TOP_ACCOUNTS_BY_PROTECTION: 'Top Accounts (Policy)',
  TOP_ACCOUNTS_BY_LIQUIDITY: 'Top Accounts (Liquidity)',
  COVER_EARNINGS: 'Cover Earnings',
  IN_CONSENSUS: 'In Consensus'
}

const dropdownLabels = [AllDropdownOptions.GROWTH, AllDropdownOptions.OTHER_INSIGHTS]

const DROPDOWN_OPTIONS = Object.values(AllDropdownOptions).map(value => {
  return {
    label: value, value: value, type: dropdownLabels.includes(value) ? 'label' : 'option'
  }
})

const FALLBACK_SELECTION = DROPDOWN_OPTIONS.find((option) => { return option.value === AllDropdownOptions.TOTAL_CAPACITY })

export const InsightsContent = () => {
  const [selected, setSelected] = useLocalStorage('current-insights', FALLBACK_SELECTION)

  const { data: statsData, loading } = useNetworkStats()

  const { data: { totalCovered, totalLiquidity, totalCapacity }, fetchData: fetchProtocolDayData } = useProtocolDayData(false)
  const { data: protectionTopAccounts, loading: protectionTopAccountsLoading, fetchTopAccountsByProtection } = useTopAccountsByProtection()
  const { data: liquidityTopAccounts, loading: liquidityTopAccountsLoading, fetchTopAccountsByLiquidity } = useTopAccountsByLiquidity()

  const { data: TVLStats, loading: tvlStatsLoading } = useFetchInsightsTVLStats()
  const { data: historicalData, loading: historicalDataLoading, fetchHistoricalData } = useHistoricalData()
  const { data: historicalDataByCover, loading: historicalDataByCoverLoading, fetchHistoricalDataByCover } = useHistoricalRoiDataByCover()

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

  const { data: protectionData, fetchMonthlyProtectionData, labels: protectionLabels, loading: protectionDataLoading } = useProtectionChartData()

  const { data: gasSummaryData, fetchGasSummary, loading: gasSummaryLoading } = useGasSummaryData()

  const {
    data: coverSoldOrPremiumData,
    fetchCoverSoldOrPremiumData,
    labels: soldOrPremiumLabels,
    loading: coverDataLoading
  } = useCoverInsightsData()

  const {
    data: consensusData,
    loading: consensusLoading,
    fetchData: fetchConsensusData
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

    if (selected.value === AllDropdownOptions.HISTORICAL_ROI) {
      fetchHistoricalData()
    }

    if (selected.value === AllDropdownOptions.HISTORICAL_ROI_BY_COVER) {
      fetchHistoricalDataByCover()
    }

    if (selected.value === AllDropdownOptions.GAS_PRICE_SUMMARY) {
      fetchGasSummary()
    }

    if ([AllDropdownOptions.MONTHLY_DISTRIBUTION, AllDropdownOptions.MONTHLY_EARNING].includes(selected.value)) {
      fetchMonthlyProtectionData()
    }

    if (selected.value === AllDropdownOptions.COVER_SOLD) {
      fetchCoverSoldOrPremiumData('sold')
    }

    if (selected.value === AllDropdownOptions.COVER_PREMIUM) {
      fetchCoverSoldOrPremiumData('premium')
    }

    if (selected.value === AllDropdownOptions.COVER_EXPIRING) {
      fetchCoverSoldOrPremiumData('expiring')
    }

    if (selected.value === AllDropdownOptions.TOP_ACCOUNTS_BY_LIQUIDITY) {
      fetchTopAccountsByLiquidity()
    }

    if (selected.value === AllDropdownOptions.TOP_ACCOUNTS_BY_PROTECTION) {
      fetchTopAccountsByProtection()
    }
  }, [
    fetchConsensusData,
    fetchCoverEarningData,
    fetchCoverSoldOrPremiumData,
    fetchGasSummary,
    fetchHistoricalData,
    fetchHistoricalDataByCover,
    fetchMonthlyProtectionData,
    fetchProtocolDayData,
    fetchTopAccountsByLiquidity,
    fetchTopAccountsByProtection,
    selected.value
  ])

  const ReportLabels = (
    <div className='text-sm leading-5 text-21AD8C'>
      {tvlStatsLoading ? '' : `${statsData?.combined?.availableCovers} Covers, ${statsData?.combined?.reportingCovers} Reporting`}
    </div>
  )

  const { networkId } = useNetwork()

  const RoiByCoverChainIds = historicalDataByCover ? Array.from(new Set(historicalDataByCover.map(entry => { return entry.chainId }))) : []

  const chains = RoiByCoverChainIds.map(chainId => {
    return {
      label: AbbreviatedNetworkNames[chainId],
      value: chainId
    }
  })

  const [selectedChain, setSelectedChain] = useState()

  useEffect(() => {
    if (networkId) {
      setSelectedChain(networkId.toString())
    }
  }, [networkId])

  const getTrailingTitleComponent = () => {
    switch (selected.value) {
      case AllDropdownOptions.GAS_PRICE_SUMMARY:
        return null
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
            onNext={() => { return setCurrentPage(currentPage + 1) }}
            onPrevious={() => { return setCurrentPage(currentPage - 1) }}
            hasNext={currentPage < (Math.abs(protectionTopAccounts.length / TOP_ACCOUNTS_ROWS_PER_PAGE))}
            hasPrevious={currentPage > 1}
          />
        )

      case AllDropdownOptions.HISTORICAL_ROI_BY_COVER:
        if (chains) {
          return (
            <OutlineButtonList
              options={chains} onChange={(value) => {
                setSelectedChain(value)
              }} selected={selectedChain}
            />
          )
        } else {
          return null
        }

      case AllDropdownOptions.MONTHLY_DISTRIBUTION:
      case AllDropdownOptions.MONTHLY_EARNING:
      case AllDropdownOptions.COVER_SOLD:
      case AllDropdownOptions.COVER_PREMIUM:
      case AllDropdownOptions.COVER_EXPIRING:
        return null

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
            <InsightsQuickInfoTable />
          </>
        )

      case AllDropdownOptions.HISTORICAL_ROI:
        return <HistoricalRoi loading={historicalDataLoading} data={historicalData} />

      case AllDropdownOptions.HISTORICAL_ROI_BY_COVER:
        return (
          <HistoricalRoiByCover
            selectedChain={selectedChain}
            loading={historicalDataByCoverLoading}
            data={historicalDataByCover}
          />
        )

      case AllDropdownOptions.MONTHLY_DISTRIBUTION:
        return (
          <ProtectionChart
            loading={protectionDataLoading}
            data={protectionData}
            labels={protectionLabels}
          />
        )

      case AllDropdownOptions.MONTHLY_EARNING:
        return (
          <ProtectionChart
            loading={protectionDataLoading}
            data={protectionData}
            labels={protectionLabels}
            dataKey='incomePercent'
          />
        )

      case AllDropdownOptions.COVER_SOLD:
        return (
          <ProtectionChart
            loading={coverDataLoading}
            data={coverSoldOrPremiumData?.sold}
            labels={soldOrPremiumLabels?.sold ?? []}
            dataKey='totalProtection'
          />
        )

      case AllDropdownOptions.COVER_PREMIUM:
        return (
          <ProtectionChart
            loading={coverDataLoading}
            data={coverSoldOrPremiumData?.premium}
            labels={soldOrPremiumLabels?.premium ?? []}
            dataKey='totalPremium'
          />
        )

      case AllDropdownOptions.COVER_EXPIRING:
        return (
          <ProtectionChart
            loading={coverDataLoading}
            data={coverSoldOrPremiumData?.expiring}
            labels={soldOrPremiumLabels?.expiring ?? []}
            dataKey='totalProtection'
          />
        )

      case AllDropdownOptions.COVER_TVL:
        return <TotalCapacityChart data={totalLiquidity} />

      case AllDropdownOptions.TOTAL_CAPACITY:
        return <TotalCapacityChart data={totalCapacity} />

      case AllDropdownOptions.DEMAND:
        return <TotalCapacityChart data={totalCovered} />

      case AllDropdownOptions.TOP_ACCOUNTS_BY_PROTECTION:
        return <TopAccountsByProtection userData={protectionTopAccounts} loading={protectionTopAccountsLoading} page={currentPage} />

      case AllDropdownOptions.TOP_ACCOUNTS_BY_LIQUIDITY:
        return <TopAccountsByLiquidity userData={liquidityTopAccounts} loading={liquidityTopAccountsLoading} page={currentPage} />

      case AllDropdownOptions.COVER_EARNINGS:
        return (
          <CoverEarning labels={labels} yAxisData={yAxisData} loading={coverEarningLoading} />
        )

      case AllDropdownOptions.GAS_PRICE_SUMMARY:
        return (
          <GasPriceSummary data={gasSummaryData} loading={gasSummaryLoading} />
        )

      case AllDropdownOptions.IN_CONSENSUS:
        return (
          <Consensus loading={consensusLoading} data={consensusData} setConsensusIndex={setConsensusIndex} />
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
        className='py-2.5 px-3 mr-4'
      />
      )
    : null

  return (
    <>
      <InsightsTitle
        setSelected={setSelected}
        selected={selected}
        options={DROPDOWN_OPTIONS}
        trailing={consensusIndex !== -1 ? null : getTrailingTitleComponent()}
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
