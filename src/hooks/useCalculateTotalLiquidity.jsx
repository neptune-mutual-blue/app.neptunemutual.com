import {
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'
import { sumOf } from '@/utils/bn'
import {
  config,
  multicall
} from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

export const useCalculateTotalLiquidity = ({ liquidityList = [] }) => {
  const [myTotalLiquidity, setMyTotalLiquidity] = useState('0')
  const { library, account } = useWeb3React()
  const { networkId } = useNetwork()

  useEffect(() => {
    if (liquidityList.length === 0) { return }

    let ignore = false

    const signerOrProvider = getProviderOrSigner(library, account, networkId)

    async function exec () {
      const { Contract, Provider } = multicall

      const multiCallProvider = new Provider(signerOrProvider.provider)

      await multiCallProvider.init() // Only required when `chainId` is not provided in the `Provider` constructor

      const calls = []
      liquidityList.forEach(({ podAmount, podAddress }) => {
        const instance = new Contract(podAddress, config.abis.IVault)

        calls.push(instance.calculateLiquidity(podAmount))
      })

      const amountsInStablecoin = await multiCallProvider.all(calls)

      if (ignore) { return }
      setMyTotalLiquidity(
        sumOf(...amountsInStablecoin.map((x) => { return x.toString() })).toString()
      )
    }

    if (liquidityList.length > 0) {
      exec()
    }

    return () => {
      ignore = true
    }
  }, [account, library, liquidityList, networkId])

  return myTotalLiquidity
}
