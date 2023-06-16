import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useChainGasPrice } from '@/modules/bridge/useChainGasPrice'
import * as lzConfig from '@/src/config/bridge/layer-zero'
import {
  GAS_LIMIT_WITH_APPROVAL,
  GAS_LIMIT_WITHOUT_APPROVAL
} from '@/src/config/bridge/layer-zero'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { useDebounce } from '@/src/hooks/useDebounce'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { toBNSafe } from '@/utils/bn'
import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'

export function useLayerZeroEstimation ({
  allowance,
  receiverAddress,
  bridgeContractAddress,
  sendAmountInUnits,
  destChainId
}) {
  const { library, account } = useWeb3React()
  const { networkId } = useNetwork()
  const { notifyError } = useErrorNotifier()
  const { contractRead } = useTxPoster()

  const [estimation, setEstimation] = useState(null)
  const [estimating, setEstimating] = useState(false)

  const debouncedAmount = useDebounce(sendAmountInUnits, 1500)
  const { chainGasPrice } = useChainGasPrice()

  const getEstimatedDestGas = useCallback(async function () {
    const _dstChainId = lzConfig.LayerZeroChainIds[destChainId]
    if (!debouncedAmount || !_dstChainId || !receiverAddress) { return null }

    const handleError = (err) => {
      notifyError(err, 'Could not estimate fees')
    }

    try {
      const provider = getProviderOrSigner(library, account, networkId)
      const instance = new Contract(bridgeContractAddress, lzConfig.ABI, provider)

      const data = await contractRead({
        instance,
        methodName: 'estimateSendFee',
        args: [
          _dstChainId,
          receiverAddress,
          debouncedAmount,
          false,
          '0x' // _adapterParams
        ]
      })

      return data
    } catch (err) {
      handleError(err)
    }

    return null
  }, [account, bridgeContractAddress, contractRead, debouncedAmount, destChainId, library, networkId, notifyError, receiverAddress])

  const getEstimatedCurrentChainGas = useCallback(async function () {
    let fees = '0'

    try {
      const approved = toBNSafe(allowance).isGreaterThanOrEqualTo(debouncedAmount)
      const limit = approved ? GAS_LIMIT_WITH_APPROVAL : GAS_LIMIT_WITHOUT_APPROVAL
      if (limit) {
        fees = toBNSafe(chainGasPrice).multipliedBy(limit).toString()
      }
    } catch (error) {
      console.error(`Error in getting gas limit for 'sendFrom' method: ${error}`)
    }

    return fees
  }, [allowance, chainGasPrice, debouncedAmount])

  const updateEstimation = useCallback(async function () {
    setEstimating(true)

    const _estimation = await getEstimatedDestGas()
    setEstimation(_estimation)

    const currentChainGas = await getEstimatedCurrentChainGas()
    if (currentChainGas) {
      setEstimation(_prev => { return { ..._prev, currentChainGas } })
    }

    setEstimating(false)
  }, [getEstimatedDestGas, getEstimatedCurrentChainGas])

  useEffect(() => {
    updateEstimation()
  }, [updateEstimation])

  return {
    chainGasPrice,
    estimation,
    estimating
  }
}
