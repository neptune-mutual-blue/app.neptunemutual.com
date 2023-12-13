import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { LiquidityGaugePoolsPage } from '@/modules/pools/liquidity-gauge-pools'
import { isFeatureEnabled } from '@/src/config/environment'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { PoolsTabs } from '@/src/modules/pools/PoolsTabs'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('liquidity-gauge-pools')
    }
  }
}

export default function LiquidityGaugePools ({ disabled }) {
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
