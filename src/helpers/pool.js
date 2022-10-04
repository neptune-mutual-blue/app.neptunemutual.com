import { toBN } from '@/utils/bn'

export const calcStakingPoolTVL = (pool) => {
  const rewardAmount = toBN(pool.rewardTokenDeposit)
    .minus(pool.totalRewardsWithdrawn)
    .toString()

  const stakingTokenAmount = toBN(pool.totalStakingTokenDeposited)
    .minus(pool.totalStakingTokenWithdrawn)
    .toString()

  return {
    id: pool.id,
    data: [
      {
        type: pool.poolType === 'PODStaking' ? 'pod' : 'token',
        address: pool.stakingToken,
        amount: stakingTokenAmount
      },
      {
        type: 'token',
        address: pool.rewardToken,
        amount: rewardAmount
      }
    ]
  }
}
