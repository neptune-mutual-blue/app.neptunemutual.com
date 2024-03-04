import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { CoverPurchaseDetailsPage } from '@/src/modules/cover/purchase'

import { slugToNetworkId } from '@/src/config/networks'
import { getNetworksAndCovers } from '@/src/ssg/static-paths'

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
      disabled: !isFeatureEnabled('policy', slugToNetworkId[params.network])
    }
  }
}

export default function CoverPurchaseDetails ({ disabled }) {
  if (disabled) {
    return <ComingSoon />
  }

  return (
    <>
      <Seo />

      <CoverPurchaseDetailsPage />
    </>
  )
}
