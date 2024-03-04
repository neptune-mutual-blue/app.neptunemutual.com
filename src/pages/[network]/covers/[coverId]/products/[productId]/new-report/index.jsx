
import { ComingSoon } from '@/common/ComingSoon'
import { NewIncidentReportPage } from '@/modules/reporting/new'
import { isFeatureEnabled } from '@/src/config/environment'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

import { getNetworksAndProducts } from '@/src/ssg/static-paths'
import { slugToNetworkId } from '@/src/config/networks'
import { getDescription, getTitle } from '@/src/ssg/seo'
import { Seo } from '@/common/Seo'

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
      disabled: !isFeatureEnabled('reporting', slugToNetworkId[params.network]),
      seo: {
        title: getTitle(params.coverId, params.productId, slugToNetworkId[params.network]),
        description: getDescription(params.coverId, params.productId, slugToNetworkId[params.network])
      }
    }
  }
}

export default function ReportingNewCoverPage ({ disabled, seo, coverId, productId }) {
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

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
