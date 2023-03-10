import { CoverOptionsPage } from '@/src/modules/cover/CoverOptionsPage'
import { useRouter } from 'next/router'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { isValidProduct } from '@/src/helpers/cover'
import { Seo } from '@/common/Seo'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { Trans } from '@lingui/macro'

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
      <p className='text-center'>
        <Trans>loading...</Trans>
      </p>
    )
  }

  if (!productData) {
    return (
      <p className='text-center'>
        <Trans>No Data Found</Trans>
      </p>
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
