import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { LiquidityGaugePoolsPage } from '@/modules/pools/liquidity-gauge-pools'
import { isFeatureEnabled } from '@/src/config/environment'
import { useNetwork } from '@/src/context/Network'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { PoolsTabs } from '@/src/modules/pools/PoolsTabs'

export default function LiquidityGaugePools () {
  const { networkId } = useNetwork()
  const disabled = !isFeatureEnabled('liquidity-gauge-pools', networkId)

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo />
      <PoolsTabs active='liquidity-gauge-pools'>
        <SortableStatsProvider>
          <LiquidityGaugePoolsPage />
        </SortableStatsProvider>
      </PoolsTabs>
    </main>
  )
}
