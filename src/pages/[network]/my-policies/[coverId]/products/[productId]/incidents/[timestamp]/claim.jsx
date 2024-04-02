import { useRouter } from 'next/router'

import { ClaimDetailsPage } from '@/modules/my-policies/ClaimDetailsPage'
import { isFeatureEnabled } from '@/src/config/environment'
import { useNetwork } from '@/src/context/Network'
import { getTitle } from '@/src/ssg/seo'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

export default function ClaimPolicyDiversifiedProduct () {
  const { networkId } = useNetwork()
  const disabled = !isFeatureEnabled('claim', networkId)
  const router = useRouter()
  const { coverId, productId, timestamp } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const title = getTitle({
    coverId,
    productId,
    networkId,
    pageAction: 'Claim Policy'
  })

  return (
    <ClaimDetailsPage
      disabled={disabled}
      coverKey={coverKey}
      productKey={productKey}
      timestamp={timestamp}
      title={title}
    />
  )
}
