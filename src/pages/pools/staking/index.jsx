import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { PoolsTabs } from '@/src/modules/pools/PoolsTabs'
import { StakingPage } from '@/src/modules/pools/staking'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('staking-pool')
    }
  }
}

export default function Staking ({ disabled }) {
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
