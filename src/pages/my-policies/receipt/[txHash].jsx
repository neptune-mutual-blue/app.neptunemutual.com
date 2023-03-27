import { useRouter } from 'next/router'

import { Seo } from '@/common/Seo'
import {
  PurchasePolicyReceipt
} from '@/modules/my-policies/PurchasePolicyReceipt'

export default function PurchasePolicyReceiptPage () {
  const router = useRouter()
  const { txHash } = router.query

  return (
    <main>
      <Seo />

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
