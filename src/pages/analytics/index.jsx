
import { Hero } from '@/common/Hero'
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

export default function Analytics () {
  const { account, chainId } = useWeb3React()
  const router = useRouter()

  useEffect(() => {
    analyticsLogger(() => logPageLoad(chainId ?? null, account ?? null, router.asPath))
  }, [account, chainId, router.asPath])

  return (
    <main>
      <Seo />
      <Hero>
        <Container className='flex flex-col justify-between py-8 px-4 gap-8 lg:gap-8 py-10 md:py-16 md:px-6 md:flex-col-reverse lg:flex-row lg:py-28 lg:px-8'>
          <div className='grid grid-cols-1 grid-rows-analytics-card w-full bg-white rounded-2xl shadow-homeCard px-4 py-4 lg:p-10 border-0.5 border-B0C4DB'>
            <AnalyticsContent />
          </div>
          <div className={classNames('-mt-4 mb-4 lg:m-0 md:flex lg:flex-col lg:gap-4 md:w-full lg:w-auto lg:pt-0 lg:h-full shadow-homeCard',
            'bg-white border-0.5 border-B0C4DB rounded-2xl')}
          >
            <div className='flex-1 lg:flex-2 lg:flex lg:flex-col'>
              <div
                className='flex flex-col mb-2 md:mb-0 lg:mb-5 md:justify-center lg:justify-start lg:flex-1'
                data-testid='tvl-homecard'
              >
                <div
                  className={classNames(
                    'w-full lg:w-96 lg:h-full md:rounded-none flex flex-col',
                    'p-4 m-0 lg:p-10'
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
