import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { useNetwork } from '@/src/context/Network'
import { CoverPurchaseDetailsPage } from '@/src/modules/cover/purchase'

export default function CoverPurchaseDetails () {
  const { networkId } = useNetwork()

  const disabled = !isFeatureEnabled('policy', networkId)

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
