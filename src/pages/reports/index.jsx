import { useEffect } from 'react'

import { useRouter } from 'next/router'

import { Routes } from '@/src/config/routes'

// Redirect
export default function Reports () {
  const router = useRouter()

  useEffect(() => {
    router.replace(Routes.ActiveReports)
  }, [router])

  return null
}
