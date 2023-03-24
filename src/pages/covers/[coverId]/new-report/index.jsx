import { useRouter } from 'next/router'

import { ComingSoon } from '@/common/ComingSoon'
import { NewIncidentReportPage } from '@/modules/reporting/new'
import { isFeatureEnabled } from '@/src/config/environment'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

const disabled = !isFeatureEnabled('reporting')

export default function ReportingNewCoverPage () {
  const router = useRouter()
  const { coverId, productId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

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
