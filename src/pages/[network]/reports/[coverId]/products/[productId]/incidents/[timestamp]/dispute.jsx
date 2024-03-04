import { useRouter } from 'next/router'

import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import {
  NewDisputeReportFormContainer
} from '@/modules/reporting/NewDisputeReportFormContainer'
import { isFeatureEnabled } from '@/src/config/environment'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useNetwork } from '@/src/context/Network'

export default function DisputeFormPage () {
  const { networkId } = useNetwork()

  const disabled = !isFeatureEnabled('reporting', networkId)
  const router = useRouter()
  const { coverId, productId, timestamp } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo />

      <NewDisputeReportFormContainer coverKey={coverKey} productKey={productKey} timestamp={timestamp} />
    </main>
  )
}
