import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import {
  NewDisputeReportFormContainer
} from '@/modules/reporting/NewDisputeReportFormContainer'
import { isFeatureEnabled } from '@/src/config/environment'
import { slugToNetworkId } from '@/src/config/networks'
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
      timestamp: params.timestamp,
      title: getTitle({
        networkId: slugToNetworkId[params.network],
        coverId: params.coverId,
        productId: params.productId,
        pageAction: 'Dispute Report'
      })
    },
    revalidate: 10 // In seconds
  }
}

export default function DisputeFormPage ({ networkId, coverId, productId, timestamp, title }) {
  const disabled = !isFeatureEnabled('reporting', networkId)
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo title={title} />

      <NewDisputeReportFormContainer coverKey={coverKey} productKey={productKey} timestamp={timestamp} />
    </main>
  )
}
