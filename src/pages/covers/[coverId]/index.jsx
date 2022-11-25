import Head from 'next/head'
import { CoverOptionsPage } from '@/src/modules/cover/CoverOptionsPage'
import { useRouter } from 'next/router'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { HomeHero } from '@/modules/home/Hero'
import { ProductsGrid } from '@/common/ProductsGrid/ProductsGrid'
import { useWeb3React } from '@web3-react/core'
import { logPageLoad } from '@/src/services/logs'
import { useEffect } from 'react'
import { analyticsLogger } from '@/utils/logger'

export default function CoverPage () {
  const router = useRouter()
  const { coverId, productId } = router.query

  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const { coverInfo, loading } = useCoverOrProductData({ coverKey, productKey })

  const isDiversified = coverInfo?.supportsProducts

  const { account, chainId } = useWeb3React()

  useEffect(() => {
    analyticsLogger(() => logPageLoad(chainId ?? null, account ?? null, router.asPath))
  }, [account, chainId, router.asPath])

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name='description'
          content='Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment.'
        />
      </Head>
      {loading && <p className='text-center'>loading...</p>}
      {!loading && !coverInfo && <p className='text-center'>No Data Found</p>}

      {isDiversified
        ? (
          <div className='min-h-screen'>
            <HomeHero />
            <ProductsGrid />
          </div>
          )
        : (coverInfo &&
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
