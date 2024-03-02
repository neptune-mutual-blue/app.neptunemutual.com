import { useRouter } from 'next/router'

import { ComingSoon } from '@/common/ComingSoon'
import { NewIncidentReportPage } from '@/modules/reporting/new'
import { isFeatureEnabled } from '@/src/config/environment'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useNetwork } from '@/src/context/Network'

export default function ReportingNewCoverPage () {
  const router = useRouter()
  const { productId, coverId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')
  const { networkId } = useNetwork()

  const disabled = !isFeatureEnabled('reporting', networkId)
  if (disabled) {
    return <ComingSoon />
  }

  return (
    <NewIncidentReportPage
      coverKey={coverKey}
      productKey={productKey}
    />

  )
}
