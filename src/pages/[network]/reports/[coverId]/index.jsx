import { Seo } from '@/common/Seo'
import { slugToNetworkId } from '@/src/config/networks'
import { useLanguageContext } from '@/src/i18n/i18n'
import ReportListing from '@/src/modules/reporting/ReportListing'
import { getTitle } from '@/src/ssg/seo'
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
      coverId: params.coverId,
      title: getTitle({
        networkId: slugToNetworkId[params.network],
        coverId: params.coverId,
        pageAction: 'Report Listing'
      })
    }
  }
}

export default function Index ({ coverId, productId, title }) {
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const { locale } = useLanguageContext()

  return (
    <>
      <Seo title={title} />
      <ReportListing
        locale={locale}
        coverKey={coverKey}
        productKey={productKey}
      />
    </>
  )
}
