import dynamic from 'next/dynamic'

import {
  Loading,
  NoDataFound
} from '@/common/Loading'
import { BridgeModule } from '@/modules/bridge/BridgeModule'
import AnnouncementBanner from '@/modules/home/AnnouncementBanner'
import { AvailableCovers } from '@/modules/home/AvailableCovers'
import InsightsSkeleton from '@/modules/insights/InsightsSkeleton'
import { isFeatureEnabled } from '@/src/config/environment'
import { ChainConfig } from '@/src/config/hardcoded'

const DynamicInsights = dynamic(() => { return import('@/modules/insights').then((mod) => { return mod.Insights }) }, {
  loading: () => { return <InsightsSkeleton /> }
})

export default function HomePage ({ networkId }) {
  const networkDetails = ChainConfig[networkId]

  const isCelerBridgeEnabled = isFeatureEnabled('bridge-celer', networkId)
  const isLayerZeroBridgeEnabled = isFeatureEnabled('bridge-layerzero', networkId)
  const bridgeEnabled = isCelerBridgeEnabled || isLayerZeroBridgeEnabled

  if (!networkId) { return <Loading /> }

  if (bridgeEnabled && !networkDetails) {
    return <BridgeModule />
  }

  if (!networkDetails) { return <NoDataFound /> }

  return (
    <>
      <DynamicInsights />
      <hr className='border-b border-B0C4DB' />

      <AnnouncementBanner />

      <AvailableCovers />

    </>
  )
}
