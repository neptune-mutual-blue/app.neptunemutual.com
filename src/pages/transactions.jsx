
import { HeroTitle } from '@/common/HeroTitle'
import { t, Trans } from '@lingui/macro'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Routes } from '@/src/config/routes'
import { MyTransactionsTable } from '@/modules/transactions/MyTransactionsTable'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { logPageLoad } from '@/src/services/logs'
import { useEffect } from 'react'
import { analyticsLogger } from '@/utils/logger'
import { Seo } from '@/common/Seo'

export default function Home () {
  const router = useRouter()
  const { account, chainId } = useWeb3React()

  useEffect(() => {
    analyticsLogger(() => logPageLoad(chainId ?? null, account ?? null, router.asPath))
  }, [account, chainId, router.asPath])

  return (
    <main>
      <Seo />

      <Hero>
        <Container className='px-2 py-20'>
          <BreadCrumbs
            pages={[
              {
                name: t`Home`,
                href: Routes.Home,
                current: false
              },
              { name: t`My Transactions`, href: '#', current: true }
            ]}
          />

          <HeroTitle>
            <Trans>All Transaction History</Trans>
          </HeroTitle>
        </Container>

        <hr className='border-B0C4DB' />
      </Hero>

      <Container className='pt-14 pb-28'>
        <MyTransactionsTable />
      </Container>

    </main>
  )
}
