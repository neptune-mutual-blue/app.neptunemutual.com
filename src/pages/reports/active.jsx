import Head from 'next/head'
import { ReportingTabs } from '@/src/modules/reporting/ReportingTabs'
import { ReportingActivePage } from '@/src/modules/reporting/active/active'
import { ComingSoon } from '@/common/ComingSoon'
import { isFeatureEnabled } from '@/src/config/environment'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { logPageLoad } from '@/src/services/logs'
import { useEffect } from 'react'
import { analyticsLogger } from '@/utils/logger'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('reporting')
    }
  }
}

export default function ReportingActive ({ disabled }) {
  const { account, chainId } = useWeb3React()
  const router = useRouter()

  useEffect(() => {
    analyticsLogger(() => logPageLoad(chainId ?? null, account ?? null, router.pathname))
  }, [account, chainId, router.pathname])

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
      <ReportingTabs active='active'>
        <SortableStatsProvider>
          <ReportingActivePage />
        </SortableStatsProvider>
      </ReportingTabs>
    </main>
  )
}
