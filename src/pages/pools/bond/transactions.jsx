import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroTitle } from '@/common/HeroTitle'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { Routes } from '@/src/config/routes'
import { MyBondTxsTable } from '@/src/modules/pools/bond/MyBondTxsTable'
import {
  t,
  Trans
} from '@lingui/macro'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('bond')
    }
  }
}

export default function MyBondTxs ({ disabled }) {
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
              { name: t`Pool`, href: Routes.Pools(), current: false },
              {
                name: t`Bond`,
                href: Routes.BondPool,
                current: false
              },
              {
                name: t`Transaction List`,
                href: Routes.BondPoolTransactions,
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
        <MyBondTxsTable />
      </Container>
    </main>
  )
}
