import {
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { Seo } from '@/common/Seo'
import { Routes } from '@/src/config/routes'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { isValidProduct } from '@/src/helpers/cover'
import {
  useFetchCoverProductActiveReportings
} from '@/src/hooks/useFetchCoverProductActiveReportings'
import {
  CoverReportingRules
} from '@/src/modules/reporting/CoverReportingRules'
import {
  NewIncidentReportForm
} from '@/src/modules/reporting/NewIncidentReportForm'
import { ReportingHero } from '@/src/modules/reporting/ReportingHero'
import { Trans } from '@lingui/macro'

export function NewIncidentReportPage ({ coverKey, productKey }) {
  const [accepted, setAccepted] = useState(false)
  const router = useRouter()

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
          <NewIncidentReportForm
            coverKey={coverKey}
            productKey={productKey}
            minReportingStake={coverOrProductData?.minReportingStake}
          />
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
