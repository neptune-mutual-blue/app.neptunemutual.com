import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { useNetwork } from '@/src/context/Network'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { ReportingTabs } from '@/src/modules/reporting/ReportingTabs'
import {
  ReportingResolvedPage
} from '@/src/modules/reporting/resolved/resolved'

export default function ReportingResolved () {
  const { networkId } = useNetwork()
  const disabled = !isFeatureEnabled('reporting', networkId)

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo />
      <ReportingTabs active='resolved'>
        <SortableStatsProvider>
          <ReportingResolvedPage />
        </SortableStatsProvider>
      </ReportingTabs>
    </main>
  )
}
