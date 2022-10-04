import Head from 'next/head'
import { ComingSoon } from '@/common/ComingSoon'
import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroTitle } from '@/common/HeroTitle'
import { MyLiquidityTxsTable } from '@/src/modules/my-liquidity/MyLiquidityTxsTable'
import { isFeatureEnabled } from '@/src/config/environment'
import { t, Trans } from '@lingui/macro'
import { Routes } from '@/src/config/routes'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('liquidity')
    }
  }
}

export default function MyLiquidityTxs ({ disabled }) {
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
