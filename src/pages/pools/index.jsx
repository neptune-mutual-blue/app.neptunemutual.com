import { useEffect } from 'react'

import { useRouter } from 'next/router'

import { Routes } from '@/src/config/routes'
import { useNetwork } from '@/src/context/Network'

// Redirect
export default function Pools () {
  const router = useRouter()
  const { networkId } = useNetwork()

  useEffect(() => {
    router.replace(Routes.Pools(networkId) || Routes.NotFound)
  }, [networkId, router])

  return null
}
