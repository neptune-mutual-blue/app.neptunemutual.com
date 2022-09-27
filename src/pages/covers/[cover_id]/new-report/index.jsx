import { useRouter } from 'next/router'
import { ComingSoon } from '@/common/ComingSoon'
import { isFeatureEnabled } from '@/src/config/environment'
import { CoverStatsProvider } from '@/common/Cover/CoverStatsContext'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { NewIncidentReportPage } from '@/modules/reporting/new'

const disabled = !isFeatureEnabled('reporting')

export default function ReportingNewCoverPage () {
  const router = useRouter()
  const { cover_id, product_id } = router.query
  const coverKey = safeFormatBytes32String(cover_id)
  const productKey = safeFormatBytes32String(product_id || '')

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <CoverStatsProvider coverKey={coverKey} productKey={productKey}>
      <NewIncidentReportPage />
    </CoverStatsProvider>
  )
}
