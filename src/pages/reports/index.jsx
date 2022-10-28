import { Routes } from '@/src/config/routes'
import { useRouter } from 'next/router'

// Redirect
export default function Reports () {
  const router = useRouter()
  router.replace(Routes.ActiveReports)

  return null
}
