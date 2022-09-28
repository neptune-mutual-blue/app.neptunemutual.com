import { utils } from '@neptunemutual/sdk'
const b32 = utils.keyUtil.toBytes32

export const name = (poolKey, property = 'name') => {
  return {
    key: [b32('ns:pool:staking'), poolKey],
    returns: 'string',
    property
  }
}

export const stakingToken = (poolKey, property = 'stakingToken') => {
  return {
    key: [utils.keyUtil.STAKING.STAKING_TOKEN, poolKey],
    returns: 'address',
    property
  }
}

export const stakingTokenStablecoinPair = (
  poolKey,
  property = 'stakingTokenStablecoinPair'
) => {
  return {
    key: [utils.keyUtil.STAKING.STAKING_TOKEN_UNI_STABLECOIN_PAIR, poolKey],
    returns: 'address',
    property
  }
}

export const rewardToken = (poolKey, property = 'rewardToken') => {
  return {
    key: [utils.keyUtil.STAKING.REWARD_TOKEN, poolKey],
    returns: 'address',
    property
  }
}

export const rewardTokenStablecoinPair = (
  poolKey,
  property = 'rewardTokenStablecoinPair'
) => {
  return {
    key: [utils.keyUtil.STAKING.REWARD_TOKEN_UNI_STABLECOIN_PAIR, poolKey],
    returns: 'address',
    property
  }
}

export const totalStakedInPool = (poolKey, property = 'totalStakedInPool') => {
  return {
    key: [utils.keyUtil.STAKING.CUMULATIVE_STAKING_AMOUNT, poolKey],
    returns: 'uint256',
    property
  }
}

export const stakingTarget = (poolKey, property = 'target') => {
  return {
    key: [utils.keyUtil.STAKING.STAKING_TARGET, poolKey],
    returns: 'uint256',
    property
  }
}

export const maximumStake = (poolKey, property = 'maximumStake') => {
  return {
    key: [utils.keyUtil.STAKING.MAX_STAKE, poolKey],
    returns: 'uint256',
    property
  }
}

export const stakingTokenBalance = (
  poolKey,
  property = 'stakingTokenBalance'
) => {
  return {
    key: [utils.keyUtil.STAKING.STAKING_TOKEN_BALANCE, poolKey],
    returns: 'uint256',
    property
  }
}

export const cumulativeDeposits = (
  poolKey,
  property = 'cumulativeDeposits'
) => {
  return {
    key: [utils.keyUtil.STAKING.CUMULATIVE_STAKING_AMOUNT, poolKey],
    returns: 'uint256',
    property
  }
}

export const rewardPerBlock = (poolKey, property = 'rewardPerBlock') => {
  return {
    key: [utils.keyUtil.STAKING.REWARD_PER_BLOCK, poolKey],
    returns: 'uint256',
    property
  }
}

export const platformFee = (poolKey, property = 'platformFee') => {
  return {
    key: [utils.keyUtil.STAKING.REWARD_PLATFORM_FEE, poolKey],
    returns: 'uint256',
    property
  }
}

export const lockupPeriodInBlocks = (
  poolKey,
  property = 'lockupPeriodInBlocks'
) => {
  return {
    key: [utils.keyUtil.STAKING.LOCKUP_PERIOD_IN_BLOCKS, poolKey],
    returns: 'uint256',
    property
  }
}

export const rewardTokenBalance = (
  poolKey,
  property = 'rewardTokenBalance'
) => {
  return {
    key: [utils.keyUtil.STAKING.REWARD_TOKEN_BALANCE, poolKey],
    returns: 'uint256',
    property
  }
}

export const lastRewardHeight = (
  poolKey,
  account,
  property = 'lastRewardHeight'
) => {
  return {
    signature: ['bytes32', 'bytes32', 'address'],
    key: [utils.keyUtil.STAKING.REWARD_HEIGHTS, poolKey, account],
    returns: 'uint256',
    property
  }
}

export const lastDepositHeight = (
  poolKey,
  account,
  property = 'lastDepositHeight'
) => {
  return {
    signature: ['bytes32', 'bytes32', 'address'],
    key: [utils.keyUtil.STAKING.DEPOSIT_HEIGHTS, poolKey, account],
    returns: 'uint256',
    property
  }
}

export const myStake = (poolKey, account, property = 'myStake') => {
  return {
    signature: ['bytes32', 'bytes32', 'address'],
    key: [utils.keyUtil.STAKING.STAKING_TOKEN_BALANCE, poolKey, account],
    returns: 'uint256',
    property
  }
}
