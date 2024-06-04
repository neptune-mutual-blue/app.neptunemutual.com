import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { LiquidityGaugePoolsPage } from '@/modules/pools/liquidity-gauge-pools'
import { isFeatureEnabled } from '@/src/config/environment'
import { ChainConfig } from '@/src/config/hardcoded'
import { slugToNetworkId } from '@/src/config/networks'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
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
        pageAction: 'Liquidity Gauge Pools on #NETWORK marketplace'
      })
    }
  }
}

export default function LiquidityGaugePools ({ networkId, title }) {
  const disabled = !isFeatureEnabled('liquidity-gauge-pools', networkId) || !(ChainConfig?.[networkId]?.gaugeControllerRegistry)

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo title={title} />
      <PoolsTabs active='liquidity-gauge-pools'>
        <SortableStatsProvider>
          <LiquidityGaugePoolsPage />
        </SortableStatsProvider>
      </PoolsTabs>
    </main>
  )
}
