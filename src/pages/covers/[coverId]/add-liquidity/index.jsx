import { useRouter } from 'next/router'

import { ComingSoon } from '@/common/ComingSoon'
import {
  LiquidityFormsProvider
} from '@/common/LiquidityForms/LiquidityFormsContext'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { CoverAddLiquidityDetailsPage } from '@/src/modules/cover/add-liquidity'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useNetwork } from '@/src/context/Network'

export default function CoverAddLiquidityDetails () {
  const router = useRouter()
  const { networkId } = useNetwork()
  const { coverId } = router.query
  const coverKey = safeFormatBytes32String(coverId)

  const disabled = !isFeatureEnabled('liquidity', networkId)

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <>
      <Seo />

      <LiquidityFormsProvider coverKey={coverKey}>
        <CoverAddLiquidityDetailsPage />
      </LiquidityFormsProvider>

    </>
  )
}
