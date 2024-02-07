import { useRouter } from 'next/router'

import {
  Loading,
  NoDataFound
} from '@/common/Loading'
import { Seo } from '@/common/Seo'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { isValidProduct } from '@/src/helpers/cover'
import { CoverOptionsPage } from '@/src/modules/cover/CoverOptionsPage'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

export default function Options () {
  const router = useRouter()
  const { coverId, productId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const { loading, getProduct } = useCoversAndProducts2()
  const productData = getProduct(coverKey, productKey)

  return (
    <main>
      <Seo />

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
