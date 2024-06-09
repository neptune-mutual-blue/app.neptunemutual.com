import { useRouter } from 'next/router'

import { Seo } from '@/common/Seo'
import {
  SingleCoverTermsPage
} from '@/modules/cover/cover-terms/SingleCoverTermsPage'
import { useCoversAndProducts } from '@/src/context/CoversAndProductsData'
import { isValidProduct } from '@/src/helpers/cover'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

export default function CoverPage () {
  const router = useRouter()
  const { loading, getProduct, getCoverByCoverKey } = useCoversAndProducts()

  const { coverId, productId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId)

  const isDiversifiedProduct = isValidProduct(productKey)
  const productData = isDiversifiedProduct ? getProduct(coverKey, productKey) : getCoverByCoverKey(coverKey)

  return (
    <main>
      <Seo />

      <div className='px-8 pt-8 bg-white md:pt-14 sm:px-12 md:px-20 lg:px-36 xl:px-56 pb-14 text-000000'>
        <SingleCoverTermsPage
          loading={loading}
          coverOrProductData={productData}
        />
      </div>
    </main>
  )
}
