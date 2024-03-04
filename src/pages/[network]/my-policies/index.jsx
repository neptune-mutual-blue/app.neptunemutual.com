import { Routes } from '@/src/config/routes'
import { useRouter } from 'next/router'

import { slugToNetworkId } from '@/src/config/networks'
import { getNetworks } from '@/src/ssg/static-paths'
import { useEffect } from 'react'

export const getStaticPaths = async () => {
  return {
    paths: getNetworks(),
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      networkId: slugToNetworkId[params.network]
    }
  }
}

// Redirect
export default function MyPolicies ({ networkId }) {
  const router = useRouter()

  useEffect(() => {
    router.replace(Routes.MyActivePolicies(networkId))
  }, [networkId, router])

  return null
}
