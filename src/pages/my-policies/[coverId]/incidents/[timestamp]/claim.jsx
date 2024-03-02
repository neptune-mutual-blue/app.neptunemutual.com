import { useRouter } from 'next/router'

import { ClaimDetailsPage } from '@/modules/my-policies/ClaimDetailsPage'
import { isFeatureEnabled } from '@/src/config/environment'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useNetwork } from '@/src/context/Network'

export default function ClaimPolicyDedicatedCover () {
  const { networkId } = useNetwork()
  const disabled = !isFeatureEnabled('claim', networkId)
  const router = useRouter()
  const { coverId, productId, timestamp } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  return (
    <ClaimDetailsPage
      disabled={disabled}
      coverKey={coverKey}
      productKey={productKey}
      timestamp={timestamp}
    />
  )
}
