import { useRouter } from 'next/router'

import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroStat } from '@/common/HeroStat'
import { HeroTitle } from '@/common/HeroTitle'
import { TabNav } from '@/common/Tab/TabNav'
import { isFeatureEnabled } from '@/src/config/environment'
import { useAppConstants } from '@/src/context/AppConstants'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { Trans } from '@lingui/macro'

const headers = [
  isFeatureEnabled('bond') && {
    name: 'bond',
    href: '/pools/bond',
    displayAs: <Trans>Bond</Trans>
  },
  isFeatureEnabled('staking-pool') && {
    name: 'staking',
    href: '/pools/staking',
    displayAs: <Trans>Staking</Trans>
  },
  isFeatureEnabled('pod-staking-pool') && {
    name: 'pod-staking',
    href: '/pools/pod-staking',
    displayAs: <Trans>POD Staking</Trans>
  },
  isFeatureEnabled('liquidity-gauge-pools') && {
    name: 'liquidity-gauge-pools',
    href: '/pools/liquidity-gauge-pools',
    displayAs: <Trans>Liquidity Gauge Pools</Trans>
  }
].filter(Boolean)

export const PoolsTabs = ({ active, children }) => {
  const { poolsTvl: tvl, liquidityTokenDecimals } = useAppConstants()
  const router = useRouter()

  return (
    <>
      <Hero className='min-h-[312px] flex flex-col justify-between'>
        <Container className='flex flex-wrap w-full px-2 pt-32 pb-10'>
          <HeroTitle>
            <Trans>Bond and Liquidity Gauge</Trans>
          </HeroTitle>

          {/* Total Value Locked */}
          <HeroStat title='Total Value Locked'>
            {
              formatCurrency(
                convertFromUnits(tvl, liquidityTokenDecimals),
                router.locale
              ).long
            }
          </HeroStat>
        </Container>

        <TabNav headers={headers} activeTab={active} />
      </Hero>

      {children}
    </>
  )
}
