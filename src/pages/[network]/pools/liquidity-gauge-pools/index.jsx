import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { LiquidityGaugePoolsPage } from '@/modules/pools/liquidity-gauge-pools'
import { isFeatureEnabled } from '@/src/config/environment'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { PoolsTabs } from '@/src/modules/pools/PoolsTabs'

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

export default function LiquidityGaugePools ({ networkId }) {
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
