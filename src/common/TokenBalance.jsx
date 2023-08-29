import { useRouter } from 'next/router'

import AddCircleIcon from '@/icons/AddCircleIcon'
import CopyIcon from '@/icons/CopyIcon'
import OpenInNewIcon from '@/icons/OpenInNewIcon'
import { getTokenLink } from '@/lib/connect-wallet/utils/explorer'
import { useToast } from '@/lib/toast/context'
import { SHORT_TOAST_TIME } from '@/src/config/toast'
import { useNetwork } from '@/src/context/Network'
import { useRegisterToken } from '@/src/hooks/useRegisterToken'
import { convertFromUnits } from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import {
  t,
  Trans
} from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { useAppConstants } from '@/src/context/AppConstants'
import { useMemo } from 'react'
import { FAUCET_URL, getSwapLink } from '@/src/config/constants'
import { getNetworkInfo } from '@/utils/network'

export const TokenBalance = ({
  tokenAddress,
  tokenDecimals,
  balance,
  unit,
  disabled,
  children
}) => {
  const { networkId } = useNetwork()
  const { register } = useRegisterToken()
  const { account } = useWeb3React()
  const toast = useToast()
  const router = useRouter()

  const handleCopy = async (e) => {
    e && e.preventDefault()
    try {
      await navigator.clipboard.writeText(tokenAddress)
      toast.pushSuccess({
        title: t`Success`,
        message: t`Token address copied Successfully`,
        lifetime: SHORT_TOAST_TIME
      })
    } catch (err) {
      // console.error(err);
      toast.pushError({
        title: t`Error`,
        message: t`Unable to copy token address`,
        lifetime: SHORT_TOAST_TIME
      })
    }
  }

  const formattedTokenAmount = formatCurrency(
    convertFromUnits(balance || 0, tokenDecimals),
    router.locale,
    unit,
    true
  )

  return (
    <div
      className='flex flex-col-reverse items-start justify-between mt-2 xs:flex-row text-9B9B9B'
      data-testid='token-balance-container'
    >
      <div className='flex flex-col mt-3 xs:block xs:mt-0'>
        {balance && (
          <p
            title={formattedTokenAmount.long}
            data-testid='balance'
          >
            <Trans>Balance:</Trans>{' '}
            {formattedTokenAmount.short}

            <NPMSwapLink tokenAddress={tokenAddress} />
          </p>
        )}
        <div className='flex'>
          <div className='grow'>
            {children}
          </div>

          {!balance && <NPMSwapLink tokenAddress={tokenAddress} />}
        </div>
      </div>
      <div className='flex items-center justify-end w-full xs:w-fit'>
        <button
          type='button'
          title='Copy token address'
          onClick={handleCopy}
          className={classNames(
            'ml-3',
            disabled && 'pointer-events-none cursor-not-allowed'
          )}
          data-testid='copy-button'
        >
          <span className='sr-only'>Copy token address</span>
          <CopyIcon width={18} fill='currentColor' />
        </button>
        <a
          href={getTokenLink(networkId, tokenAddress, account)}
          target='_blank'
          className={classNames(
            'ml-3',
            disabled && 'pointer-events-none cursor-not-allowed'
          )}
          rel='noreferrer nofollow'
          title='Open In Explorer'
          data-testid='explorer-link'
        >
          <span className='sr-only'>Open In Explorer</span>
          <OpenInNewIcon width={20} fill='currentColor' />
        </a>
        <button
          type='button'
          className={classNames(
            'ml-3',
            disabled && 'pointer-events-none cursor-not-allowed'
          )}
          onClick={() => { return register(tokenAddress, unit, tokenDecimals) }}
          title='Add to Metamask'
          data-testid='add-button'
        >
          <span className='sr-only'>Add to Metamask</span>
          <AddCircleIcon width={20} fill='currentColor' />
        </button>
      </div>
    </div>
  )
}

export const NPMSwapLink = ({ tokenAddress, className = '' }) => {
  const { networkId } = useNetwork()
  const { NPMTokenAddress } = useAppConstants()

  const npmSwapLink = useMemo(() => {
    if (!NPMTokenAddress || !tokenAddress || !networkId) { return '' }

    if (NPMTokenAddress.toLowerCase() !== tokenAddress.toLowerCase()) { return '' }

    if (getNetworkInfo(networkId).isTestNet) { return FAUCET_URL }

    return getSwapLink(tokenAddress)
  }, [NPMTokenAddress, tokenAddress, networkId])

  return (
    npmSwapLink && (
      <a
        href={npmSwapLink}
        target='_blank'
        rel='noreferrer'
        className={classNames('ml-2 font-semibold underline text-md text-4E7DD9 h-max w-max', className)}
      >
        Get NPM
      </a>
    )
  )
}
