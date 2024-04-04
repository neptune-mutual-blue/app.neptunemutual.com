import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroTitle } from '@/common/HeroTitle'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { slugToNetworkId } from '@/src/config/networks'
import { Routes } from '@/src/config/routes'
import {
  MyLiquidityTxsTable
} from '@/src/modules/my-liquidity/MyLiquidityTxsTable'
import { getNetworks } from '@/src/ssg/static-paths'
import { Trans } from '@lingui/macro'

export const getStaticPaths = async () => {
  return {
    paths: getNetworks(),
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      networkId: slugToNetworkId[params.network],
      title: 'My Liquidity Transactions'
    }
  }
}

export default function MyLiquidityTxs ({ networkId, title }) {
  const disabled = !isFeatureEnabled('liquidity', networkId)

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo title={title} />

      <Hero>
        <Container className='px-2 pt-5 pb-20 md:py-20'>
          <BreadCrumbs
            pages={[
              {
                name: <Trans>My Liquidity</Trans>,
                href: Routes.MyLiquidity(networkId),
                current: false
              },
              {
                name: <Trans>Transaction List</Trans>,
                href: Routes.LiquidityTransactions(networkId),
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
