import {
  useEffect,
  useRef
} from 'react'

import { ModalCloseButton } from '@/common/Modal/ModalCloseButton'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import OpenInNewIcon from '@/icons/OpenInNewIcon'
import SuccessIcon from '@/lib/toast/components/icons/SuccessIcon'
import { LIQUIDITY_POINTS_PER_DOLLAR } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { getNetworkInfo } from '@/utils/network'
import { Trans } from '@lingui/macro'

const SuccessModal = ({ open, close, amountInDollars }) => {
  const { networkId } = useNetwork()
  const { isTestNet, isBinanceSmartChain } = getNetworkInfo(networkId)
  const nftLink = isTestNet ? 'https://test.nft.neptunemutual.com' : 'https://nft.neptunemutual.com'

  const finalAmount = useRef(amountInDollars)

  useEffect(() => {
    if (amountInDollars) { finalAmount.current = amountInDollars }
  }, [amountInDollars])

  const value = Number(LIQUIDITY_POINTS_PER_DOLLAR * finalAmount.current)
  const points = value >= 1 ? parseInt(value.toString()) : value.toFixed(2)

  return (
    <ModalRegular
      isOpen={open}
      onClose={close}
    >
      <ModalWrapper className='max-w-lg bg-white !p-0'>
        <div className='flex flex-col items-center'>
          <div className='flex gap-2.5 justify-center items-center p-8 bg-01052D text-white w-full relative'>
            <SuccessIcon className='w-8 h-8 text-21AD8C' aria-hidden='true' />
            <h4 className='font-semibold text-display-xs'><Trans>Added Liquidity Successfully!</Trans></h4>

            <ModalCloseButton className='absolute text-white !top-5 !right-5' onClick={close} />
          </div>

          <div className='p-8 pt-3 pb-7'>
            <img src='/images/nft-image.webp' alt='image showing different NFT characters' />

            <div className='relative px-8 py-4 mx-auto text-center text-white w-max bg-primary -mt-11 rounded-2xl shadow-points-btn'>
              <p className='text-sm capitalize'>Congratulations! you've just earned</p>
              <p className='mt-1 font-bold text-display-sm'>{points} pts</p>
            </div>

            <p className='mt-6 text-center text-md'>
              {
            isBinanceSmartChain ? "You've unlocked an NFT. Head to our NFT portal to mint it." : 'You are on fire! Head to our NFT Portal to view your progress.'
          }
            </p>

            <div className='flex items-center justify-center gap-6 mt-8 center'>

              <a href={nftLink} className='flex items-center gap-1 text-sm font-semibold' target='_blank' rel='noreferrer'>
                LAUNCH NFT PORTAL
                <OpenInNewIcon className='w-4 h-4' fill='currentColor' />
              </a>
            </div>
          </div>
        </div>
      </ModalWrapper>
    </ModalRegular>
  )
}

export default SuccessModal
