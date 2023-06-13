import { useRouter } from 'next/router'

import { ProductsGrid } from '@/common/ProductsGrid/ProductsGrid'
import { Seo } from '@/common/Seo'
import { HomeHero } from '@/modules/home/Hero'
import { HomeHeroSkeleton } from '@/modules/home/HomeHeroSkeleton'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { CoverOptionsPage } from '@/src/modules/cover/CoverOptionsPage'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { Trans } from '@lingui/macro'

export default function CoverPage () {
  const router = useRouter()
  const { coverId, productId } = router.query

  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const { loading, getCoverByCoverKey } = useCoversAndProducts2()
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
      <HomeHeroSkeleton data-testid='hero-skeleton' />
    )
  }

  if (!coverData) {
    return (
      <p className='text-center'>
        <Trans>No Data Found</Trans>
      </p>
    )
  }

  const isDiversified = coverData?.supportsProducts

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
