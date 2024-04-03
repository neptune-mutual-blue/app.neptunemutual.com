import { Seo } from '@/common/Seo'
import { slugToNetworkId } from '@/src/config/networks'
import { useLanguageContext } from '@/src/i18n/i18n'
import ReportListing from '@/src/modules/reporting/ReportListing'
import {
  getDescription,
  getTitle
} from '@/src/ssg/seo'
import { getNetworksAndProducts } from '@/src/ssg/static-paths'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

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
      seo: {
        title: getTitle({
          coverId: params.coverId,
          productId: params.productId,
          networkId: slugToNetworkId[params.network],
          pageAction: 'Report Listing for #COVER on #NETWORK marketplace'
        }),
        description: getDescription(params.coverId, params.productId, slugToNetworkId[params.network])
      }
    }
  }
}

export default function Index ({ coverId, productId, seo }) {
  const { locale } = useLanguageContext()
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  return (
    <>
      <Seo title={seo.title} description={seo.description} />
      <ReportListing
        locale={locale}
        coverKey={coverKey}
        productKey={productKey}
      />
    </>
  )
}
