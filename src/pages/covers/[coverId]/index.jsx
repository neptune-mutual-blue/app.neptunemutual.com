import { useEffect } from 'react'

import { useRouter } from 'next/router'

import { ProductsGrid } from '@/common/ProductsGrid/ProductsGrid'
import { Seo } from '@/common/Seo'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { CoverOptionsPage } from '@/src/modules/cover/CoverOptionsPage'
import { logPageLoad } from '@/src/services/logs'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { analyticsLogger } from '@/utils/logger'
import { useWeb3React } from '@web3-react/core'
import { Insights } from '@/modules/insights'

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
      <Seo />
      {loading && <p className='text-center'>loading...</p>}
      {!loading && !coverInfo && <p className='text-center'>No Data Found</p>}

      {isDiversified
        ? (
          <div className='min-h-screen'>
            <Insights />
            <SortableStatsProvider>
              <ProductsGrid />
            </SortableStatsProvider>
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
