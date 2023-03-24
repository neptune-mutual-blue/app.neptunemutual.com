import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { ReportingTabs } from '@/src/modules/reporting/ReportingTabs'
import {
  ReportingResolvedPage
} from '@/src/modules/reporting/resolved/resolved'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('reporting')
    }
  }
}

export default function ReportingResolved ({ disabled }) {
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
