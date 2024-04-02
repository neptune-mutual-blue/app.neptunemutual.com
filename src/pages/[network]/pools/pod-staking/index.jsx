import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { slugToNetworkId } from '@/src/config/networks'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { PodStakingPage } from '@/src/modules/pools/pod-staking'
import { PoolsTabs } from '@/src/modules/pools/PoolsTabs'
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
        pageAction: 'Pod Staking'
      })
    }
  }
}

export default function PodStaking ({ networkId, title }) {
  const disabled = !isFeatureEnabled('pod-staking-pool', networkId)
  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo title={title} />
      <PoolsTabs active='pod-staking'>
        <SortableStatsProvider>
          <PodStakingPage />
        </SortableStatsProvider>
      </PoolsTabs>
    </main>
  )
}
