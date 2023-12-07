import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroTitle } from '@/common/HeroTitle'
import { Seo } from '@/common/Seo'
import { MyStakingTxsTable } from '@/modules/pools/staking/MyStakingTxsTable'
import { isFeatureEnabled } from '@/src/config/environment'
import { Routes } from '@/src/config/routes'
import { Trans } from '@lingui/macro'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('staking-pool')
    }
  }
}

export default function MyStakingTxs ({ disabled }) {
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
              { name: <Trans>Pool</Trans>, href: Routes.Pools(), current: false },
              {
                name: <Trans>Staking</Trans>,
                href: Routes.StakingPools,
                current: false
              },
              {
                name: <Trans>Transaction List</Trans>,
                href: Routes.StakingPoolsTransactions,
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
        <MyStakingTxsTable />
      </Container>
    </main>
  )
}
