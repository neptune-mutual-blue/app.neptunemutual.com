import { Routes } from '@/src/config/routes'
import { useNetwork } from '@/src/context/Network'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { slugToNetworkId } from '@/src/config/networks'

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
      coverId: params.coverId,
      timestamp: params.timestamp
    },
    revalidate: 10 // In seconds
  }
}

// Redirect
export default function Report () {
  const { networkId } = useNetwork()
  const router = useRouter()
  const { coverId, productId, timestamp } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  useEffect(() => {
    if (!coverKey || !productKey || !timestamp) {
      return
    }

    router.replace(Routes.ViewReport(coverKey, productKey, timestamp, networkId))
  }, [coverKey, networkId, productKey, router, timestamp])

  return null
}
