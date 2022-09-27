import { useRouter } from 'next/router'
import { ComingSoon } from '@/common/ComingSoon'
import { isV2BasketCoverEnabled } from '@/src/config/environment'
import { CoverStatsProvider } from '@/common/Cover/CoverStatsContext'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { NewIncidentReportPage } from '@/modules/reporting/new'

const disabled = !isV2BasketCoverEnabled()

export default function ReportingNewCoverPage () {
  const router = useRouter()
  const { productId, coverId } = router.query
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
