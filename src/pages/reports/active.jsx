import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { ReportingActivePage } from '@/src/modules/reporting/active/active'
import { ReportingTabs } from '@/src/modules/reporting/ReportingTabs'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('reporting')
    }
  }
}

export default function ReportingActive ({ disabled }) {
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
