import { useRouter } from 'next/router'

import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroStat } from '@/common/HeroStat'
import { HeroTitle } from '@/common/HeroTitle'
import { Seo } from '@/common/Seo'
import { MyLiquidityPage } from '@/modules/my-liquidity'
import { isFeatureEnabled } from '@/src/config/environment'
import { useAppConstants } from '@/src/context/AppConstants'
import {
  useCalculateTotalLiquidity
} from '@/src/hooks/useCalculateTotalLiquidity'
import { useMyLiquidities } from '@/src/hooks/useMyLiquidities'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { useNetwork } from '@/src/context/Network'

export default function MyLiquidity () {
  const { networkId } = useNetwork()

  const { account } = useWeb3React()
  const { data, loading } = useMyLiquidities(account)
  const { liquidityList, myLiquidities } = data
  const totalLiquidityProvided = useCalculateTotalLiquidity({ liquidityList })
  const { liquidityTokenDecimals } = useAppConstants()

  const router = useRouter()

  const disabled = !isFeatureEnabled('liquidity', networkId)

  if (disabled) {
    return <ComingSoon />
  }

  const myTotalLiquidity = loading
    ? <Trans>loading...</Trans>
    : `${
        formatCurrency(
          convertFromUnits(totalLiquidityProvided, liquidityTokenDecimals),
          router.locale
        ).long
      }
  `

  return (
    <main>
      <Seo />

      <Hero>
        <Container className='flex flex-wrap px-2 py-32 min-h-[312px]'>
          <HeroTitle>
            <Trans>My Liquidity</Trans>
          </HeroTitle>
          {account && (
            <HeroStat title={<Trans>My Total Liquidity</Trans>}>
              {myTotalLiquidity}
            </HeroStat>
          )}
        </Container>
        <hr className='border-B0C4DB' />
      </Hero>

      <MyLiquidityPage myLiquidities={myLiquidities} loading={loading} />
    </main>
  )
}
