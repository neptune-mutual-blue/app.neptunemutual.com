
import { PoolsTabs } from '@/src/modules/pools/PoolsTabs'
import { PodStakingPage } from '@/src/modules/pools/pod-staking'
import { ComingSoon } from '@/common/ComingSoon'
import { isFeatureEnabled } from '@/src/config/environment'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { logPageLoad } from '@/src/services/logs'
import { useEffect } from 'react'
import { analyticsLogger } from '@/utils/logger'
import { Seo } from '@/common/Seo'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('pod-staking-pool')
    }
  }
}

export default function PodStaking ({ disabled }) {
  const { account, chainId } = useWeb3React()
  const router = useRouter()

  useEffect(() => {
    analyticsLogger(() => logPageLoad(chainId ?? null, account ?? null, router.asPath))
  }, [account, chainId, router.asPath])

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
