import { isFeatureEnabled } from '@/src/config/environment'
import { ClaimDetailsPage } from '@/modules/my-policies/ClaimDetailsPage'
import { useRouter } from 'next/router'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { logPageLoad } from '@/src/services/logs'
import { useWeb3React } from '@web3-react/core'

const disabled = !isFeatureEnabled('claim')

export default function ClaimPolicyDedicatedCover () {
  const router = useRouter()
  const { coverId, productId, timestamp } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const { account } = useWeb3React()

  logPageLoad(account ?? null, router.pathname)

  return (
    <ClaimDetailsPage
      disabled={disabled}
      coverKey={coverKey}
      productKey={productKey}
      timestamp={timestamp}
    />
  )
}
