import { isFeatureEnabled } from '@/src/config/environment'
import { ClaimDetailsPage } from '@/modules/my-policies/ClaimDetailsPage'
import { useRouter } from 'next/router'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useWeb3React } from '@web3-react/core'
import { logPageLoad } from '@/src/services/logs'
import { useEffect } from 'react'
import { analyticsLogger } from '@/utils/logger'

const disabled = !isFeatureEnabled('claim')

export default function ClaimPolicyDiversifiedProduct () {
  const router = useRouter()
  const { coverId, productId, timestamp } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const { account } = useWeb3React()

  useEffect(() => {
    analyticsLogger(() => logPageLoad(account ?? null, router.pathname))
  }, [account, router.pathname])

  return (
    <ClaimDetailsPage
      disabled={disabled}
      coverKey={coverKey}
      productKey={productKey}
      timestamp={timestamp}
    />
  )
}
