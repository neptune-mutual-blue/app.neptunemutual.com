
import { Hero } from '@/common/Hero'
import { ComingSoon } from '@/common/ComingSoon'
import { isFeatureEnabled } from '@/src/config/environment'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { logPageLoad } from '@/src/services/logs'
import { useEffect } from 'react'
import { analyticsLogger } from '@/utils/logger'
import { Seo } from '@/common/Seo'
import { CalculatorCard } from '@/modules/analytics/CalculatorCard'
import { AnalyticsContent } from '@/modules/analytics/AnalyticsContent'
import { Container } from '@/common/Container/Container'
import { classNames } from '@/utils/classnames'

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
        <Container className='flex flex-col-reverse justify-between py-10 md:py-16 md:px-10  md:flex-col-reverse md:px-6 lg:flex-row lg:py-28 lg:gap-32 lg:px-32'>
          <div className='flex flex-col flex-1 min-w-0 bg-white rounded-2xl shadow-homeCard px-6 py-8 lg:p-10 border-0.5 border-B0C4DB'>
            <AnalyticsContent />
          </div>
          <div className={classNames('pt-10 md:flex lg:flex-col md:gap-4 md:w-full lg:w-auto lg:pt-0 lg:h-full shadow-homeCard', 'bg-white md:border-0.5 md:border-B0C4DB md:rounded-tl-xl md:rounded-tr-xl rounded-2xl')}>
            <div className='flex-1 lg:flex-2 lg:flex lg:flex-col'>
              <div
                className='flex flex-col mb-2 md:mb-0 lg:mb-8 md:justify-center lg:justify-start lg:flex-1'
                data-testid='tvl-homecard'
              >
                <div
                  className={classNames(
                    'w-full lg:w-96 lg:h-full md:rounded-none flex flex-col',
                    'px-6 py-8 lg:p-10'
                  )}
                >
                  <CalculatorCard />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Hero>
    </main>
  )
}
