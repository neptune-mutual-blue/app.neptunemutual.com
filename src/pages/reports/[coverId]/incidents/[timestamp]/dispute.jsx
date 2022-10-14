import Head from 'next/head'
import { useRouter } from 'next/router'
import { ComingSoon } from '@/common/ComingSoon'
import { isFeatureEnabled } from '@/src/config/environment'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { NewDisputeReportFormContainer } from '@/modules/reporting/NewDisputeReportFormContainer'
import { logPageLoad } from '@/src/services/logs'
import { useWeb3React } from '@web3-react/core'

const disabled = !isFeatureEnabled('reporting')

export default function DisputeFormPage () {
  const router = useRouter()
  const { coverId, productId, timestamp } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  const { account } = useWeb3React()

  logPageLoad(account ?? null, router.pathname)

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

      <NewDisputeReportFormContainer coverKey={coverKey} productKey={productKey} timestamp={timestamp} />
    </main>
  )
}
