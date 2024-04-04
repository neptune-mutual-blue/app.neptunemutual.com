import { Seo } from '@/common/Seo'
import {
  SingleCoverTermsPage
} from '@/modules/cover/cover-terms/SingleCoverTermsPage'
import { slugToNetworkId } from '@/src/config/networks'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { isValidProduct } from '@/src/helpers/cover'
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
          pageAction: 'Cover Terms for #COVER on #NETWORK marketplace'
        }),
        description: getDescription(params.coverId, params.productId, slugToNetworkId[params.network])
      }
    }
  }
}

export default function CoverPage ({ seo, coverId, productId }) {
  const { loading, getProduct, getCoverByCoverKey } = useCoversAndProducts2()

  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId)

  const isDiversifiedProduct = isValidProduct(productKey)
  const productData = isDiversifiedProduct ? getProduct(coverKey, productKey) : getCoverByCoverKey(coverKey)

  return (
    <main>
      <Seo title={seo.title} description={seo.description} />

      <div className='px-8 pt-8 bg-white md:pt-14 sm:px-12 md:px-20 lg:px-36 xl:px-56 pb-14 text-000000'>
        <SingleCoverTermsPage
          loading={loading}
          coverOrProductData={productData}
        />
      </div>
    </main>
  )
}
