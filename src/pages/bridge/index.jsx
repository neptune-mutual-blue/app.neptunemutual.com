import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { BridgeModule } from '@/modules/bridge/BridgeModule'
import { isFeatureEnabled } from '@/src/config/environment'
import { useNetwork } from '@/src/context/Network'

export default function BridgeIndexPage () {
  const { networkId } = useNetwork()

  const isCelerBridgeEnabled = isFeatureEnabled('bridge-celer', networkId)
  const isLayerZeroBridgeEnabled = isFeatureEnabled('bridge-layerzero', networkId)

  if (!isCelerBridgeEnabled && !isLayerZeroBridgeEnabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo />

      <BridgeModule />
    </main>
  )
}
