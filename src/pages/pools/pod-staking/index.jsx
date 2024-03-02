import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { useNetwork } from '@/src/context/Network'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { PodStakingPage } from '@/src/modules/pools/pod-staking'
import { PoolsTabs } from '@/src/modules/pools/PoolsTabs'

export default function PodStaking () {
  const { networkId } = useNetwork()
  const disabled = !isFeatureEnabled('pod-staking-pool', networkId)
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
