import { useRouter } from 'next/router'

import { Seo } from '@/common/Seo'
import ReportListing from '@/src/modules/reporting/ReportListing'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

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
      coverId: params.coverId
    }
  }
}

export default function Index () {
  const router = useRouter()
  const { coverId, productId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  return (
    <>
      <Seo />
      <ReportListing
        locale={router.locale}
        coverKey={coverKey}
        productKey={productKey}
      />
    </>
  )
}
