import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { CONTRACT_DEPLOYMENTS } from '@/src/config/constants'
import { abis } from '@/src/config/contracts/abis'
import { useNetwork } from '@/src/context/Network'

import { multicall } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'

export const useLiquidityGaugePoolStakedAndReward = ({ poolKey }) => {
  const { networkId } = useNetwork()
  const { account, library } = useWeb3React()

  const liquidityGaugePoolAddress = CONTRACT_DEPLOYMENTS[networkId]?.liquidityGaugePool

  const [poolStaked, setPoolStaked] = useState('0')
  const [rewardAmount, setRewardAmount] = useState('0')

  const { notifyError } = useErrorNotifier()

  const fetchStakedAndReward = useCallback(async () => {
    if (!networkId || !account || !poolKey) return

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)

      const { Provider, Contract } = multicall

      const multiCallProvider = new Provider(signerOrProvider.provider)

      await multiCallProvider.init()

      const instance = new Contract(liquidityGaugePoolAddress, abis.LiquidityGaugePool)

      const args = [poolKey, account]
      const calls = [
        instance._poolStakedByMe(...args),
        instance.calculateReward(...args)
      ]
      const [staked, reward] = await multiCallProvider.all(calls)

      if (staked) setPoolStaked(staked.toString())
      if (reward) setRewardAmount(reward.toString())
    } catch (error) {
      notifyError(error)
      console.error(error)
    }
  }, [account, library, liquidityGaugePoolAddress, networkId, poolKey, notifyError])

  useEffect(() => {
    fetchStakedAndReward()
  }, [fetchStakedAndReward])

  return {
    poolStaked,
    rewardAmount,
    update: fetchStakedAndReward
  }
}
