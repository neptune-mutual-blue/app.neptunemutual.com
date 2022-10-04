import sdk from '@neptunemutual/sdk'

export const getKeys = async (account) => {
  return [
    {
      key: [sdk.utils.keyUtil.BOND.LP_TOKEN],
      returns: 'address',
      property: 'lpToken'
    },
    {
      key: [sdk.utils.keyUtil.BOND.DISCOUNT_RATE],
      returns: 'uint256',
      property: 'discountRate'
    },
    {
      key: [sdk.utils.keyUtil.BOND.VESTING_TERM],
      returns: 'uint256',
      property: 'vestingTerm'
    },
    {
      key: [sdk.utils.keyUtil.BOND.MAX_UNIT],
      returns: 'uint256',
      property: 'maxBond'
    },
    {
      key: [sdk.utils.keyUtil.BOND.TOTAL_NPM_ALLOCATED],
      returns: 'uint256',
      property: 'totalNpmAllocated'
    },
    {
      key: [sdk.utils.keyUtil.BOND.TOTAL_NPM_DISTRIBUTED],
      returns: 'uint256',
      property: 'totalNpmDistributed'
    },
    {
      key: [sdk.utils.keyUtil.BOND.CONTRIBUTION, account],
      signature: ['bytes32', 'address'],
      returns: 'uint256',
      property: 'bondContribution'
    },
    {
      key: [sdk.utils.keyUtil.BOND.TO_CLAIM, account],
      signature: ['bytes32', 'address'],
      returns: 'uint256',
      property: 'claimable'
    },
    {
      key: [sdk.utils.keyUtil.BOND.UNLOCK_DATE, account],
      signature: ['bytes32', 'address'],
      returns: 'uint256',
      property: 'unlockDate'
    }
  ]
}
