import dynamic from 'next/dynamic'

import { ComingSoon } from '@/common/ComingSoon'
import { NoDataFound } from '@/common/Loading'
import { Seo } from '@/common/Seo'
import {
  ReportDetailsSkeleton
} from '@/modules/reporting/ReportDetailsSkeleton'
import { isFeatureEnabled } from '@/src/config/environment'
import { slugToNetworkId } from '@/src/config/networks'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { isValidProduct } from '@/src/helpers/cover'
import { useFetchReport } from '@/src/hooks/useFetchReport'
import { getTitle } from '@/src/ssg/seo'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

export async function getStaticPaths () {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps ({ params }) {
  const networkId = slugToNetworkId[params.network]

  if (!networkId) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      networkId,
      coverId: params.coverId,
      productId: params.productId,
      timestamp: params.timestamp,
      title: getTitle({
        networkId: slugToNetworkId[params.network],
        coverId: params.coverId,
        productId: params.productId,
        pageAction: 'Incident Report Details for #COVER on #NETWORK marketplace'
      })
    },
    revalidate: 10 // In seconds
  }
}

export default function IncidentResolvedCoverPage ({ networkId, coverId, productId, timestamp, title }) {
  const disabled = !isFeatureEnabled('reporting', networkId)
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
      <Seo title={title} />

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

const DynamicReportingDetailPage = dynamic(() => { return import('@/src/modules/reporting/details').then((mod) => { return mod.ReportingDetailsPage }) }, {
  loading: () => { return <ReportDetailsSkeleton /> }
})

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
    return <ReportDetailsSkeleton />
  }

  if (!incidentReportData || !coverOrProductData) {
    return (
      <NoDataFound />
    )
  }

  return (
    <DynamicReportingDetailPage
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
