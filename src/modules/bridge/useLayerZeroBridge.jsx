import {
  useEffect,
  useMemo,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import {
  useLayerZeroDestinationBalance
} from '@/modules/bridge/useLayerZeroDestinationBalance'
import * as lzConfig from '@/src/config/bridge/layer-zero'
import { networks } from '@/src/config/networks'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { useActionMessage } from '@/src/helpers/notification'
import { useERC20Allowance } from '@/src/hooks/useERC20Allowance'
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
  convertToUnits,
  toBNSafe
} from '@/utils/bn'
import { getNetworkInfo } from '@/utils/network'
import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'

import { useLayerZeroEstimation } from './useLayerZeroEstimation'

export const useLayerZeroBridge = ({ destChainId, sendAmount, receiverAddress }) => {
  const { networkId } = useNetwork()

  const layerZeroData = useMemo(() => {
    const { isTestNet } = getNetworkInfo(networkId)
    const tokenData = isTestNet ? lzConfig.TESTNET_TOKENS : lzConfig.MAINNET_TOKENS
    const _networks = isTestNet ? networks.testnet : networks.mainnet
    const filtered = _networks
      .filter(n => { return Object.keys(tokenData).includes(n.chainId.toString()) }) // filtered based on availability of tokens

    return {
      bridgeContractAddress: lzConfig.BRIDGE_CONTRACTS[networkId],
      tokenSymbol: 'NPM',
      tokenData,
      filteredNetworks: filtered
    }
  }, [networkId])

  const bridgeContractAddress = layerZeroData.bridgeContractAddress
  const tokenSymbol = layerZeroData.tokenSymbol
  const sourceTokenAddress = layerZeroData.tokenData[networkId]?.address
  const sourceTokenDecimal = layerZeroData.tokenData[networkId]?.decimal

  const sendAmountInUnits = convertToUnits(sendAmount || '0', sourceTokenDecimal).toString()

  const [approving, setApproving] = useState(false)
  const [bridging, setBridging] = useState(false)

  const { balance, refetch: refetchBalance } = useERC20Balance(sourceTokenAddress)
  const { allowance, approve, refetch } = useERC20Allowance(sourceTokenAddress)

  const { library, account } = useWeb3React()

  const { getActionMessage } = useActionMessage()

  const { balance: destinationBalance } = useLayerZeroDestinationBalance(destChainId)
  const {
    chainGasPrice,
    estimating,
    estimation
  } = useLayerZeroEstimation({
    allowance,
    bridgeContractAddress,
    destChainId,
    receiverAddress,
    sendAmountInUnits
  })

  useEffect(() => {
    refetch(bridgeContractAddress)
  }, [refetch, bridgeContractAddress])

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
      dstChainId: lzConfig.LayerZeroChainIds[destChainId],
      fromAddress: account,
      toAddress: receiverAddress || account,
      amount: sendAmountInUnits,
      zroPaymentAddress: AddressZero,
      adapterParams: '0x'
    }

    try {
      const provider = getProviderOrSigner(library, account, networkId)
      const instance = new Contract(bridgeContractAddress, lzConfig.ABI, provider)

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
          value: estimation?.nativeFee
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

  const canApprove =
    !toBNSafe(sendAmount).isZero() &&
    convertToUnits(sendAmount, sourceTokenDecimal).isLessThanOrEqualTo(balance) &&
    convertToUnits(sendAmount, sourceTokenDecimal).isGreaterThan(allowance)

  const canBridge =
    !toBNSafe(sendAmount).isZero() &&
    convertToUnits(sendAmount, sourceTokenDecimal).isLessThanOrEqualTo(allowance)

  const isValidAddress = isAddress(receiverAddress)

  const buttonDisabled =
    !(canApprove || canBridge) ||
    approving ||
    bridging ||
    estimating ||
    (canBridge && receiverAddress && !isValidAddress) ||
    convertToUnits(sendAmount, sourceTokenDecimal).isGreaterThan(destinationBalance)

  return {
    approvedNpm: allowance,
    approving,
    allowance,
    balance,
    bridgeContractAddress,
    bridging,
    handleApprove,
    handleBridge,
    sourceTokenAddress,
    sourceTokenDecimal,
    tokenSymbol,
    tokenData: layerZeroData.tokenData,
    filteredNetworks: layerZeroData.filteredNetworks,

    canApprove,
    canBridge,
    destinationBalance,
    buttonDisabled,

    chainGasPrice,
    estimating,
    estimation
  }
}
