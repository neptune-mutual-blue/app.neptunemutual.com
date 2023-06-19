import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { abis } from '@/src/config/contracts/abis'
import { useNetwork } from '@/src/context/Network'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { multicall } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

export const useLiquidityGaugePoolStakedAndReward = ({ poolAddress }) => {
  const { networkId } = useNetwork()
  const { account, library } = useWeb3React()

  const liquidityGaugePoolAddress = poolAddress

  const [data, setData] = useState({
    lockedByMe: '0',
    reward: '0',
    lockedByEveryone: '0'
  })

  const { notifyError } = useErrorNotifier()

  const fetchStakedAndReward = useCallback(async () => {
    if (!networkId || !account || !liquidityGaugePoolAddress) { return }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)

      const { Provider, Contract } = multicall

      const multiCallProvider = new Provider(signerOrProvider.provider)

      await multiCallProvider.init()

      const instance = new Contract(liquidityGaugePoolAddress, abis.LiquidityGaugePool)

      const calls = [
        instance._lockedByEveryone(),
        instance._lockedByMe(account),
        instance.calculateReward(account)
      ]
      const [lockedByEveryone, lockedByMe, reward] = await multiCallProvider.all(calls)

      setData({
        lockedByEveryone: lockedByEveryone.toString(),
        lockedByMe: lockedByMe.toString(),
        reward: reward.toString()
      })
    } catch (error) {
      notifyError(error)
      console.error(error)
    }
  }, [account, library, liquidityGaugePoolAddress, networkId, notifyError])

  useEffect(() => {
    fetchStakedAndReward()
  }, [fetchStakedAndReward])

  return {
    lockedByEveryone: data.lockedByEveryone,
    lockedByMe: data.lockedByMe,
    rewardAmount: data.reward,
    update: fetchStakedAndReward
  }
}
