import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { logPageLoad } from '@/src/services/logs'
import { useEffect } from 'react'
import { analyticsLogger } from '@/utils/logger'
import { Seo } from '@/common/Seo'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { Insights } from '@/modules/insights'

export default function Analytics () {
  const { account, chainId } = useWeb3React()
  const router = useRouter()

  useEffect(() => {
    analyticsLogger(() => logPageLoad(chainId ?? null, account ?? null, router.asPath))
  }, [account, chainId, router.asPath])

  return (
    <SortableStatsProvider>
      <main>
        <Seo />
        <Insights />
      </main>
    </SortableStatsProvider>
  )
}
