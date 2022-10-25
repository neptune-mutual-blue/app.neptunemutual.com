import Head from 'next/head'

import { CoverAddLiquidityDetailsPage } from '@/src/modules/cover/add-liquidity'
import { ComingSoon } from '@/common/ComingSoon'
import { isFeatureEnabled } from '@/src/config/environment'
import { LiquidityFormsProvider } from '@/common/LiquidityForms/LiquidityFormsContext'
import { useRouter } from 'next/router'
import { CoverStatsProvider } from '@/common/Cover/CoverStatsContext'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useWeb3React } from '@web3-react/core'
import { logPageLoad } from '@/src/services/logs'
import { useEffect } from 'react'

const disabled = !isFeatureEnabled('liquidity')

export default function CoverAddLiquidityDetails () {
  const router = useRouter()
  const { account } = useWeb3React()
  const { coverId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String('')

  useEffect(() => {
    logPageLoad(account ?? null, router.pathname)
  }, [account, router.pathname])

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name='description'
          content='Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment.'
        />
      </Head>

      <CoverStatsProvider coverKey={coverKey} productKey={productKey}>
        <LiquidityFormsProvider coverKey={coverKey}>
          <CoverAddLiquidityDetailsPage />
        </LiquidityFormsProvider>
      </CoverStatsProvider>
    </>
  )
}
