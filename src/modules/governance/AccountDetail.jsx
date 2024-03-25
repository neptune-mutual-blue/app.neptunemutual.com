import { Alert } from '@/common/Alert/Alert'
import { RegularButton } from '@/common/Button/RegularButton'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import {
  NetworkNames,
  ShortNetworkNames
} from '@/lib/connect-wallet/config/chains'
import GovernanceCard from '@/modules/governance/GovernanceCard'
import { useSetGauge } from '@/modules/governance/useSetGauge'
import { useNetwork } from '@/src/context/Network'
import { useLanguageContext } from '@/src/i18n/i18n'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'

export const AccountDetail = ({ title, selectedChain, distribution }) => {
  const { account } = useWeb3React()
  const { networkId } = useNetwork()

  const { locale } = useLanguageContext()

  const {
    loadingAllowance,
    loadingBalance,
    allowance,
    balance,
    approving,
    isSettingGauge,
    depositTokenDecimals,
    depositTokenSymbol,
    handleApprove,
    handleSetGauge,
    amountToDeposit
  } = useSetGauge({ title, distribution })

  const canSetGauge = toBN(allowance).isGreaterThanOrEqualTo(amountToDeposit)
  const isBalanceInsufficient = toBN(amountToDeposit).isGreaterThan(balance)

  const currentNetworkName = NetworkNames[networkId]
  const invalidNetwork = networkId !== selectedChain
  const showError = isBalanceInsufficient || invalidNetwork

  let loadingMessage = ''
  if (loadingBalance) {
    loadingMessage = <Trans>Fetching balance...</Trans>
  } else if (loadingAllowance) {
    loadingMessage = <Trans>Fetching allowance...</Trans>
  }

  return (
    <GovernanceCard className='p-4 md:p-8'>
      <div className='p-6 bg-F3F5F7 rounded-2'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <h4 className='text-sm font-semibold text-999BAB'><Trans>Account</Trans></h4>
            <p className='break-words'>
              {account || 'N/A'}
            </p>
          </div>

          <div className='flex flex-col gap-4 sm:gap-8 sm:flex-row'>
            <div className='flex flex-col gap-1'>
              <h4 className='text-sm font-semibold text-999BAB'>
                <Trans>Current Network</Trans>
              </h4>
              <p className={classNames(
                'text-xl',
                invalidNetwork && 'text-E52E2E'
              )}
              >{currentNetworkName}
              </p>
            </div>
            <div className='flex flex-col gap-1'>
              <h4 className='text-sm font-semibold text-999BAB'>
                <Trans>Balance</Trans>
              </h4>
              <p className={classNames(
                'text-xl',
                isBalanceInsufficient && 'text-E52E2E'
              )}
              >
                {formatCurrency(
                  convertFromUnits(balance, depositTokenDecimals),
                  locale,
                  depositTokenSymbol,
                  true
                ).long}
              </p>
            </div>
            <div className='flex flex-col gap-1'>
              <h4 className='text-sm font-semibold text-999BAB'>
                <Trans>Required</Trans>
              </h4>
              <p className='text-xl'>{formatCurrency(
                convertFromUnits(amountToDeposit, depositTokenDecimals),
                locale,
                depositTokenSymbol,
                true
              ).long}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='inline-flex flex-col mt-3'>
        <DataLoadingIndicator message={loadingMessage} />
        {!canSetGauge && (
          <RegularButton
            className='relative z-auto px-4 py-3 font-semibold uppercase rounded-tooltip hover:bg-opacity-90'
            onClick={handleApprove}
            disabled={approving || showError || !!loadingMessage}
          >
            {approving
              ? (
                <Trans>Approving...</Trans>
                )
              : <Trans>Approve {depositTokenSymbol}</Trans>}
          </RegularButton>
        )}

        {canSetGauge && (
          <RegularButton
            className='relative z-auto px-4 py-3 font-semibold uppercase rounded-tooltip hover:bg-opacity-90'
            onClick={handleSetGauge}
            disabled={isSettingGauge || showError || !!loadingMessage}
          >
            {isSettingGauge
              ? (
                <Trans>Setting Gauge...</Trans>
                )
              : <Trans>Set Gauge On {ShortNetworkNames[selectedChain]}</Trans>}

          </RegularButton>
        )}
      </div>

      {showError && (
        <Alert className='!mt-6'>
          <ul className='list-disc pl-7'>
            {invalidNetwork && <li>Incorrect Network: {currentNetworkName}</li>}
            {isBalanceInsufficient && <li>Your balance is not sufficient to set gauge for proposal - {title}</li>}
          </ul>
        </Alert>
      )}
    </GovernanceCard>
  )
}
