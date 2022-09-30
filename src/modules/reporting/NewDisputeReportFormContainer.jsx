import { useFetchReport } from '@/src/hooks/useFetchReport'
import { NewDisputeReportForm } from '@/src/modules/reporting/NewDisputeReportForm'
import { ReportingHero } from '@/src/modules/reporting/ReportingHero'
import { Container } from '@/common/Container/Container'
import { Alert } from '@/common/Alert/Alert'
import DateLib from '@/lib/date/DateLib'
import { isGreater } from '@/utils/bn'
import { Trans } from '@lingui/macro'
import { CoverStatsProvider } from '@/common/Cover/CoverStatsContext'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'

export function NewDisputeReportFormContainer ({ coverKey, productKey, timestamp }) {
  const coverInfo = useCoverOrProductData({
    coverKey: coverKey,
    productKey: productKey
  })
  const { data, loading } = useFetchReport({
    coverKey: coverKey,
    productKey: productKey,
    incidentDate: timestamp
  })

  if (!coverInfo) {
    return <Trans>loading...</Trans>
  }

  const now = DateLib.unix()
  const reportingEnded = data?.incidentReport
    ? isGreater(now, data.incidentReport.resolutionTimestamp || '0')
    : false

  const canDispute =
    !reportingEnded && data?.incidentReport?.totalRefutedCount === '0'

  return (
    <CoverStatsProvider coverKey={coverKey} productKey={productKey}>
      {/* hero */}
      <ReportingHero
        coverKey={coverKey}
        productKey={productKey}
        coverInfo={coverInfo}
        reportStatus={{
          resolved: data.incidentReport?.resolved,
          dispute: true
        }}
      />
      <hr className='border-t border-t-B0C4DB' />

      {loading && (
        <p className='text-center'>
          <Trans>loading...</Trans>
        </p>
      )}

      {!loading && !data.incidentReport && (
        <p className='text-center'>
          <Trans>No data found</Trans>
        </p>
      )}

      {data.incidentReport && (
        <div>
          {canDispute
            ? (
              <NewDisputeReportForm incidentReport={data.incidentReport} />
              )
            : (
              <Container className='py-16'>
                <Alert>
                  <Trans>Not applicable for disputing</Trans>
                </Alert>
              </Container>
              )}
        </div>
      )}
    </CoverStatsProvider>
  )
}
