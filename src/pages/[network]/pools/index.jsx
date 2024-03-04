import { useEffect } from 'react'

import { useRouter } from 'next/router'

import { Routes } from '@/src/config/routes'

import { slugToNetworkId } from '@/src/config/networks'
import { getNetworks } from '@/src/ssg/static-paths'

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
export default function Pools ({ networkId }) {
  const router = useRouter()

  useEffect(() => {
    router.replace(Routes.Pools(networkId) || Routes.NotFound)
  }, [networkId, router])

  return null
}
