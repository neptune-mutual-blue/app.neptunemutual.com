import { useRouter } from 'next/router'
import { useFetchReport } from '@/src/hooks/useFetchReport'
import { ReportingDetailsPage } from '@/src/modules/reporting/details'
import { ComingSoon } from '@/common/ComingSoon'
import { isFeatureEnabled } from '@/src/config/environment'
import { Trans } from '@lingui/macro'
import { CoverStatsProvider } from '@/common/Cover/CoverStatsContext'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { Seo } from '@/common/Seo'

const disabled = !isFeatureEnabled('reporting')

export default function IncidentResolvedCoverPage () {
  const router = useRouter()
  const { coverId, productId, timestamp } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const { data: incidentReportData, loading, refetch } = useFetchReport({
    coverKey: coverKey,
    productKey: productKey,
    incidentDate: timestamp
  })

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <CoverStatsProvider coverKey={coverKey} productKey={productKey}>
      <main>
        <Seo />

        <Content
          coverKey={coverKey}
          productKey={productKey}
          loading={loading}
          incidentReportData={incidentReportData}
          refetch={refetch}
        />
      </main>
    </CoverStatsProvider>
  )
}

function Content ({ loading, incidentReportData, refetch, coverKey, productKey }) {
  if (loading) {
    return (
      <p className='text-center'>
        <Trans>loading...</Trans>
      </p>
    )
  }

  if (!incidentReportData) {
    return (
      <p className='text-center'>
        <Trans>No data found</Trans>
      </p>
    )
  }

  return (
    <ReportingDetailsPage
      coverKey={coverKey}
      productKey={productKey}
      incidentReport={incidentReportData}
      refetchReport={refetch}
    />
  )
}
