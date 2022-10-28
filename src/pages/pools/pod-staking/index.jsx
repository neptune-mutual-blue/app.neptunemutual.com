import Head from 'next/head'

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

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('pod-staking-pool')
    }
  }
}

export default function PodStaking ({ disabled }) {
  const { account } = useWeb3React()
  const router = useRouter()

  useEffect(() => {
    analyticsLogger(() => logPageLoad(account ?? null, router.pathname))
  }, [account, router.pathname])

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name='description'
          content='Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment.'
        />
      </Head>
      <PoolsTabs active='pod-staking'>
        <SortableStatsProvider>
          <PodStakingPage />
        </SortableStatsProvider>
      </PoolsTabs>
    </main>
  )
}
