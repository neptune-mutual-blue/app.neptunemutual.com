
import { ComingSoon } from '@/common/ComingSoon'
import { NewIncidentReportPage } from '@/modules/reporting/new'
import { isFeatureEnabled } from '@/src/config/environment'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

import { getNetworksAndCovers } from '@/src/ssg/static-paths'
import { slugToNetworkId } from '@/src/config/networks'
import { getDescription, getTitle } from '@/src/ssg/seo'
import { Seo } from '@/common/Seo'

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
      coverId: params.coverId,
      seo: {
        title: getTitle(params.coverId, undefined, slugToNetworkId[params.network]),
        description: getDescription(params.coverId, undefined, slugToNetworkId[params.network])
      }
    }
  }
}

export default function ReportingNewCoverPage ({ seo, networkId, coverId, productId }) {
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const disabled = !isFeatureEnabled('reporting', networkId)

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo title={seo.title} description={seo.description} />
      <NewIncidentReportPage
        coverKey={coverKey}
        productKey={productKey}
      />
    </main>
  )
}
