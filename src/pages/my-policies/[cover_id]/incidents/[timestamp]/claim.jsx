import { isFeatureEnabled } from '@/src/config/environment'
import { ClaimDetailsPage } from '@/modules/my-policies/ClaimDetailsPage'
import { useRouter } from 'next/router'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

const disabled = !isFeatureEnabled('claim')

export default function ClaimPolicyDedicatedCover () {
  const router = useRouter()
  const { cover_id, product_id, timestamp } = router.query
  const coverKey = safeFormatBytes32String(cover_id)
  const productKey = safeFormatBytes32String(product_id || '')

  return (
    <ClaimDetailsPage
      disabled={disabled}
      coverKey={coverKey}
      productKey={productKey}
      timestamp={timestamp}
    />
  )
}
