import Head from 'next/head'
import { CoverOptionsPage } from '@/src/modules/cover/CoverOptionsPage'
import { useRouter } from 'next/router'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { HomeHero } from '@/modules/home/Hero'
import { ProductsGrid } from '@/common/ProductsGrid/ProductsGrid'
import { isDiversifiedCoversEnabled } from '@/src/config/environment'
import { ComingSoon } from '@/common/ComingSoon'
import { useWeb3React } from '@web3-react/core'
import { logPageLoad } from '@/src/services/logs'
import { useEffect } from 'react'
import { analyticsLogger } from '@/utils/logger'

const disabled = !isDiversifiedCoversEnabled()

export default function CoverPage () {
  const router = useRouter()
  const { coverId, productId } = router.query

  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const coverInfo = useCoverOrProductData({ coverKey, productKey })

  const isDiversified = coverInfo?.supportsProducts

  const { account } = useWeb3React()

  useEffect(() => {
    analyticsLogger(() => logPageLoad(account ?? null, router.pathname))
  }, [account, router.pathname])

  if (disabled && isDiversified) {
    return <ComingSoon />
  }

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name='description'
          content='Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment.'
        />
      </Head>

      {isDiversified
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
            coverProductInfo={coverInfo}
            isDiversified={isDiversified}
          />
          )}
    </main>
  )
}
