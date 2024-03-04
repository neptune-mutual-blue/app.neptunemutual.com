import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { ReportingActivePage } from '@/src/modules/reporting/active/active'
import { ReportingTabs } from '@/src/modules/reporting/ReportingTabs'

import { slugToNetworkId } from '@/src/config/networks'
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
      networkId: slugToNetworkId[params.network]
    }
  }
}

export default function ReportingActive ({ networkId }) {
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
