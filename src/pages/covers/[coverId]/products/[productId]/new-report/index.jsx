import { useRouter } from 'next/router'
import { ComingSoon } from '@/common/ComingSoon'
import { isDiversifiedCoversEnabled, isFeatureEnabled } from '@/src/config/environment'
import { CoverStatsProvider } from '@/common/Cover/CoverStatsContext'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { NewIncidentReportPage } from '@/modules/reporting/new'
import { logPageLoad } from '@/src/services/logs'
import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'
import { analyticsLogger } from '@/utils/logger'

const disabled = !isDiversifiedCoversEnabled() || !isFeatureEnabled('reporting')

export default function ReportingNewCoverPage () {
  const router = useRouter()
  const { account, chainId } = useWeb3React()
  const { productId, coverId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  useEffect(() => {
    analyticsLogger(() => logPageLoad(chainId ?? null, account ?? null, router.pathname))
  }, [account, chainId, router.pathname])

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <CoverStatsProvider coverKey={coverKey} productKey={productKey}>
      <NewIncidentReportPage coverKey={coverKey} productKey={productKey} />
    </CoverStatsProvider>
  )
}
