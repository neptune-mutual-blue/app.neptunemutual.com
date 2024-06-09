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
import { NPMSwapLink } from '@/common/NPMSwapLink'
import { useLingui } from '@lingui/react'

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

  const { i18n } = useLingui()

  const handleCopy = async (e) => {
    e && e.preventDefault()
    try {
      await navigator.clipboard.writeText(tokenAddress)
      toast.pushSuccess({
        title: t(i18n)`Success`,
        message: t(i18n)`Token address copied Successfully`,
        lifetime: SHORT_TOAST_TIME
      })
    } catch (err) {
      // console.error(err);
      toast.pushError({
        title: t(i18n)`Error`,
        message: t(i18n)`Unable to copy token address`,
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
          title='Open in explorer'
          data-testid='explorer-link'
        >
          <span className='sr-only'>Open in explorer</span>
          <OpenInNewIcon width={20} fill='currentColor' />
        </a>
        <button
          type='button'
          className={classNames(
            'ml-3',
            disabled && 'pointer-events-none cursor-not-allowed'
          )}
          onClick={() => { return register(tokenAddress, unit, tokenDecimals) }}
          title='Add to wallet'
          data-testid='add-button'
        >
          <span className='sr-only'>Add to wallet</span>
          <AddCircleIcon width={20} fill='currentColor' />
        </button>
      </div>
    </div>
  )
}
