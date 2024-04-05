import { ClaimDetailsPage } from '@/modules/my-policies/ClaimDetailsPage'
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
        networkId,
        coverId: params.coverId,
        pageAction: 'Claim Policy on #COVER on #NETWORK marketplace'
      })
    },
    revalidate: 10 // In seconds
  }
}

export default function ClaimPolicyDedicatedCover ({ networkId, coverId, timestamp, title }) {
  const disabled = !isFeatureEnabled('claim', networkId)
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String('')

  return (
    <ClaimDetailsPage
      disabled={disabled}
      coverKey={coverKey}
      productKey={productKey}
      timestamp={timestamp}
      title={title}
    />
  )
}
