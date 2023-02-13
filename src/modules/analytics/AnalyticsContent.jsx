import { useState } from 'react'
import { AnalyticsTitle } from '@/src/modules/analytics/AnalyticsTitle'
import { AnalyticsStats } from '@/src/modules/analytics/AnalyticsStats'
import { AnalyticsTVLTable } from '@/src/modules/analytics/AnalyticsTVLTable'

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
  return (
    <div>
      <AnalyticsTitle setSelected={setSelected} selected={selected} options={DROPDOWN_OPTIONS} />
      <AnalyticsStats />
      {selected && selected.value === DROPDOWN_OPTIONS[0].value && <AnalyticsTVLTable />}
    </div>
  )
}
