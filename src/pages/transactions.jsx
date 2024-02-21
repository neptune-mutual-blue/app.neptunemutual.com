import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroTitle } from '@/common/HeroTitle'
import { Seo } from '@/common/Seo'
import { MyTransactionsTable } from '@/modules/transactions/MyTransactionsTable'
import { Routes } from '@/src/config/routes'

export default function Home () {
  return (
    <main>
      <Seo />

      <Hero>
        <Container className='px-2 pt-5 pb-20 md:py-20'>
          <BreadCrumbs
            pages={[
              {
                name: 'Home',
                href: Routes.Home,
                current: false
              },
              { name: 'My Transactions', href: '#', current: true }
            ]}
          />

          <HeroTitle>All Transaction History</HeroTitle>
        </Container>

        <hr className='border-B0C4DB' />
      </Hero>

      <Container className='pt-14 pb-28'>
        <MyTransactionsTable />
      </Container>

    </main>
  )
}
