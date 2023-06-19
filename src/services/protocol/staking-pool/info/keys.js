import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { config } from '@neptunemutual/sdk'
import { registry, stakingPools } from '../../../store-keys'

export const getKeys = async (chainId, poolKey, account, provider) => {
  return [
    registry.stakingPools('stakingPoolsContractAddress'),
    stakingPools.name(poolKey, 'name'),
    stakingPools.stakingToken(poolKey, 'stakingToken'),
    stakingPools.stakingTokenStablecoinPair(
      poolKey,
      'stakingTokenStablecoinPair'
    ),
    stakingPools.rewardToken(poolKey, 'rewardToken'),
    stakingPools.rewardTokenStablecoinPair(
      poolKey,
      'rewardTokenStablecoinPair'
    ),
    stakingPools.totalStakedInPool(poolKey, 'totalStaked'),
    stakingPools.stakingTarget(poolKey, 'target'),
    stakingPools.maximumStake(poolKey, 'maximumStake'),
    stakingPools.stakingTokenBalance(poolKey, 'stakeBalance'),
    stakingPools.cumulativeDeposits(poolKey, 'cumulativeDeposits'),
    stakingPools.rewardPerBlock(poolKey, 'rewardPerBlock'),
    stakingPools.platformFee(poolKey, 'platformFee'),
    stakingPools.lockupPeriodInBlocks(poolKey, 'lockupPeriodInBlocks'),
    stakingPools.rewardTokenBalance(poolKey, 'rewardTokenBalance'),
    stakingPools.lastRewardHeight(poolKey, account, 'lastRewardHeight'),
    stakingPools.lastDepositHeight(poolKey, account, 'lastDepositHeight'),
    stakingPools.myStake(poolKey, account, 'myStake'),
    {
      returns: 'uint256',
      property: 'totalBlockSinceLastReward',
      compute: async ({ result }) => {
        const { lastRewardHeight } = result
        const blockNumber = await provider.getBlockNumber()

        if (lastRewardHeight.eq('0')) {
          return lastRewardHeight
        }

        return BigNumber.from(blockNumber).sub(lastRewardHeight)
      }
    },
    {
      returns: 'uint256',
      property: 'rewards',
      compute: async ({ result }) => {
        const {
          totalBlockSinceLastReward,
          rewardPerBlock,
          myStake,
          rewardToken,
          stakingPoolsContractAddress
        } = result

        if (totalBlockSinceLastReward.eq('0')) {
          return BigNumber.from('0')
        }

        const rewardTokenInstance = new Contract(
          rewardToken,
          config.abis.IERC20,
          provider
        )

        const poolBalance = await rewardTokenInstance.balanceOf(
          stakingPoolsContractAddress
        )

        let rewards = myStake
          .mul(rewardPerBlock)
          .mul(totalBlockSinceLastReward)
          .div('1000000000000000000')

        if (rewards.gt(poolBalance)) {
          rewards = poolBalance
        }

        return rewards
      }
    },
    {
      returns: 'uint256',
      property: 'canWithdrawFromBlockHeight',
      compute: async ({ result }) => {
        const { lastDepositHeight, lockupPeriodInBlocks } = result

        return lastDepositHeight.add(lockupPeriodInBlocks)
      }
    }
  ]
}
