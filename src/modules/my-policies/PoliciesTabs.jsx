import { useActivePolicies } from '@/src/hooks/useActivePolicies'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroStat } from '@/common/HeroStat'
import { HeroTitle } from '@/common/HeroTitle'
import { TabNav } from '@/common/Tab/TabNav'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { t, Trans } from '@lingui/macro'
import { useRouter } from 'next/router'
import { useAppConstants } from '@/src/context/AppConstants'
import { Routes } from '@/src/config/routes'
import { useWeb3React } from '@web3-react/core'

const headers = [
  {
    name: 'active',
    href: Routes.MyPolicies,
    displayAs: <Trans>Active</Trans>
  },
  {
    name: 'expired',
    href: Routes.MyExpiredPolicies,
    displayAs: <Trans>Expired</Trans>
  }
]

export const PoliciesTabs = ({ active, children }) => {
  const { account } = useWeb3React()
  const {
    data: { totalActiveProtection, activePolicies },
    loading
  } = useActivePolicies()
  const router = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()

  return (
    <>
      <Hero className='min-h-[312px] flex flex-col justify-between'>
        <Container className='flex flex-wrap w-full px-2 pt-32 pb-10'>
          <HeroTitle>
            <Trans>My Policies</Trans>
          </HeroTitle>

          {/* Total Active Protection */}
          {account && (
            <HeroStat title={t`Total Active Protection`}>
              {
                formatCurrency(
                  convertFromUnits(
                    totalActiveProtection,
                    liquidityTokenDecimals
                  ),
                  router.locale
                ).long
              }
            </HeroStat>
          )}
        </Container>

        <TabNav headers={headers} activeTab={active} />
      </Hero>

      {children({ data: activePolicies, loading })}
    </>
  )
}
