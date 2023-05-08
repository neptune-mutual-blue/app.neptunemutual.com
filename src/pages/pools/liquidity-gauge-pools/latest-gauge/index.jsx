import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import LatestGauge from '@/modules/pools/liquidity-gauge-pools/LatestGauge'
import { isFeatureEnabled } from '@/src/config/environment'
import { PoolsTabs } from '@/src/modules/pools/PoolsTabs'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('liquidity-gauge-pools')
    }
  }
}

export default function LatestGaugePage ({ disabled }) {
  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo />
      <PoolsTabs active='liquidity-gauge-pools'>
        <LatestGauge />
      </PoolsTabs>
    </main>
  )
}
