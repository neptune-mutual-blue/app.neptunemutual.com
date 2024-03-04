import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroTitle } from '@/common/HeroTitle'
import { TabNav } from '@/common/Tab/TabNav'
import { Routes } from '@/src/config/routes'
import { useNetwork } from '@/src/context/Network'
import { Trans } from '@lingui/macro'

const headers = (networkId) => {
  return [
    {
      name: 'active',
      href: Routes.ActiveReports(networkId),
      displayAs: <Trans>Active</Trans>
    },
    {
      name: 'resolved',
      href: Routes.ResolvedReports(networkId),
      displayAs: <Trans>Resolved</Trans>
    }
  ]
}

export const ReportingTabs = ({ active, children }) => {
  const { networkId } = useNetwork()

  return (
    <>
      <Hero className='min-h-[312px] flex flex-col justify-between'>
        <Container className='flex flex-wrap w-full px-2 pt-32 pb-10'>
          <HeroTitle>
            <Trans>Reporting</Trans>
          </HeroTitle>
        </Container>

        <TabNav headers={headers(networkId)} activeTab={active} />
      </Hero>

      {children}
    </>
  )
}
