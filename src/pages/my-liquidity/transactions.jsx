import { ComingSoon } from '@/common/ComingSoon'
import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroTitle } from '@/common/HeroTitle'
import { MyLiquidityTxsTable } from '@/src/modules/my-liquidity/MyLiquidityTxsTable'
import { isFeatureEnabled } from '@/src/config/environment'
import { t, Trans } from '@lingui/macro'
import { Routes } from '@/src/config/routes'
import { logPageLoad } from '@/src/services/logs'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'
import { analyticsLogger } from '@/utils/logger'
import { Seo } from '@/common/Seo'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('liquidity')
    }
  }
}

export default function MyLiquidityTxs ({ disabled }) {
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
        <Container className='px-2 py-20'>
          <BreadCrumbs
            pages={[
              {
                name: t`My Liquidity`,
                href: Routes.MyLiquidity,
                current: false
              },
              {
                name: t`Transaction List`,
                href: Routes.LiquidityTransactions,
                current: true
              }
            ]}
          />
          <HeroTitle>
            <Trans>Transaction List</Trans>
          </HeroTitle>
        </Container>
        <hr className='border-B0C4DB' />
      </Hero>

      <Container className='pt-14 pb-28'>
        <MyLiquidityTxsTable />
      </Container>
    </main>
  )
}
