import { useEffect } from 'react'

import { useRouter } from 'next/router'

import { Seo } from '@/common/Seo'
import HomePage from '@/modules/home'
import { logPageLoad } from '@/src/services/logs'
import { analyticsLogger } from '@/utils/logger'
import { useWeb3React } from '@web3-react/core'

export default function Home () {
  const { account, chainId } = useWeb3React()
  const router = useRouter()

  useEffect(() => {
    analyticsLogger(() => logPageLoad(chainId ?? null, account ?? null, router.asPath))
  }, [account, chainId, router.asPath])

  return (
    <main>
      <Seo />
      <HomePage />

    </main>
  )
}
