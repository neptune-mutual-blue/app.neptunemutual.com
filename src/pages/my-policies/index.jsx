import { Routes } from '@/src/config/routes'
import { useRouter } from 'next/router'

// Redirect
export default function MyPolicies () {
  const router = useRouter()
  router.replace(Routes.MyActivePolicies)

  return null
}
