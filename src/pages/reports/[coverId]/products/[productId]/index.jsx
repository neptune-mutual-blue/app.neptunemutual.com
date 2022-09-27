import ReportListing from '@/src/modules/reporting/ReportListing'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Index () {
  const router = useRouter()
  const { coverId, productId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  return (
    <>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name='description'
          content='Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment.'
        />
      </Head>
      <ReportListing
        locale={router.locale}
        coverKey={coverKey}
        productKey={productKey}
      />
    </>
  )
}
