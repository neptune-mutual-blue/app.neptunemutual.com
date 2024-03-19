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
import { useNetwork } from '@/src/context/Network'
import { Trans } from '@lingui/macro'

export default function MyLiquidityGaugePoolsTxs () {
  const { networkId } = useNetwork()
  const disabled = !isFeatureEnabled('liquidity-gauge-pools', networkId)
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
              { name: <Trans>Pool</Trans>, href: Routes.Pools(networkId), current: false },
              {
                name: <Trans>Liquidity Gauge Pools</Trans>,
                href: Routes.LiquidityGaugePools,
                current: false
              },
              {
                name: <Trans>Transaction List</Trans>,
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
