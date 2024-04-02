import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { slugToNetworkId } from '@/src/config/networks'
import { CoverPurchaseDetailsPage } from '@/src/modules/cover/purchase'
import {
  getDescription,
  getTitle
} from '@/src/ssg/seo'
import { getNetworksAndProducts } from '@/src/ssg/static-paths'

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
      disabled: !isFeatureEnabled('policy', slugToNetworkId[params.network]),
      seo: {
        title: getTitle({
          coverId: params.coverId,
          productId: params.productId,
          networkId: slugToNetworkId[params.network],
          pageAction: 'Purchase Policy'
        }),
        description: getDescription(params.coverId, params.productId, slugToNetworkId[params.network])
      }
    }
  }
}

export default function CoverPurchaseDetails ({ disabled, seo }) {
  if (disabled) {
    return <ComingSoon />
  }

  return (
    <>
      <Seo title={seo.title} description={seo.description} />

      <CoverPurchaseDetailsPage />
    </>
  )
}
