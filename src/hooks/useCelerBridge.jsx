import {
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
import { getFeeEstimationUrl } from '@/src/config/bridge/celer'

const ABI = [
  'function send(address receiver, address token, uint256 amount, uint64 dstChainId, uint64 nonce, uint32 maxSlippage) external'
]

const METHOD_NAME = 'send'

const useCelerBridge = ({
  bridgeContractAddress,
  tokenAddress,
  tokenSymbol,
  tokenDecimal
}) => {
  const [approving, setApproving] = useState(false)
  const [bridging, setBridging] = useState(false)
  const [estimating, setCalculatingFee] = useState(false)

  const { balance, refetch: refetchBalance } = useERC20Balance(tokenAddress)
  const { allowance, approve, refetch } = useERC20Allowance(tokenAddress)

  const { networkId } = useNetwork()
  const { library, account } = useWeb3React()

  const { isTestNet } = getNetworkInfo(networkId)

  useEffect(() => {
    refetch(bridgeContractAddress)
  }, [refetch, bridgeContractAddress])

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

  const getEstimation = async (
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
      setCalculatingFee(true)
      const URL = getFeeEstimationUrl({
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
      setCalculatingFee(false)
    }

    return null
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
    getEstimation,
    estimating
  }
}

export { useCelerBridge }
