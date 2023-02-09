
import { PoolsTabs } from '@/src/modules/pools/PoolsTabs'
import { PodStakingPage } from '@/src/modules/pools/pod-staking'
import { Hero } from '@/common/Hero'
import { ComingSoon } from '@/common/ComingSoon'
import { isFeatureEnabled } from '@/src/config/environment'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { logPageLoad } from '@/src/services/logs'
import { useEffect } from 'react'
import { analyticsLogger } from '@/utils/logger'
import { Seo } from '@/common/Seo'
import { CalculatorCard } from '@/modules/analytics/CalculatorCard';
import { AnalyticsTable } from '@/modules/analytics/AnalyticsTable';
import { Container } from '@/common/Container/Container'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('pod-staking-pool')
    }
  }
}

export default function Analytics ({ disabled }) {
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
      <Hero>
        <Container
          className={
            'flex flex-col-reverse justify-between lg:gap-8 py-10 md:py-16 md:px-10 lg:py-28 md:flex-col-reverse lg:flex-row'
          }
        >
          <div className='flex-2 flex-col min-w-0 bg-white rounded-2xl shadow-homeCard px-6 py-8 lg:p-14 border-0.5 border-B0C4DB'>
            <AnalyticsTable />
          </div>
          
          <div className='pt-10 md:flex flex-1 lg:flex-col md:gap-4 md:w-full lg:w-auto bg-white rounded-2xl shadow-homeCard px-6 py-8 lg:p-14 border-0.5 border-B0C4DB'>
            <CalculatorCard />        
          </div>

        </Container>
      </Hero>
    </main>
  )
}
