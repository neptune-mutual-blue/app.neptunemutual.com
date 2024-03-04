import { useRouter } from 'next/router'

import { ComingSoon } from '@/common/ComingSoon'
import { NewIncidentReportPage } from '@/modules/reporting/new'
import { isFeatureEnabled } from '@/src/config/environment'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

import { getNetworksAndProducts } from '@/src/ssg/static-paths'
import { slugToNetworkId } from '@/src/config/networks'

export const getStaticPaths = async () => {
  return {
    paths: getNetworksAndProducts(),
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      networkId: slugToNetworkId[params.network],
      coverId: params.coverId,
      productId: params.productId,
      disabled: !isFeatureEnabled('reporting', slugToNetworkId[params.network])
    }
  }
}

export default function ReportingNewCoverPage ({ disabled }) {
  const router = useRouter()
  const { productId, coverId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <NewIncidentReportPage
      coverKey={coverKey}
      productKey={productKey}
    />

  )
}
