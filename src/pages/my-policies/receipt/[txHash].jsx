import Head from 'next/head'
import { PurchasePolicyReceipt } from '@/modules/my-policies/PurchasePolicyReceipt'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { logPageLoad } from '@/src/services/logs'

export default function PurchasePolicyReceiptPage () {
  const router = useRouter()
  const { txHash } = router.query
  const { account } = useWeb3React()

  logPageLoad(account ?? null, router.pathname)

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name='description'
          content='Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment.'
        />
      </Head>

      <PurchasePolicyReceipt txHash={txHash} />
    </main>
  )
}

/* istanbul ignore next */
export const getServerSideProps = async () => {
  return {
    props: {
      noHeader: true
    }
  }
}
