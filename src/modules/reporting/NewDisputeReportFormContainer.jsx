import { Alert } from '@/common/Alert/Alert'
import { Container } from '@/common/Container/Container'
import DateLib from '@/lib/date/DateLib'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { isValidProduct } from '@/src/helpers/cover'
import { useFetchReport } from '@/src/hooks/useFetchReport'
import {
  NewDisputeReportForm
} from '@/src/modules/reporting/NewDisputeReportForm'
import { ReportingHero } from '@/src/modules/reporting/ReportingHero'
import { isGreater } from '@/utils/bn'
import { Trans } from '@lingui/macro'

export function NewDisputeReportFormContainer ({ coverKey, productKey, timestamp }) {
  const isDiversified = isValidProduct(productKey)
  const { loading: dataLoading, getProduct, getCoverByCoverKey } = useCoversAndProducts2()
  const coverOrProductData = isDiversified ? getProduct(coverKey, productKey) : getCoverByCoverKey(coverKey)

  if (dataLoading) {
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

  const projectOrProductName = isDiversified ? coverOrProductData?.productInfoDetails?.productName : coverOrProductData?.coverInfoDetails.coverName || coverOrProductData?.coverInfoDetails.projectName

  return (
    <>
      {/* hero */}
      <ReportingHero
        coverKey={coverKey}
        productKey={productKey}
        coverOrProductData={coverOrProductData}
        projectOrProductName={projectOrProductName}
        incidentDate={timestamp}
        type='new-dispute'
      />
      <hr className='border-t border-t-B0C4DB' />

      <DisputeForm
        coverKey={coverKey}
        productKey={productKey}
        timestamp={timestamp}
        minReportingStake={coverOrProductData.minReportingStake}
      />
    </>
  )
}

function DisputeForm ({ coverKey, productKey, timestamp, minReportingStake }) {
  const { data: incidentReportData, loading } = useFetchReport({
    coverKey: coverKey,
    productKey: productKey,
    incidentDate: timestamp
  })

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

  const now = DateLib.unix()
  const reportingEnded = incidentReportData
    ? isGreater(now, incidentReportData.resolutionTimestamp || '0')
    : false

  const canDispute = !reportingEnded && incidentReportData?.totalRefutedCount === '0'

  return (
    canDispute
      ? (
        <NewDisputeReportForm incidentReport={incidentReportData} minReportingStake={minReportingStake} />
        )
      : (
        <Container className='py-16'>
          <Alert>
            <Trans>Not applicable for disputing</Trans>
          </Alert>
        </Container>
        )
  )
}
