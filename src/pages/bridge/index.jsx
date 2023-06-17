import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { BridgeModule } from '@/modules/bridge/BridgeModule'
import { isFeatureEnabled } from '@/src/config/environment'

const isCelerBridgeEnabled = isFeatureEnabled('bridge-celer')
const isLayerZeroBridgeEnabled = isFeatureEnabled('bridge-layerzero')

export default function BridgeIndexPage () {
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
