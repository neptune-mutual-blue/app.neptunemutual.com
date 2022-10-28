import { Routes } from '@/src/config/routes'
import { useRouter } from 'next/router'

// Redirect
export default function Pools () {
  const router = useRouter()
  router.replace(Routes.Pools() || Routes.NotFound)

  return null
}
