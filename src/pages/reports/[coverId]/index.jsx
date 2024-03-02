import { useRouter } from 'next/router'

import { Seo } from '@/common/Seo'
import ReportListing from '@/src/modules/reporting/ReportListing'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

export default function Index () {
  const router = useRouter()
  const { coverId, productId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  // Huobi / Neptune Mutual Decentralized Insurance

  // Get insurance for Huobi or become an underwriter. Get reward for reporting incident.

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
