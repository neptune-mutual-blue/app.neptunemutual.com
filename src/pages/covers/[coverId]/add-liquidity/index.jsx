import { useRouter } from 'next/router'

import { ComingSoon } from '@/common/ComingSoon'
import {
  LiquidityFormsProvider
} from '@/common/LiquidityForms/LiquidityFormsContext'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { CoverAddLiquidityDetailsPage } from '@/src/modules/cover/add-liquidity'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

const disabled = !isFeatureEnabled('liquidity')

export default function CoverAddLiquidityDetails () {
  const router = useRouter()
  const { coverId } = router.query
  const coverKey = safeFormatBytes32String(coverId)

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
