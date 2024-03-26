import { useRouter } from 'next/router'

import { Seo } from '@/common/Seo'
import { slugToNetworkId } from '@/src/config/networks'
import { useLanguageContext } from '@/src/i18n/i18n'
import ReportListing from '@/src/modules/reporting/ReportListing'
import { getNetworksAndCovers } from '@/src/ssg/static-paths'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

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

  const { locale } = useLanguageContext()

  return (
    <>
      <Seo />
      <ReportListing
        locale={locale}
        coverKey={coverKey}
        productKey={productKey}
      />
    </>
  )
}
