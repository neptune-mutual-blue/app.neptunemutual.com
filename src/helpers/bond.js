import { DAYS, MULTIPLIER } from '@/src/config/constants'
import { isGreater, toBN } from '@/utils/bn'

export const getDiscountedPrice = (discountRate, npmPrice) => {
  const discountedPrice = (npmPrice * (MULTIPLIER - discountRate)) / MULTIPLIER

  return discountedPrice.toFixed(12)
}

export const getAnnualDiscountRate = (protoDiscountRate, vestingTerm) => {
  // Divide by the multiplier to receive back the original number
  const discountRate = protoDiscountRate / MULTIPLIER
  const discountRatePerDay = discountRate / vestingTerm

  // Annualized discount rate
  return discountRatePerDay * 365 * DAYS
}

export const calcBondPoolTVL = (bondPool, networkId, NPMTokenAddress) => {
  const totalNpmTopUp = bondPool.totalNpmTopUp
  const bondClaimed = bondPool.totalBondClaimed
  const bondLpTokensAdded = bondPool.totalLpAddedToBond

  const bondNpmBalance = isGreater(totalNpmTopUp, bondClaimed)
    ? toBN(totalNpmTopUp).minus(bondClaimed).toString()
    : '0'

  return {
    id: bondPool.id,
    data: [
      {
        type: 'token',
        address: NPMTokenAddress,
        amount: bondNpmBalance
      },
      {
        type: 'lp',
        address: bondPool.lpToken,
        amount: bondLpTokensAdded
      }
    ]
  }
}
