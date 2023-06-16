import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroTitle } from '@/common/HeroTitle'
import { Seo } from '@/common/Seo'
import {
  LiquidityGaugeTxsTable
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugeTxsTable'
import { isFeatureEnabled } from '@/src/config/environment'
import { Routes } from '@/src/config/routes'
import {
  t,
  Trans
} from '@lingui/macro'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('liquidity-gauge-pools')
    }
  }
}

export default function MyLiquidityGaugePoolsTxs ({ disabled }) {
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
              { name: t`Pool`, href: Routes.Pools(), current: false },
              {
                name: t`Liquidity Gauge Pools`,
                href: Routes.LiquidityGaugePools,
                current: false
              },
              {
                name: t`Transaction List`,
                href: Routes.LiquidityGaugePoolsTransactions,
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
        <LiquidityGaugeTxsTable />
      </Container>
    </main>
  )
}
