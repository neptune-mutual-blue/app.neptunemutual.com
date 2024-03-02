import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { useNetwork } from '@/src/context/Network'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { PoolsTabs } from '@/src/modules/pools/PoolsTabs'
import { StakingPage } from '@/src/modules/pools/staking'

export default function Staking () {
  const { networkId } = useNetwork()
  const disabled = !isFeatureEnabled('staking-pool', networkId)

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo />
      <PoolsTabs active='staking'>
        <SortableStatsProvider>
          <StakingPage />
        </SortableStatsProvider>
      </PoolsTabs>
    </main>
  )
}
