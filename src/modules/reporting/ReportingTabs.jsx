import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroTitle } from '@/common/HeroTitle'
import { TabNav } from '@/common/Tab/TabNav'
import { Routes } from '@/src/config/routes'

const headers = [
  {
    name: 'active',
    href: Routes.ActiveReports,
    displayAs: 'Active'
  },
  {
    name: 'resolved',
    href: Routes.ResolvedReports,
    displayAs: 'Resolved'
  }
]

export const ReportingTabs = ({ active, children }) => {
  return (
    <>
      <Hero className='min-h-[312px] flex flex-col justify-between'>
        <Container className='flex flex-wrap w-full px-2 pt-32 pb-10'>
          <HeroTitle>
            Reporting
          </HeroTitle>
        </Container>

        <TabNav headers={headers} activeTab={active} />
      </Hero>

      {children}
    </>
  )
}
