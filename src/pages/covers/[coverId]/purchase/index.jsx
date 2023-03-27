import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { CoverPurchaseDetailsPage } from '@/src/modules/cover/purchase'

const disabled = !isFeatureEnabled('policy')

export default function CoverPurchaseDetails () {
  if (disabled) {
    return <ComingSoon />
  }

  return (
    <>
      <Seo />

      <CoverPurchaseDetailsPage />
    </>
  )
}
