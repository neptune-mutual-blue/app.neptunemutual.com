import Head from 'next/head'
import { CoverOptionsPage } from '@/src/modules/cover/CoverOptionsPage'
import { isDiversifiedCoversEnabled } from '@/src/config/environment'
import { ComingSoon } from '@/common/ComingSoon'
import { useRouter } from 'next/router'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { isValidProduct } from '@/src/helpers/cover'
import { useWeb3React } from '@web3-react/core'
import { logPageLoad } from '@/src/services/logs'
import { useEffect } from 'react'

const disabled = !isDiversifiedCoversEnabled()

export default function Options () {
  const router = useRouter()
  const { account } = useWeb3React()
  const { coverId, productId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const coverProductInfo = useCoverOrProductData({ coverKey, productKey })

  useEffect(() => {
    logPageLoad(account ?? null, router.pathname)
  }, [account, router.pathname])

  if (disabled) {
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

      <CoverOptionsPage
        coverKey={coverKey}
        productKey={productKey}
        coverProductInfo={coverProductInfo}
        isDiversified={isValidProduct(productKey)}
      />
    </main>
  )
}
