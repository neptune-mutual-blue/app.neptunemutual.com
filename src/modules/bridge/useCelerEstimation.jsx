import {
  useCallback,
  useEffect,
  useState
} from 'react'

import {
  GAS_LIMIT_WITH_APPROVAL,
  GAS_LIMIT_WITHOUT_APPROVAL,
  getAmountEstimationUrl
} from '@/src/config/bridge/celer'
import { useNetwork } from '@/src/context/Network'
import { useDebounce } from '@/src/hooks/useDebounce'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import {
  convertToUnits,
  toBNSafe
} from '@/utils/bn'
import { getNetworkInfo } from '@/utils/network'
import { useWeb3React } from '@web3-react/core'

const SLIPPAGE_MULTIPLIER = 1_000_000
const SLIPPAGE = (0.3 / 100) * SLIPPAGE_MULTIPLIER // 0.3%

export function useCelerEstimation ({
  allowance, srcChainId, destChainId, sendAmount, receiverAddress, tokenSymbol, sourceTokenDecimal
}) {
  const { networkId } = useNetwork()
  const { library } = useWeb3React()

  const [balanceError, setBalanceError] = useState('')
  const [estimation, setEstimation] = useState(null)
  const debouncedAmount = useDebounce(convertToUnits(sendAmount || '0', sourceTokenDecimal).toString(), 1000)

  const [estimating, setEstimating] = useState(false)
  const { notifyError } = useErrorNotifier()

  const { isTestNet } = getNetworkInfo(networkId)

  const getEstimatedReceiveAmount = async (
    sendAmount,
    receiverAddress,
    srcChainId,
    destChainId,
    slippage
  ) => {
    if (!sendAmount || toBNSafe(sendAmount).isZero() || !destChainId || !srcChainId) { return null }

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

  const [chainGasPrice, setChainGasPrice] = useState('0')

  const getAndUpdateChainGasPrice = useCallback(async () => {
    if (!library) { return '0' }

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

  const updateEstimation = useCallback(async function () {
    setBalanceError('')
    const _estimation = await getEstimatedReceiveAmount(
      debouncedAmount,
      receiverAddress,
      srcChainId,
      destChainId,
      SLIPPAGE
    )
    if (_estimation?.err) {
      setBalanceError(_estimation.err.msg)
      setEstimation({
        estimated_receive_amt: '0',
        perc_fee: '0',
        base_fee: '0'
      })
    } else { setEstimation(_estimation) }

    const fees = await getEstimatedCurrentChainGas(
      convertToUnits(sendAmount, sourceTokenDecimal).toString()
    )
    if (fees) { setEstimation(_prev => ({ ..._prev, currentChainGas: fees })) }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiverAddress, debouncedAmount, destChainId, srcChainId])

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
