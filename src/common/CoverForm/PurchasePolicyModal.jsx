import {
  useEffect,
  useRef
} from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { Loader } from '@/common/Loader/Loader'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import OpenInNewIcon from '@/icons/OpenInNewIcon'
import SuccessIcon from '@/lib/toast/components/icons/SuccessIcon'
import { POLICY_POINTS_PER_DOLLAR } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useNetwork } from '@/src/context/Network'
import { classNames } from '@/utils/classnames'
import { getNetworkInfo } from '@/utils/network'
import { Trans } from '@lingui/macro'

/**
 * @param {{ isOpen: boolean, txHash: string, amount: number }} prop
 * @returns
 */
export const PurchasePolicyModal = ({
  isOpen,
  txHash,
  amount
}) => {
  const router = useRouter()

  const hanldeClose = () => {
    router.push(Routes.MyActivePolicies)
  }

  const finalAmount = useRef(0)

  useEffect(() => {
    if (amount) { finalAmount.current = amount }
  }, [amount])

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={txHash ? hanldeClose : () => {}}
      data-testid='purchase-policy-status'
    >
      <ModalWrapper className={classNames('max-w-lg bg-white', txHash && '!p-0')}>
        {
          txHash ? <Complete txHash={txHash} onClose={hanldeClose} amountInDollars={finalAmount.current} /> : <Loading />
        }
      </ModalWrapper>
    </ModalRegular>
  )
}

/**
 * @param {{ txHash: string, onClose: Function, amountInDollars: number }} prop
 */
function Complete ({ txHash, onClose, amountInDollars }) {
  const { networkId } = useNetwork()
  const { isTestNet, isBinanceSmartChain } = getNetworkInfo(networkId)
  const nftLink = isTestNet ? 'https://test.nft.neptunemutual.com' : 'https://nft.neptunemutual.com'

  const value = Number(POLICY_POINTS_PER_DOLLAR * amountInDollars)
  const points = value >= 1 ? parseInt(value.toString()) : value.toFixed(2)

  return (
    <div className='flex flex-col items-center'>
      <div className='flex gap-2.5 justify-center items-center p-8 bg-01052D text-white w-full'>
        <SuccessIcon className='w-8 h-8 text-21AD8C' aria-hidden='true' />
        <h4 className='font-semibold text-display-xs'><Trans>Cover Purchased Successfully!</Trans></h4>
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
          <Link
            href={Routes.ViewPolicyReceipt(txHash)}
            target='_blank'
            onClick={onClose}
            className='font-semibold text-4E7DD9' rel='noreferrer'
          >

            VIEW POLICY RECEIPT

          </Link>

          <a href={nftLink} className='flex items-center gap-1 text-sm font-semibold' target='_blank' rel='noreferrer'>
            LAUNCH NFT PORTAL
            <OpenInNewIcon className='w-4 h-4' fill='currentColor' />
          </a>
        </div>
      </div>
    </div>
  )
}

function Loading () {
  return (
    <div className='flex flex-col items-center'>
      <Loader className='w-18 h-18 text-4E7DD9' />
      <h4 className='font-bold leading-9 text-center mt-7 text-display-sm'>
        <Trans>Transaction in progress</Trans>
      </h4>
      <p className='mt-4 leading-6 text-center text-md md:w-72'>
        <Trans>Please do not exit this page while transaction is in progress</Trans>
      </p>
    </div>
  )
}
