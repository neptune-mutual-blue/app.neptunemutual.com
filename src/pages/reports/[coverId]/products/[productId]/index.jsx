import { Seo } from '@/common/Seo'
import ReportListing from '@/src/modules/reporting/ReportListing'
import { logPageLoad } from '@/src/services/logs'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { analyticsLogger } from '@/utils/logger'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Index () {
  const router = useRouter()
  const { coverId, productId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const { account, chainId } = useWeb3React()

  useEffect(() => {
    analyticsLogger(() => logPageLoad(chainId ?? null, account ?? null, router.asPath))
  }, [account, chainId, router.asPath])

  return (
    <>
      <Seo />
      <ReportListing
        locale={router.locale}
        coverKey={coverKey}
        productKey={productKey}
      />
    </>
  )
}
