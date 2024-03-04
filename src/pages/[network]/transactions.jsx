import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroTitle } from '@/common/HeroTitle'
import { Seo } from '@/common/Seo'
import { MyTransactionsTable } from '@/modules/transactions/MyTransactionsTable'
import { Routes } from '@/src/config/routes'
import { Trans } from '@lingui/macro'

import { slugToNetworkId } from '@/src/config/networks'
import { getNetworks } from '@/src/ssg/static-paths'

export const getStaticPaths = async () => {
  return {
    paths: getNetworks(),
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      networkId: slugToNetworkId[params.network]
    }
  }
}

export default function Home ({ networkId }) {
  return (
    <main>
      <Seo />

      <Hero>
        <Container className='px-2 pt-5 pb-20 md:py-20'>
          <BreadCrumbs
            pages={[
              {
                name: <Trans>Home</Trans>,
                href: Routes.Home(networkId),
                current: false
              },
              { name: <Trans>My Transactions</Trans>, href: '#', current: true }
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
