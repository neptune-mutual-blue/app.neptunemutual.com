import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroTitle } from '@/common/HeroTitle'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { Routes } from '@/src/config/routes'
import { useNetwork } from '@/src/context/Network'
import {
  MyLiquidityTxsTable
} from '@/src/modules/my-liquidity/MyLiquidityTxsTable'
import { Trans } from '@lingui/macro'

export default function MyLiquidityTxs () {
  const { networkId } = useNetwork()

  const disabled = isFeatureEnabled('liquidity', networkId)
  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo />

      <Hero>
        <Container className='px-2 pt-5 pb-20 md:py-20'>
          <BreadCrumbs
            pages={[
              {
                name: <Trans>My Liquidity</Trans>,
                href: Routes.MyLiquidity,
                current: false
              },
              {
                name: <Trans>Transaction List</Trans>,
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
