import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { slugToNetworkId } from '@/src/config/networks'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { ReportingTabs } from '@/src/modules/reporting/ReportingTabs'
import {
  ReportingResolvedPage
} from '@/src/modules/reporting/resolved/resolved'
import { getTitle } from '@/src/ssg/seo'
import { getNetworks } from '@/src/ssg/static-paths'

export const getStaticPaths = async () => {
  return {
    paths: getNetworks(),
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      networkId: slugToNetworkId[params.network],
      title: getTitle({
        networkId: slugToNetworkId[params.network],
        pageAction: 'Resolved Reports on #NETWORK marketplace'
      })
    }
  }
}

export default function ReportingResolved ({ networkId, title }) {
  const disabled = !isFeatureEnabled('reporting', networkId)

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo title={title} />
      <ReportingTabs active='resolved'>
        <SortableStatsProvider>
          <ReportingResolvedPage />
        </SortableStatsProvider>
      </ReportingTabs>
    </main>
  )
}
