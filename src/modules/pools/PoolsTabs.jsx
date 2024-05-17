import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroStat } from '@/common/HeroStat'
import { HeroTitle } from '@/common/HeroTitle'
import { TabNav } from '@/common/Tab/TabNav'
import { isFeatureEnabled } from '@/src/config/environment'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
import { useLiquidityGaugePools } from '@/src/context/LiquidityGaugePools'
import { useNetwork } from '@/src/context/Network'
import { useLanguageContext } from '@/src/i18n/i18n'
import {
  convertFromUnits,
  sumOf
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { Trans } from '@lingui/macro'

const getHeaders = (networkId) => {
  return [
    isFeatureEnabled('liquidity-gauge-pools', networkId) && {
      name: 'liquidity-gauge-pools',
      href: Routes.LiquidityGaugePools(networkId),
      displayAs: <Trans>Liquidity Gauge Pools</Trans>
    },
    isFeatureEnabled('bond', networkId) && {
      name: 'bond',
      href: Routes.BondPool(networkId),
      displayAs: <Trans>Bond</Trans>
    },
    isFeatureEnabled('staking-pool', networkId) && {
      name: 'staking',
      href: Routes.StakingPools(networkId),
      displayAs: <Trans>Staking</Trans>
    },
    isFeatureEnabled('pod-staking-pool', networkId) && {
      name: 'pod-staking',
      href: Routes.PodStakingPools(networkId),
      displayAs: <Trans>POD Staking</Trans>
    }
  ].filter(Boolean)
}

export const PoolsTabs = ({ active, children }) => {
  const { poolsTvl, liquidityTokenDecimals } = useAppConstants()
  const { tvl: liquidityGaugePoolsTvl } = useLiquidityGaugePools()
  const { locale } = useLanguageContext()
  const { networkId } = useNetwork()

  const tvl = sumOf(poolsTvl, liquidityGaugePoolsTvl).toString()

  return (
    <>
      <Hero className='min-h-[312px] flex flex-col justify-between'>
        <Container className='flex flex-wrap justify-center w-full px-2 pt-12 pb-13 md:justify-start md:pt-32 md:pb-10'>
          <HeroTitle>
            <Trans>Bond and Liquidity Gauge</Trans>
          </HeroTitle>

          {/* Total Value Locked */}
          <HeroStat title='Total Value Locked'>
            {
              formatCurrency(
                convertFromUnits(tvl, liquidityTokenDecimals),
                locale
              ).long
            }
          </HeroStat>
        </Container>

        <TabNav headers={getHeaders(networkId)} activeTab={active} />
      </Hero>

      {children}
    </>
  )
}
