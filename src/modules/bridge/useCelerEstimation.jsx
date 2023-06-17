import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

import { useChainGasPrice } from '@/modules/bridge/useChainGasPrice'
import {
  GAS_LIMIT_WITH_APPROVAL,
  GAS_LIMIT_WITHOUT_APPROVAL,
  getAmountEstimationUrl
} from '@/src/config/bridge/celer'
import { useNetwork } from '@/src/context/Network'
import { useDebounce } from '@/src/hooks/useDebounce'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import {
  convertFromUnits,
  toBNSafe
} from '@/utils/bn'
import { getNetworkInfo } from '@/utils/network'

const SLIPPAGE_MULTIPLIER = 1_000_000
const SLIPPAGE = (0.3 / 100) * SLIPPAGE_MULTIPLIER // 0.3%

export function useCelerEstimation ({
  allowance,
  srcChainId,
  destChainId,
  sendAmountInUnits,
  receiverAddress,
  tokenSymbol,
  sourceTokenDecimal,
  destinationTokenDecimal
}) {
  const { networkId } = useNetwork()
  const { notifyError } = useErrorNotifier()

  const [balanceError, setBalanceError] = useState('')
  const [estimating, setEstimating] = useState(false)
  const [estimation, setEstimation] = useState({
    estimated_receive_amt: '0',
    perc_fee: '0',
    base_fee: '0',
    protocolFee: '0',
    protocolFeePercent: '0',
    max_slippage: '0'
  })

  const { chainGasPrice } = useChainGasPrice()
  const debouncedAmount = useDebounce(sendAmountInUnits, 1500)
  const { isTestNet } = getNetworkInfo(networkId)

  const estimationURL = useMemo(() => {
    if (!debouncedAmount || toBNSafe(debouncedAmount).isZero() || !destChainId || !srcChainId) {
      return null
    }

    const url = getAmountEstimationUrl({
      isTestNet,
      srcChainId,
      destChainId,
      tokenSymbol,
      sendAmountInUnits: debouncedAmount,
      receiverAddress,
      slippage: SLIPPAGE
    })

    return url
  }, [debouncedAmount, destChainId, isTestNet, receiverAddress, srcChainId, tokenSymbol])

  const getEstimatedReceiveAmount = useCallback(async function () {
    if (!estimationURL) {
      return null
    }

    try {
      setEstimating(true)
      const res = await fetch(estimationURL)
      const data = await res.json()

      return data
    } catch (err) {
      notifyError(err, 'Could not estimate fees')
    } finally {
      setEstimating(false)
    }

    return null
  }, [estimationURL, notifyError])

  const getEstimatedCurrentChainGas = useCallback(async function () {
    let fees = '0'

    try {
      const approved = toBNSafe(allowance)
        .isGreaterThanOrEqualTo(debouncedAmount)
      const limit = approved ? GAS_LIMIT_WITH_APPROVAL : GAS_LIMIT_WITHOUT_APPROVAL
      if (limit) {
        fees = toBNSafe(chainGasPrice).multipliedBy(limit).toString()
      }
    } catch (error) {
      console.error(error)
    }

    return fees
  }, [allowance, chainGasPrice, debouncedAmount])

  const updateEstimation = useCallback(async function () {
    setBalanceError('')
    const _estimation = await getEstimatedReceiveAmount()

    if (_estimation?.err) {
      setBalanceError(_estimation.err.msg)
      setEstimation({
        estimated_receive_amt: '0',
        perc_fee: '0',
        base_fee: '0',
        protocolFee: '0',
        protocolFeePercent: '0',
        max_slippage: '0'
      })
    } else {
      const protocolFee = convertFromUnits(_estimation?.perc_fee || '0', destinationTokenDecimal).toString()
      const sendAmount = convertFromUnits(debouncedAmount || '0', sourceTokenDecimal)
      setEstimation({
        ..._estimation,
        protocolFee,
        protocolFeePercent: sendAmount.isGreaterThan(0)
          ? toBNSafe(protocolFee).dividedBy(sendAmount || '0').multipliedBy(100).toString()
          : '0'
      })
    }

    const fees = await getEstimatedCurrentChainGas()
    if (fees) { setEstimation(_prev => { return { ..._prev, currentChainGas: fees } }) }
  }, [getEstimatedReceiveAmount, getEstimatedCurrentChainGas, destinationTokenDecimal, debouncedAmount, sourceTokenDecimal])

  useEffect(() => {
    updateEstimation()
  }, [updateEstimation])

  return {
    chainGasPrice,
    estimating,
    estimation,
    balanceError
  }
}
