import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { getActionMessage } from '@/src/helpers/notification'
import { useERC20Allowance } from '@/src/hooks/useERC20Allowance'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useTxToast } from '@/src/hooks/useTxToast'
import { METHODS } from '@/src/services/transactions/const'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'
import { convertFromUnits, toBNSafe } from '@/utils/bn'
import { getNetworkInfo } from '@/utils/network'
import { GAS_LIMIT_WITHOUT_APPROVAL, GAS_LIMIT_WITH_APPROVAL, getAmountEstimationUrl } from '@/src/config/bridge/celer'
import { contractRead } from '@/src/services/readContract'

const ABI = [
  { inputs: [], name: 'delayPeriod', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ internalType: 'address', name: '_receiver', type: 'address' }, { internalType: 'address', name: '_token', type: 'address' }, { internalType: 'uint256', name: '_amount', type: 'uint256' }, { internalType: 'uint64', name: '_dstChainId', type: 'uint64' }, { internalType: 'uint64', name: '_nonce', type: 'uint64' }, { internalType: 'uint32', name: '_maxSlippage', type: 'uint32' }], name: 'send', outputs: [], stateMutability: 'nonpayable', type: 'function' }
]

const METHOD_NAME = 'send'

export const useCelerBridge = ({
  bridgeContractAddress,
  tokenAddress,
  tokenSymbol,
  tokenDecimal
}) => {
  const [approving, setApproving] = useState(false)
  const [bridging, setBridging] = useState(false)
  const [estimating, setEstimating] = useState(false)

  const [delayPeriod, setDelayPeriod] = useState('5 - 20 minutes')

  const { balance, refetch: refetchBalance } = useERC20Balance(tokenAddress)
  const { allowance, approve, refetch } = useERC20Allowance(tokenAddress)

  const { networkId } = useNetwork()
  const { library, account } = useWeb3React()

  const { isTestNet } = getNetworkInfo(networkId)

  const [chainGasPrice, setChainGasPrice] = useState('0')

  const getAndUpdateChainGasPrice = useCallback(async () => {
    if (!library) return '0'

    try {
      const _gasPrice = await library.getGasPrice()
      setChainGasPrice(_gasPrice.toString())
      return _gasPrice.toString()
    } catch (e) {
      console.error(`Error in getting current chain gas Price: ${e}`)
    }

    return '0'
  }, [library])

  useEffect(() => {
    getAndUpdateChainGasPrice()
  }, [getAndUpdateChainGasPrice])

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

  const handleApprove = (sendAmount) => {
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
            value: convertFromUnits(sendAmount, tokenDecimal),
            tokenSymbol: tokenSymbol
          }
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.BRIDGE_APPROVE, STATUS.PENDING, {
              value: convertFromUnits(sendAmount, tokenDecimal),
              tokenSymbol: tokenSymbol
            }).title,
            success: getActionMessage(METHODS.BRIDGE_APPROVE, STATUS.SUCCESS, {
              value: convertFromUnits(sendAmount, tokenDecimal),
              tokenSymbol: tokenSymbol
            }).title,
            failure: getActionMessage(METHODS.BRIDGE_APPROVE, STATUS.FAILED, {
              value: convertFromUnits(sendAmount, tokenDecimal),
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

      approve(bridgeContractAddress, sendAmount, {
        onTransactionResult,
        onRetryCancel,
        onError
      })
    } catch (err) {
      handleError(err)
      cleanup()
    }
  }

  const getEstimatedReceiveAmount = async (
    sendAmount,
    receiverAddress,
    srcChainId,
    destChainId,
    slippage
  ) => {
    if (!sendAmount || toBNSafe(sendAmount).isZero() || !destChainId || !srcChainId) return null

    const handleError = (err) => {
      notifyError(err, 'Could not estimate fees')
    }

    try {
      setEstimating(true)
      const URL = getAmountEstimationUrl({
        isTest: isTestNet,
        srcChainId,
        destChainId,
        tokenSymbol,
        sendAmount,
        receiverAddress,
        slippage
      })

      const res = await fetch(URL)
      const data = await res.json()

      return data
    } catch (err) {
      handleError(err)
    } finally {
      setEstimating(false)
    }

    return null
  }

  const getEstimatedCurrentChainGas = async (sendAmount) => {
    let fees = '0'

    try {
      const _chainGasPrice = await getAndUpdateChainGasPrice()
      const approved = toBNSafe(allowance).isGreaterThanOrEqualTo(sendAmount)
      const limit = approved ? GAS_LIMIT_WITH_APPROVAL : GAS_LIMIT_WITHOUT_APPROVAL
      if (limit) {
        fees = toBNSafe(_chainGasPrice).multipliedBy(limit).toString()
      }
    } catch (error) {
      console.error(error)
    }

    return fees
  }

  const handleBridge = async (sendAmount, dstNetwork, receiverAddress, maxSlippage) => {
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
      dstChainId: dstNetwork.chainId,
      fromAddress: account,
      toAddress: receiverAddress || account,
      amount: sendAmount,
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
            value: convertFromUnits(sendAmount, tokenDecimal),
            tokenSymbol
          }
        })

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.BRIDGE_TOKEN, STATUS.PENDING, {
              value: convertFromUnits(sendAmount, tokenDecimal),
              tokenSymbol
            }).title,
            success: getActionMessage(METHODS.BRIDGE_TOKEN, STATUS.SUCCESS, {
              value: convertFromUnits(sendAmount, tokenDecimal),
              tokenSymbol
            }).title,
            failure: getActionMessage(METHODS.BRIDGE_TOKEN, STATUS.FAILED, {
              value: convertFromUnits(sendAmount, tokenDecimal),
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
          tokenAddress, // _token
          args.amount, // _amount
          args.dstChainId.toString(), // _dstChainId
          Date.now().toString(), // _nonce
          maxSlippage// maxSlippage
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

  return {
    balance,
    approvedNpm: allowance,
    handleApprove,
    approving,
    handleBridge,
    bridging,
    allowance,
    getEstimatedReceiveAmount,
    estimating,
    getEstimatedCurrentChainGas,
    chainGasPrice,
    delayPeriod
  }
}
