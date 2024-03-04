import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { BridgeModule } from '@/modules/bridge/BridgeModule'
import { isFeatureEnabled } from '@/src/config/environment'

import { slugToNetworkId } from '@/src/config/networks'
import { getNetworks } from '@/src/ssg/static-paths'

export const getStaticPaths = async () => {
  return {
    paths: getNetworks(),
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      networkId: slugToNetworkId[params.network]
    }
  }
}

export default function BridgeIndexPage ({ networkId }) {
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
