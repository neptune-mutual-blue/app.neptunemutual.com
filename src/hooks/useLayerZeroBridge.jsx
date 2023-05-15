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
import { convertFromUnits } from '@/utils/bn'

const ABI = [
  'function estimateSendFee(uint16 _dstChainId, bytes calldata _toAddress, uint _amount, bool _useZro, bytes calldata _adapterParams) external view returns (uint nativeFee, uint zroFee)',
  'function sendFrom(address _from, uint16 _dstChainId, bytes calldata _toAddress, uint _amount, address payable _refundAddress, address _zroPaymentAddress, bytes calldata _adapterParams) external payable'
]

const useLayerZeroBridge = ({
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

  useEffect(() => {
    refetch(bridgeContractAddress)
  }, [refetch, bridgeContractAddress])

  const txToast = useTxToast()
  const { notifyError } = useErrorNotifier()
  const { writeContract, contractRead } = useTxPoster()

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
    destChainId
  ) => {
    if (!sendAmount || !destChainId) return null

    const handleError = (err) => {
      notifyError(err, 'Could not estimate fees')
    }

    try {
      setCalculatingFee(true)
      const provider = getProviderOrSigner(library, account, networkId)
      const instance = new Contract(bridgeContractAddress, ABI, provider)

      const data = await contractRead({
        instance,
        methodName: 'estimateSendFee',
        args: [
          destChainId, // _dstChainId
          receiverAddress, // _toAddress
          sendAmount, // _amount
          false, // _useZro
          '0x'// _adapterParams
        ]
      })

      return data
    } catch (err) {
      handleError(err)
    } finally {
      setCalculatingFee(false)
    }

    return null
  }

  const handleBridge = async (sendAmount, dstChainId, receiverAddress) => {
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
      dstChainId: dstChainId,
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
        methodName: 'sendFrom',
        args: [
          args.fromAddress, // _from
          args.dstChainId, // _dstChainId
          args.toAddress, // _toAddress
          args.amount, // _amount
          args.fromAddress, // _refundAddress
          args.zroPaymentAddress, // _zroPaymentAddress
          args.adapterParams // _adapterParam
        ],
        overrides: {
          value: (await getEstimation(args.amount, args.toAddress, args.dstChainId)).nativeFee
        },
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

export { useLayerZeroBridge }
