import Head from 'next/head'
import { CoverOptionsPage } from '@/src/modules/cover/CoverOptionsPage'
import { useRouter } from 'next/router'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { HomeHero } from '@/modules/home/Hero'
import { ProductsGrid } from '@/common/ProductsGrid/ProductsGrid'
import { isDiversifiedCoversEnabled } from '@/src/config/environment'
import { ComingSoon } from '@/common/ComingSoon'
import { Trans } from '@lingui/macro'

const disabled = !isDiversifiedCoversEnabled()

export default function CoverPage () {
  const router = useRouter()
  const { coverId, productId } = router.query

  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const coverInfo = useCoverOrProductData({ coverKey, productKey })

  const isDiversified = coverInfo?.supportsProducts

  if (disabled) {
    return <ComingSoon />
  }

  const CoverList = isDiversified
    ? <ProductsGrid />
    : (
      <CoverOptionsPage
        coverKey={coverKey}
        productKey={productKey}
        coverProductInfo={coverInfo}
        isDiversified={isDiversified}
      />
      )

  const HeroComponent = isDiversified ? <HomeHero /> : null

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name='description'
          content='Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment.'
        />
      </Head>
      {
        coverInfo
          ? HeroComponent
          : <div className='min-h-screen' />
      }
      <div id='cover-list' className='min-h-screen'>
        {coverInfo ? CoverList : <Trans>loading...</Trans>}
      </div>
    </main>
  )
}
