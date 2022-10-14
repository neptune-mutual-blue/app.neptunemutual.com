import { useRouter } from 'next/router'
import { ComingSoon } from '@/common/ComingSoon'
import { isFeatureEnabled } from '@/src/config/environment'
import { CoverStatsProvider } from '@/common/Cover/CoverStatsContext'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { NewIncidentReportPage } from '@/modules/reporting/new'
import { useWeb3React } from '@web3-react/core'
import { logPageLoad } from '@/src/services/logs'

const disabled = !isFeatureEnabled('reporting')

export default function ReportingNewCoverPage () {
  const router = useRouter()
  const { account } = useWeb3React()
  const { coverId, productId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  logPageLoad(account ?? null, router.pathname)

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <CoverStatsProvider coverKey={coverKey} productKey={productKey}>
      <NewIncidentReportPage coverKey={coverKey} productKey={productKey} />
    </CoverStatsProvider>
  )
}
