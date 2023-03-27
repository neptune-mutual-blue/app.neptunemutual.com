import { useRouter } from 'next/router'

import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { isValidProduct } from '@/src/helpers/cover'
import { useFetchReport } from '@/src/hooks/useFetchReport'
import { ReportingDetailsPage } from '@/src/modules/reporting/details'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { Trans } from '@lingui/macro'

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
  )
}

function Content ({ loading, incidentReportData, refetch, coverKey, productKey }) {
  const isDiversified = isValidProduct(productKey)
  const {
    loading: dataLoading,
    getProduct,
    getCoverByCoverKey,
    updateData: refetchCoverData
  } = useCoversAndProducts2()
  const coverOrProductData = isDiversified ? getProduct(coverKey, productKey) : getCoverByCoverKey(coverKey)
  const projectOrProductName = isDiversified ? coverOrProductData?.productInfoDetails?.productName : coverOrProductData?.coverInfoDetails.coverName || coverOrProductData?.coverInfoDetails.projectName
  const reporterCommission = coverOrProductData?.reporterCommission
  const minReportingStake = coverOrProductData?.minReportingStake

  if (loading || dataLoading) {
    return (
      <p className='text-center'>
        <Trans>loading...</Trans>
      </p>
    )
  }

  if (!incidentReportData || !coverOrProductData) {
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
      refetchCoverData={refetchCoverData}
      projectOrProductName={projectOrProductName}
      reporterCommission={reporterCommission}
      minReportingStake={minReportingStake}
      coverOrProductData={coverOrProductData}
    />
  )
}
