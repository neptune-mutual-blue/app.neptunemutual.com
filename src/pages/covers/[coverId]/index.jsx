import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { NoDataFound } from '@/common/Loading'
import { ProductsGrid } from '@/common/ProductsGrid/ProductsGrid'
import { Seo } from '@/common/Seo'
import { HomeHeroSkeleton } from '@/modules/home/HomeHeroSkeleton'
import { ProductsGridSkeleton } from '@/modules/home/ProductsGridSkeleton'
import { useCoversAndProducts } from '@/src/context/CoversAndProductsData'
import { CoverOptionsPage } from '@/src/modules/cover/CoverOptionsPage'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

const DynamicHomeHero = dynamic(() => { return import('@/modules/home/Hero').then((mod) => { return mod.HomeHero }) }, {
  loading: () => { return <HomeHeroSkeleton data-testid='hero-skeleton' /> }
})

export default function CoverPage () {
  const router = useRouter()
  const { coverId, productId } = router.query

  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const { loading, getCoverByCoverKey } = useCoversAndProducts()
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
    return (
      <>
        <HomeHeroSkeleton data-testid='hero-skeleton' />

        <ProductsGridSkeleton />
      </>
    )
  }

  if (!coverData) {
    return (
      <NoDataFound />
    )
  }

  const isDiversified = coverData?.supportsProducts

  return (isDiversified
    ? (
      <div className='min-h-screen'>
        <DynamicHomeHero />
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
