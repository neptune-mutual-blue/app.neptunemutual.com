import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Trans } from '@lingui/macro'
import { CoverReportingRules } from '@/src/modules/reporting/CoverReportingRules'
import { NewIncidentReportForm } from '@/src/modules/reporting/NewIncidentReportForm'
import { ReportingHero } from '@/src/modules/reporting/ReportingHero'
import { useFetchCoverProductActiveReportings } from '@/src/hooks/useFetchCoverProductActiveReportings'
import { Routes } from '@/src/config/routes'
import { logReportIncidentRulesAccepted } from '@/src/services/logs'
import { useWeb3React } from '@web3-react/core'
import { analyticsLogger } from '@/utils/logger'
import { Seo } from '@/common/Seo'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { isValidProduct } from '@/src/helpers/cover'

export function NewIncidentReportPage ({ coverKey, productKey }) {
  const [accepted, setAccepted] = useState(false)
  const router = useRouter()
  const { account, chainId } = useWeb3React()

  const isDiversified = isValidProduct(productKey)
  const { loading, getProduct, getCoverByCoverKey } = useCoversAndProducts2()
  const coverOrProductData = isDiversified ? getProduct(coverKey, productKey) : getCoverByCoverKey(coverKey)

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

  if (!coverOrProductData) {
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
      <ReportingHero
        coverKey={coverKey}
        productKey={productKey}
        coverOrProductData={coverOrProductData}
        type='new-report'
      />
      <hr className='border-B0C4DB' />

      {accepted
        ? (
          <NewIncidentReportForm coverKey={coverKey} productKey={productKey} />
          )
        : (
          <CoverReportingRules
            coverOrProductData={coverOrProductData}
            handleAcceptRules={handleAcceptRules}
            activeReportings={activeReportings}
          />
          )}
    </main>
  )
}
