import { isFeatureEnabled } from '@/src/config/environment'
import { ClaimDetailsPage } from '@/modules/my-policies/ClaimDetailsPage'
import { useRouter } from 'next/router'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

const disabled = !isFeatureEnabled('claim')

export default function ClaimPolicyDiversifiedProduct () {
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
