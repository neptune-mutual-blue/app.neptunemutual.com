import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroStat } from '@/common/HeroStat'
import { HeroTitle } from '@/common/HeroTitle'
import { TabNav } from '@/common/Tab/TabNav'
import { Routes } from '@/src/config/routes'
import { Trans } from '@lingui/macro'

const headers = [
  {
    name: 'active',
    href: Routes.MyActivePolicies,
    displayAs: <Trans>Active</Trans>
  },
  {
    name: 'expired',
    href: Routes.MyExpiredPolicies,
    displayAs: <Trans>Expired</Trans>
  }
]

export const PoliciesTabs = ({ active, children, heroStatValue = '', heroStatTitle = '' }) => {
  return (
    <>
      <Hero className='min-h-[312px] flex flex-col justify-between'>
        <Container className='flex flex-wrap w-full px-2 pt-32 pb-10'>
          <HeroTitle>
            <Trans>My Policies</Trans>
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
