import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { PodStakingPage } from '@/src/modules/pools/pod-staking'
import { PoolsTabs } from '@/src/modules/pools/PoolsTabs'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('pod-staking-pool')
    }
  }
}

export default function PodStaking ({ disabled }) {
  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo />
      <PoolsTabs active='pod-staking'>
        <SortableStatsProvider>
          <PodStakingPage />
        </SortableStatsProvider>
      </PoolsTabs>
    </main>
  )
}
