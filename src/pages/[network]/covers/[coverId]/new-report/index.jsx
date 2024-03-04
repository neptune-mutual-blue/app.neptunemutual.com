import { useRouter } from 'next/router'

import { ComingSoon } from '@/common/ComingSoon'
import { NewIncidentReportPage } from '@/modules/reporting/new'
import { isFeatureEnabled } from '@/src/config/environment'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useNetwork } from '@/src/context/Network'

import { getNetworksAndCovers } from '@/src/ssg/static-paths'
import { slugToNetworkId } from '@/src/config/networks'

export const getStaticPaths = async () => {
  return {
    paths: getNetworksAndCovers(),
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      networkId: slugToNetworkId[params.network],
      coverId: params.coverId
    }
  }
}

export default function ReportingNewCoverPage () {
  const router = useRouter()
  const { coverId, productId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const { networkId } = useNetwork()
  const disabled = !isFeatureEnabled('reporting', networkId)

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
