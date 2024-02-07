import { useEffect } from 'react'

import { useRouter } from 'next/router'

import { Routes } from '@/src/config/routes'

// Redirect
export default function Pools () {
  const router = useRouter()

  useEffect(() => {
    router.replace(Routes.Pools() || Routes.NotFound)
  }, [router])

  return null
}
