import { useRouter } from 'next/router'

import { Alert } from '@/common/Alert/Alert'
import { RegularButton } from '@/common/Button/RegularButton'
import {
  NetworkNames,
  ShortNetworkNames
} from '@/lib/connect-wallet/config/chains'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import GovernanceCard from '@/modules/governance/GovernanceCard'
import { CONTRACT_DEPLOYMENTS } from '@/src/config/constants'
import { abis } from '@/src/config/contracts/abis'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { getActionMessage } from '@/src/helpers/notification'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useTxToast } from '@/src/hooks/useTxToast'
import { METHODS } from '@/src/services/transactions/const'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { getEpochFromTitle } from '@/utils/snapshot'
import { Trans } from '@lingui/macro'
import { utils } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

export const AccountDetail = ({ title, selectedChain, distribution, amountToDeposit }) => {
  const { library, account } = useWeb3React()
  const { networkId } = useNetwork()

  const { NPMTokenAddress, NPMTokenSymbol, NPMTokenDecimals } = useAppConstants()
  const { balance } = useERC20Balance(NPMTokenAddress)
  const router = useRouter()

  const { notifyError } = useErrorNotifier()
  const { writeContract } = useTxPoster()
  const txToast = useTxToast()

  const handleSetGauge = () => {
    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = utils.contract.getContract(CONTRACT_DEPLOYMENTS[networkId].gaugeControllerRegistry, abis.GaugeControllerRegistry, signerOrProvider)

      const epoch = getEpochFromTitle(title)
      const args = [
        epoch,
        amountToDeposit,
        distribution
      ]

      const cleanup = () => {}

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.GCR_SET_GAUGE,
          status: STATUS.PENDING,
          data: {
            value: amountToDeposit,
            tokenSymbol: NPMTokenSymbol
          }
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.GCR_SET_GAUGE, STATUS.PENDING)
              .title,
            success: getActionMessage(METHODS.GCR_SET_GAUGE, STATUS.SUCCESS)
              .title,
            failure: getActionMessage(METHODS.GCR_SET_GAUGE, STATUS.FAILED)
              .title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.GCR_SET_GAUGE,
                status: STATUS.SUCCESS
              })
              cleanup()
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.GCR_SET_GAUGE,
                status: STATUS.FAILED
              })
              cleanup()
            }
          }
        )
      }

      const onRetryCancel = () => {
        cleanup()
      }

      const onError = (err) => {
        notifyError(err, getActionMessage(METHODS.GCR_SET_GAUGE, STATUS.FAILED)
          .title)
        cleanup()
      }

      writeContract({
        instance,
        methodName: 'setGauge',
        args,
        onTransactionResult,
        onRetryCancel,
        onError
      })
    } catch (err) {
      console.error(err)
    }
  }

  const isBalanceInsufficient = toBN(amountToDeposit).isGreaterThan(balance)

  const currentNetworkName = NetworkNames[networkId]
  const invalidNetwork = networkId !== selectedChain
  const showError = isBalanceInsufficient || invalidNetwork

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
                  convertFromUnits(balance, NPMTokenDecimals),
                  router.locale,
                  NPMTokenSymbol,
                  true
                ).long}
              </p>
            </div>
            <div className='flex flex-col gap-1'>
              <h4 className='text-sm font-semibold text-999BAB'>
                <Trans>Required</Trans>
              </h4>
              <p className='text-xl'>{formatCurrency(
                convertFromUnits(amountToDeposit, NPMTokenDecimals),
                router.locale,
                NPMTokenSymbol,
                true
              ).long}
              </p>
            </div>
          </div>
        </div>
      </div>

      <RegularButton
        className='mt-6 rounded-tooltip py-[11px] px-4 font-semibold uppercase z-auto relative hover:bg-opacity-90'
        onClick={handleSetGauge}
      >
        <Trans>Set Gauge On {ShortNetworkNames[selectedChain]}</Trans>
      </RegularButton>

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
