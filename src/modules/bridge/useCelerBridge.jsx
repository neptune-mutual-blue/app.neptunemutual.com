import {
  useEffect,
  useMemo,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import * as celerConfig from '@/src/config/bridge/celer'
import { networks } from '@/src/config/networks'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { getActionMessage } from '@/src/helpers/notification'
import { useERC20Allowance } from '@/src/hooks/useERC20Allowance'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useTxToast } from '@/src/hooks/useTxToast'
import { contractRead } from '@/src/services/readContract'
import { METHODS } from '@/src/services/transactions/const'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import {
  convertFromUnits,
  convertToUnits,
  toBNSafe
} from '@/utils/bn'
import { getNetworkInfo } from '@/utils/network'
import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'

import { useCelerEstimation } from './useCelerEstimation'

const ABI = [
  { inputs: [], name: 'delayPeriod', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ internalType: 'address', name: '_receiver', type: 'address' }, { internalType: 'address', name: '_token', type: 'address' }, { internalType: 'uint256', name: '_amount', type: 'uint256' }, { internalType: 'uint64', name: '_dstChainId', type: 'uint64' }, { internalType: 'uint64', name: '_nonce', type: 'uint64' }, { internalType: 'uint32', name: '_maxSlippage', type: 'uint32' }], name: 'send', outputs: [], stateMutability: 'nonpayable', type: 'function' }
]

const METHOD_NAME = 'send'

const useCelerBridge = ({
  srcChainId,
  destChainId,
  sendAmount,
  receiverAddress
}) => {
  const { networkId } = useNetwork()

  const celerData = useMemo(() => {
    const { isTestNet } = getNetworkInfo(networkId)
    const tokenData = isTestNet ? celerConfig.TESTNET_USDC_BRIDGE_TOKENS : celerConfig.MAINNET_NPM_BRIDGE_TOKENS
    const tokenSymbol = isTestNet ? 'USDC' : 'NPM'
    const _networks = isTestNet ? networks.testnet : networks.mainnet
    const filtered = _networks.filter(n => Object.keys(tokenData).includes(n.chainId.toString())) // filtered based on availability of tokens

    const bridgeContractAddress = celerConfig.BRIDGE_CONTRACTS[networkId]

    return {
      bridgeContractAddress,
      filteredNetworks: filtered,
      tokenData,
      tokenSymbol
    }
  }, [networkId])

  const bridgeContractAddress = celerData.bridgeContractAddress
  const tokenSymbol = celerData.tokenSymbol
  const sourceTokenAddress = celerData.tokenData[networkId]?.address
  const sourceTokenDecimal = celerData.tokenData[networkId]?.decimal

  const sendAmountInUnits = convertToUnits(sendAmount || '0', sourceTokenDecimal).toString()

  const [approving, setApproving] = useState(false)
  const [bridging, setBridging] = useState(false)

  const [delayPeriod, setDelayPeriod] = useState('5 - 20 minutes')

  const { balance, refetch: refetchBalance } = useERC20Balance(sourceTokenAddress)
  const { allowance, approve, refetch } = useERC20Allowance(sourceTokenAddress)

  const { library, account } = useWeb3React()

  const {
    balanceError,
    chainGasPrice,
    estimating,
    estimation
  } = useCelerEstimation({
    allowance,
    destChainId,
    receiverAddress,
    sendAmountInUnits,
    srcChainId,
    tokenSymbol
  })

  useEffect(() => {
    refetch(bridgeContractAddress)
  }, [refetch, bridgeContractAddress])

  useEffect(() => {
    if (!account || !networkId || !library) return

    async function getDelay () {
      try {
        const provider = getProviderOrSigner(library, account, networkId)
        const instance = new Contract(bridgeContractAddress, ABI, provider)

        const delay = await contractRead({
          instance,
          methodName: 'delayPeriod'
        })

        if (!delay.isZero()) {
          const time = `up to ${Number(delay.toString()) / (60)} minute(s)`
          setDelayPeriod(time)
        }
      } catch (err) {
        console.error('Error in getting delayPeriod')
      }
    }

    getDelay()
  }, [account, library, networkId, bridgeContractAddress])

  const txToast = useTxToast()
  const { notifyError } = useErrorNotifier()
  const { writeContract } = useTxPoster()

  const handleApprove = () => {
    setApproving(true)

    const cleanup = () => {
      setApproving(false)
      refetchBalance()
      refetch(bridgeContractAddress)
    }

    const handleError = (err) => {
      notifyError(err, `Could not approve ${tokenSymbol}`)
    }

    const onRetryCancel = () => {
      cleanup()
    }

    const onError = (err) => {
      handleError(err)
      cleanup()
    }

    try {
      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.BRIDGE_APPROVE,
          status: STATUS.PENDING,
          data: {
            value: convertFromUnits(sendAmountInUnits, sourceTokenDecimal),
            tokenSymbol: tokenSymbol
          }
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.BRIDGE_APPROVE, STATUS.PENDING, {
              value: convertFromUnits(sendAmountInUnits, sourceTokenDecimal),
              tokenSymbol: tokenSymbol
            }).title,
            success: getActionMessage(METHODS.BRIDGE_APPROVE, STATUS.SUCCESS, {
              value: convertFromUnits(sendAmountInUnits, sourceTokenDecimal),
              tokenSymbol: tokenSymbol
            }).title,
            failure: getActionMessage(METHODS.BRIDGE_APPROVE, STATUS.FAILED, {
              value: convertFromUnits(sendAmountInUnits, sourceTokenDecimal),
              tokenSymbol: tokenSymbol
            }).title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.BRIDGE_APPROVE,
                status: STATUS.SUCCESS
              })
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.BRIDGE_APPROVE,
                status: STATUS.FAILED
              })
            }
          }
        )
        cleanup()
      }

      approve(bridgeContractAddress, sendAmountInUnits, {
        onTransactionResult,
        onRetryCancel,
        onError
      })
    } catch (err) {
      handleError(err)
      cleanup()
    }
  }

  const handleBridge = async () => {
    setBridging(true)

    const cleanup = () => {
      setBridging(false)
      refetchBalance()
      refetch(bridgeContractAddress)
    }

    const handleError = (err) => {
      notifyError(err, `Could not bridge ${tokenSymbol}`)
    }

    const onRetryCancel = () => {
      cleanup()
    }

    const onError = (err) => {
      handleError(err)
      cleanup()
    }

    const args = {
      dstChainId: destChainId,
      fromAddress: account,
      toAddress: receiverAddress || account,
      amount: sendAmountInUnits,
      zroPaymentAddress: AddressZero,
      adapterParams: '0x'
    }

    try {
      const provider = getProviderOrSigner(library, account, networkId)
      const instance = new Contract(bridgeContractAddress, ABI, provider)

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.BRIDGE_TOKEN,
          status: STATUS.PENDING,
          data: {
            value: convertFromUnits(sendAmountInUnits, sourceTokenDecimal),
            tokenSymbol
          }
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.BRIDGE_TOKEN, STATUS.PENDING, {
              value: convertFromUnits(sendAmountInUnits, sourceTokenDecimal),
              tokenSymbol
            }).title,
            success: getActionMessage(METHODS.BRIDGE_TOKEN, STATUS.SUCCESS, {
              value: convertFromUnits(sendAmountInUnits, sourceTokenDecimal),
              tokenSymbol
            }).title,
            failure: getActionMessage(METHODS.BRIDGE_TOKEN, STATUS.FAILED, {
              value: convertFromUnits(sendAmountInUnits, sourceTokenDecimal),
              tokenSymbol
            }).title
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.BRIDGE_TOKEN,
                status: STATUS.SUCCESS
              })
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.BRIDGE_TOKEN,
                status: STATUS.FAILED
              })
            }
          }
        )

        await tx?.wait()
        cleanup()
      }

      await writeContract({
        instance,
        methodName: METHOD_NAME,
        args: [
          args.toAddress, // _receiver
          sourceTokenAddress, // _token
          args.amount, // _amount
          args.dstChainId.toString(), // _dstChainId
          Date.now().toString(), // _nonce
          estimation.max_slippage// maxSlippage
        ],
        onTransactionResult,
        onRetryCancel,
        onError
      })
    } catch (err) {
      handleError(err)
      cleanup()
    }
  }

  const canApprove =
    !toBNSafe(sendAmount).isZero() &&
    convertToUnits(sendAmount, sourceTokenDecimal).isLessThanOrEqualTo(balance) &&
    convertToUnits(sendAmount, sourceTokenDecimal).isGreaterThan(allowance)

  const canBridge = !toBNSafe(sendAmount).isZero() &&
                convertToUnits(sendAmount, sourceTokenDecimal)
                  .isLessThanOrEqualTo(allowance)

  const isValidAddress = isAddress(receiverAddress)

  const buttonDisabled =
  !(canApprove || canBridge) ||
  approving ||
  bridging ||
  estimating ||
  (canBridge && receiverAddress && !isValidAddress)

  return {
    balance,
    approvedNpm: allowance,
    handleApprove,
    approving,
    handleBridge,
    bridging,
    allowance,
    estimating,
    chainGasPrice,
    delayPeriod,

    bridgeContractAddress,
    tokenSymbol,
    sourceTokenAddress,
    sourceTokenDecimal,

    tokenData: celerData.tokenData,
    filteredNetworks: celerData.filteredNetworks,

    canApprove,
    canBridge,
    buttonDisabled,

    balanceError,
    estimation
  }
}

export { useCelerBridge }
