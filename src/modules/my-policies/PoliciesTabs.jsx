import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroStat } from '@/common/HeroStat'
import { HeroTitle } from '@/common/HeroTitle'
import { TabNav } from '@/common/Tab/TabNav'
import { Routes } from '@/src/config/routes'

const headers = [
  {
    name: 'active',
    href: Routes.MyActivePolicies,
    displayAs: 'Active'
  },
  {
    name: 'expired',
    href: Routes.MyExpiredPolicies,
    displayAs: 'Expired'
  }
]

export const PoliciesTabs = ({ active, children, heroStatValue = '', heroStatTitle = '' }) => {
  return (
    <>
      <Hero className='min-h-[312px] flex flex-col justify-between'>
        <Container className='flex flex-wrap w-full px-2 pt-32 pb-10'>
          <HeroTitle>
            My Policies
          </HeroTitle>

          {/* Total Active Protection */}
          {heroStatTitle && (
            <HeroStat title={heroStatTitle}>
              {heroStatValue}
            </HeroStat>
          )}
        </Container>

        <TabNav headers={headers} activeTab={active} />
      </Hero>

      {children}
    </>
  )
}
