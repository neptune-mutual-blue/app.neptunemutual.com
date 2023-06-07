import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { CONTRACT_DEPLOYMENTS } from '@/src/config/constants'
import { abis } from '@/src/config/contracts/abis'
import { useNetwork } from '@/src/context/Network'
import { contractRead } from '@/src/services/readContract'

import { utils } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

export const useLiquidityGaugePoolStakedAndReward = ({ poolKey }) => {
  const { networkId } = useNetwork()
  const { account, library } = useWeb3React()

  const liquidityGaugePoolAddress = CONTRACT_DEPLOYMENTS[networkId]?.liquidityGaugePool

  const [poolStaked, setPoolStaked] = useState('0')
  const [rewardAmount, setRewardAmount] = useState('0')

  const fetchStakedAndReward = useCallback(async () => {
    if (!networkId || !account || !poolKey) return

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = utils.contract.getContract(liquidityGaugePoolAddress, abis.LiquidityGaugePool, signerOrProvider)

      const args = [poolKey, account]
      const calls = [
        contractRead({
          instance,
          methodName: '_poolStakedByMe',
          args
        }),
        contractRead({
          instance,
          methodName: 'calculateReward',
          args
        })
      ]
      const [staked, reward] = await Promise.all(calls)
      setPoolStaked(staked.toString())
      setRewardAmount(reward.toString())
    } catch (error) {
      console.error('Error in getting staked pool amount & reward', error)
    }
  }, [account, library, liquidityGaugePoolAddress, networkId, poolKey])

  useEffect(() => {
    fetchStakedAndReward()
  }, [fetchStakedAndReward])

  return {
    poolStaked,
    rewardAmount,
    update: fetchStakedAndReward
  }
}
