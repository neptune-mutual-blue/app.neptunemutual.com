import { useMemo, useState } from 'react'
import { AnalyticsTitle } from '@/src/modules/analytics/AnalyticsTitle'
import { AnalyticsStats } from '@/src/modules/analytics/AnalyticsStats'
import { AnalyticsTVLTable } from '@/src/modules/analytics/AnalyticsTVLTable'
import { useNetworkStats } from '@/src/hooks/useNetworkStats'
import { useProtocolDayData } from '@/src/hooks/useProtocolDayData'
import { TotalCapacityChart } from '@/common/TotalCapacityChart'
import { TopAccounts } from '@/modules/analytics/TopAccounts'
import { useProtocolUsersData } from '@/src/hooks/useProtocolUsersData'
import { useFetchAnalyticsTVLStats } from '@/src/services/aggregated-stats/analytics'

const DROPDOWN_OPTIONS = [
  { label: 'TVL Distribution', value: 'TVL Distribution', type: 'option' },
  { label: 'Quick Info', value: 'Quick Info', type: 'option' },
  { label: 'Growth', value: 'Growth', type: 'label' },
  { label: 'Demand', value: 'Demand', type: 'option' },
  { label: 'Cover TVL', value: 'Cover TVL', type: 'option' },
  { label: 'Pool TVL', value: 'Pool TVL', type: 'option' },
  { label: 'Other Insights', value: 'Other Insights', type: 'label' },
  { label: 'Top Accounts', value: 'Top Accounts', type: 'option' },
  { label: 'Premium Earned', value: 'Premium Earned', type: 'option' },
  { label: 'Cover Earnings', value: 'Cover Earnings', type: 'option' },
  { label: 'In Consensus', value: 'In Consensus', type: 'option' }
]

export const AnalyticsContent = () => {
  const [selected, setSelected] = useState(DROPDOWN_OPTIONS[0])
  const { data: statsData, loading } = useNetworkStats()

  const { data: { totalCovered, totalLiquidity } } = useProtocolDayData()
  const { data: userData } = useProtocolUsersData()

  const { data: TVLStats, loading: tvlStatsLoading } = useFetchAnalyticsTVLStats()

  const Components = useMemo(() => {
    return {
      'TVL Distribution': (
        <div>
          <AnalyticsStats loading={loading} statsData={statsData} />
          <AnalyticsTVLTable data={TVLStats} loading={tvlStatsLoading} />
        </div>
      ),
      Demand: <TotalCapacityChart data={totalCovered} />,
      'Cover TVL': <TotalCapacityChart data={totalLiquidity} />,
      'Top Accounts': <TopAccounts userData={userData} />
    }
  }, [loading, statsData, totalCovered, totalLiquidity, userData, TVLStats, tvlStatsLoading])

  return (
    <div>
      <AnalyticsTitle setSelected={setSelected} selected={selected} options={DROPDOWN_OPTIONS} loading={loading} statsData={statsData} />
      {
        selected && Components[selected.value] && Components[selected.value]
      }
    </div>
  )
}
