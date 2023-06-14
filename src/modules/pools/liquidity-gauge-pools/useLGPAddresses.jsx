import {
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { CONTRACT_DEPLOYMENTS } from '@/src/config/constants'
import { abis } from '@/src/config/contracts/abis'
import { useNetwork } from '@/src/context/Network'
import { multicall } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

// @todo: Delete once `GCR_POOLS_URL` endpoint starts sending pool keys
export const useLGPAddresses = (keys) => {
  const [data, setData] = useState({})

  const { library, account } = useWeb3React()
  const { networkId } = useNetwork()

  useEffect(() => {
    let ignore = false

    if (!account) {
      return
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId)

    async function exec () {
      const { Contract, Provider } = multicall

      const multiCallProvider = new Provider(signerOrProvider.provider)

      await multiCallProvider.init() // Only required when `chainId` is not provided in the `Provider` constructor

      const calls = []
      keys.forEach((key) => {
        const instance = new Contract(CONTRACT_DEPLOYMENTS[networkId].gaugeControllerRegistry, abis.GaugeControllerRegistry)

        calls.push(instance._pools(key))
      })

      const addresses = await multiCallProvider.all(calls)

      const _data = {}
      addresses.forEach((address, i) => {
        _data[keys[i]] = address
      })

      if (ignore) return
      setData(_data)
    }

    if (keys.length > 0) {
      exec()
    }

    return () => {
      ignore = true
    }
  }, [account, keys, library, networkId])

  return {
    data
  }
}
