import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Trans } from '@lingui/macro'
import { CoverReportingRules } from '@/src/modules/reporting/CoverReportingRules'
import { NewIncidentReportForm } from '@/src/modules/reporting/NewIncidentReportForm'
import { ReportingHero } from '@/src/modules/reporting/ReportingHero'
import { useFetchCoverProductActiveReportings } from '@/src/hooks/useFetchCoverProductActiveReportings'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { Routes } from '@/src/config/routes'
import { logReportIncidentRulesAccepted } from '@/src/services/logs'
import { useWeb3React } from '@web3-react/core'
import { analyticsLogger } from '@/utils/logger'
import { Seo } from '@/common/Seo'

export function NewIncidentReportPage ({
  coverKey,
  productKey
}) {
  const [accepted, setAccepted] = useState(false)
  const router = useRouter()
  const { account, chainId } = useWeb3React()

  const { coverInfo, loading } = useCoverOrProductData({
    coverKey: coverKey,
    productKey: productKey
  })
  const { data: activeReportings } = useFetchCoverProductActiveReportings({
    coverKey,
    productKey
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [accepted])

  // Redirect to active reporting if exists
  useEffect(() => {
    const hasActiveReportings = activeReportings && activeReportings.length > 0

    if (!hasActiveReportings) return

    router.replace(
      Routes.ViewReport(coverKey, productKey, activeReportings[0].incidentDate)
    )
  }, [activeReportings, coverKey, productKey, router])

  if (loading) {
    return (
      <p className='text-center'>
        <Trans>loading...</Trans>
      </p>
    )
  }
  if (!loading && !coverInfo) {
    return (
      <p className='text-center'>
        <Trans>No Data Found</Trans>
      </p>
    )
  }

  const isDiversified = coverInfo?.supportsProducts

  if (!loading && isDiversified) {
    return (
      <p className='text-center'>
        <Trans>No Data Found</Trans>
      </p>
    )
  }

  const handleAcceptRules = () => {
    setAccepted(true)
    analyticsLogger(() => logReportIncidentRulesAccepted(chainId ?? null, account ?? null, coverKey, productKey))
  }

  return (
    <main>
      <Seo />

      {/* hero */}
      <ReportingHero coverKey={coverKey} productKey={productKey} coverInfo={coverInfo} />
      <hr className='border-B0C4DB' />

      {accepted
        ? (
          <NewIncidentReportForm coverKey={coverKey} productKey={productKey} />
          )
        : (
          <CoverReportingRules
            coverInfo={coverInfo}
            handleAcceptRules={handleAcceptRules}
            activeReportings={activeReportings}
          />
          )}
    </main>
  )
}
