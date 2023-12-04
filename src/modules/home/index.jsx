import { RegularButton } from '@/common/Button/RegularButton'
import ArrowNarrowRight from '@/icons/ArrowNarrowRight'
import { BridgeModule } from '@/modules/bridge/BridgeModule'
import { AvailableCovers } from '@/modules/home/AvailableCovers2'
import { Insights } from '@/modules/insights'
import { isFeatureEnabled } from '@/src/config/environment'
import { ChainConfig } from '@/src/config/hardcoded'
import { useNetwork } from '@/src/context/Network'

export default function HomePage () {
  const { networkId } = useNetwork()

  const networkDetails = ChainConfig[networkId]

  const isCelerBridgeEnabled = isFeatureEnabled('bridge-celer')
  const isLayerZeroBridgeEnabled = isFeatureEnabled('bridge-layerzero')
  const bridgeEnabled = isCelerBridgeEnabled || isLayerZeroBridgeEnabled

  if (bridgeEnabled && !networkDetails) {
    return <BridgeModule />
  }

  if (!networkDetails) { return <></> }

  return (
    <>
      <Insights />
      <hr className='border-b border-B0C4DB' />
      <div
        className='flex justify-center px-4 pt-16 pb-0 mx-auto md:pb-8 max-w-7xl sm:px-6 md:px-8'
        data-testid='nft-banner'
      >
        <div className='relative'>
          <img className='object-cover max-w-full overflow-hidden h-96 rounded-xl' src='/nft-banner.webp' alt='avatars coming soon' />

          <a href='https://nft.neptunemutual.com' target='_blank' rel='noreferrer'>
            <RegularButton className='absolute bottom-13 whitespace-nowrap left-[50%] translate-x-[-50%] flex gap-2.5 items-center text-sm text-white py-2.5 px-4 font-bold'>
              Launch NFT Portal
              <ArrowNarrowRight />
            </RegularButton>
          </a>
        </div>

      </div>

      <AvailableCovers />

    </>
  )
}
