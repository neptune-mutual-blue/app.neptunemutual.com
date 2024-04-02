import { ComingSoon } from '@/common/ComingSoon'
import { Loading } from '@/common/Loading'
import { Seo } from '@/common/Seo'
import { BridgeModule } from '@/modules/bridge/BridgeModule'
import { isFeatureEnabled } from '@/src/config/environment'
import { slugToNetworkId } from '@/src/config/networks'
import { getTitle } from '@/src/ssg/seo'
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
      networkId: slugToNetworkId[params.network],
      title: getTitle({
        networkId: slugToNetworkId[params.network],
        pageAction: 'Bridge'
      })
    }
  }
}

export default function BridgeIndexPage ({ networkId, title }) {
  const isCelerBridgeEnabled = isFeatureEnabled('bridge-celer', networkId)
  const isLayerZeroBridgeEnabled = isFeatureEnabled('bridge-layerzero', networkId)

  if (!isCelerBridgeEnabled && !isLayerZeroBridgeEnabled) {
    return <ComingSoon />
  }

  if (!networkId) {
    return <Loading />
  }

  return (
    <main>
      <Seo title={title} />

      <BridgeModule />
    </main>
  )
}
