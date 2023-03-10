
import { useRouter } from 'next/router'

import { ProductsGrid } from '@/common/ProductsGrid/ProductsGrid'
import { Seo } from '@/common/Seo'
import { HomeHero } from '@/modules/home/Hero'
import { CoverOptionsPage } from '@/src/modules/cover/CoverOptionsPage'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'

export default function CoverPage () {
  const router = useRouter()
  const { coverId, productId } = router.query

  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const { getCoverByCoverKey, loading } = useCoversAndProducts2()
  const coverData = getCoverByCoverKey(coverKey)

  return (
    <main>
      <Seo />
      <Content
        loading={loading}
        coverData={coverData}
        coverKey={coverKey}
        productKey={productKey}
      />
    </main>
  )
}

function Content ({ loading, coverData, coverKey, productKey }) {
  if (loading) {
    return <p className='text-center'>loading...</p>
  }

  if (!coverData) {
    return <p className='text-center'>No Data Found</p>
  }

  const isDiversified = coverData?.coverInfoDetails?.supportsProducts

  return (isDiversified
    ? (
      <div className='min-h-screen'>
        <HomeHero />
        <ProductsGrid />
      </div>
      )
    : (
      <CoverOptionsPage
        coverKey={coverKey}
        productKey={productKey}
        coverOrProductData={coverData}
        isDiversified={isDiversified}
      />)
  )
}
