import { Routes } from '@/src/config/routes'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

// Redirect
export default function Report () {
  const router = useRouter()
  const { coverId, productId, timestamp } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')

  useEffect(() => {
    if (!coverKey || !productKey || !timestamp) {
      return
    }

    router.replace(Routes.ViewReport(coverKey, productKey, timestamp))
  }, [coverKey, productKey, router, timestamp])

  return null
}
