import Head from 'next/head'
import { PoolsTabs } from '@/src/modules/pools/PoolsTabs'
import BondPage from '@/src/modules/pools/bond'
import { ComingSoon } from '@/common/ComingSoon'
import { isFeatureEnabled } from '@/src/config/environment'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { logPageLoad } from '@/src/services/logs'
import { useEffect } from 'react'
import { analyticsLogger } from '@/utils/logger'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('bond')
    }
  }
}

export default function Bond ({ disabled }) {
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
      <PoolsTabs active='bond'>
        <BondPage />
      </PoolsTabs>
    </main>
  )
}
