import { isFeatureEnabled } from '@/src/config/environment'
import { Routes } from '@/src/config/routes'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const isCelerEnabled = isFeatureEnabled('bridge-celer')
const isLayerZeroEnabled = isFeatureEnabled('bridge-layerzero')
const redirect = (isLayerZeroEnabled && !isCelerEnabled) ? Routes.BridgeLayerZero : Routes.BridgeCeler

export default function BridgeIndexPage () {
  const router = useRouter()

  useEffect(() => {
    if (redirect) {
      router.replace(redirect)
    }
  }, [router])

  return <></>
}
