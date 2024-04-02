import { Seo } from '@/common/Seo'
import {
  PurchasePolicyReceipt
} from '@/modules/my-policies/PurchasePolicyReceipt'
import { slugToNetworkId } from '@/src/config/networks'
import { getTitle } from '@/src/ssg/seo'

export async function getStaticPaths () {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps ({ params }) {
  const networkId = slugToNetworkId[params.network]

  if (!networkId) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      networkId,
      txHash: params.txHash,
      title: getTitle({
        networkId,
        pageAction: 'Policy Receipt'
      })
    },
    revalidate: 10 // In seconds
  }
}

export default function PurchasePolicyReceiptPage ({ txHash, title }) {
  return (
    <main>
      <Seo title={title} />

      <PurchasePolicyReceipt txHash={txHash} />
    </main>
  )
}
