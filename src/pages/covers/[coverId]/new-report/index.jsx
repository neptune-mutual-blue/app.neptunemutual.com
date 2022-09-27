import { useRouter } from 'next/router'
import { ComingSoon } from '@/common/ComingSoon'
import { isFeatureEnabled } from '@/src/config/environment'
import { CoverStatsProvider } from '@/common/Cover/CoverStatsContext'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { NewIncidentReportPage } from '@/modules/reporting/new'

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
    <CoverStatsProvider coverKey={coverKey} productKey={productKey}>
      <NewIncidentReportPage coverKey={coverKey} productKey={productKey} />
    </CoverStatsProvider>
  )
}
