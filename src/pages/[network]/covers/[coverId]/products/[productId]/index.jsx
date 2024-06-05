import {
  Loading,
  NoDataFound
} from '@/common/Loading'
import { Seo } from '@/common/Seo'
import { slugToNetworkId } from '@/src/config/networks'
import { useCoversAndProducts } from '@/src/context/CoversAndProductsData'
import { isValidProduct } from '@/src/helpers/cover'
import { CoverOptionsPage } from '@/src/modules/cover/CoverOptionsPage'
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
          pageAction: '#COVER on Neptune Mutual #NETWORK marketplace'
        }),
        description: getDescription(params.coverId, params.productId, slugToNetworkId[params.network])
      }
    }
  }
}

export default function Options ({ seo, coverId, productId }) {
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const { loading, getProduct } = useCoversAndProducts()
  const productData = getProduct(coverKey, productKey)

  return (
    <main>
      <Seo title={seo.title} description={seo.description} />

      <Content
        loading={loading}
        productData={productData}
        coverKey={coverKey}
        productKey={productKey}
      />

    </main>
  )
}

function Content ({ loading, productData, coverKey, productKey }) {
  if (loading) {
    return (
      <Loading />
    )
  }

  if (!productData) {
    return (
      <NoDataFound />
    )
  }

  return (
    <CoverOptionsPage
      coverKey={coverKey}
      productKey={productKey}
      coverOrProductData={productData}
      isDiversified={isValidProduct(productKey)}
    />
  )
}
