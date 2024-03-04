import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { NoDataFound } from '@/common/Loading'
import { ProductsGrid } from '@/common/ProductsGrid/ProductsGrid'
import { Seo } from '@/common/Seo'
import { HomeHeroSkeleton } from '@/modules/home/HomeHeroSkeleton'
import { ProductsGridSkeleton } from '@/modules/home/ProductsGridSkeleton'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { CoverOptionsPage } from '@/src/modules/cover/CoverOptionsPage'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

import { slugToNetworkId } from '@/src/config/networks'
import { getNetworksAndCovers } from '@/src/ssg/static-paths'
import { getDescription, getTitle } from '@/src/ssg/seo'

const DynamicHomeHero = dynamic(() => { return import('@/modules/home/Hero').then((mod) => { return mod.HomeHero }) }, {
  loading: () => { return <HomeHeroSkeleton data-testid='hero-skeleton' /> }
})

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
      seo: {
        title: getTitle(params.coverId, undefined, slugToNetworkId[params.network]),
        description: getDescription(params.coverId, undefined, slugToNetworkId[params.network])
      }
    }
  }
}

export default function CoverPage ({ seo }) {
  const router = useRouter()
  const { coverId, productId } = router.query

  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const { loading, getCoverByCoverKey } = useCoversAndProducts2()
  const coverData = getCoverByCoverKey(coverKey)

  return (
    <main>
      <Seo title={seo.title} description={seo.description} />
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
