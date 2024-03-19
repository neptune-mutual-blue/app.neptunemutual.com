import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { useNetwork } from '@/src/context/Network'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { ReportingActivePage } from '@/src/modules/reporting/active/active'
import { ReportingTabs } from '@/src/modules/reporting/ReportingTabs'

export default function ReportingActive () {
  const { networkId } = useNetwork()

  const disabled = !isFeatureEnabled('reporting', networkId)
  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo />
      <ReportingTabs active='active'>
        <SortableStatsProvider>
          <ReportingActivePage />
        </SortableStatsProvider>
      </ReportingTabs>
    </main>
  )
}
