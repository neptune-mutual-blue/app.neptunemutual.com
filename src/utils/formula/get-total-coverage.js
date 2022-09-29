import { sumOf } from '@/utils/bn'

/**
 * @typedef IVault
 * @prop {string} totalFlashLoanFees
 * @prop {string} totalCoverLiquidityAdded
 * @prop {string} totalCoverLiquidityRemoved
 * @prop {string} totalCoverFee
 *
 *
 * @param {IVault[]} vaults
 */
function getTotalCoverage (vaults) {
  const totalCoverLiquidityAdded = sumOf(
    ...vaults.map((x) => x.totalCoverLiquidityAdded)
  )
  const totalCoverLiquidityRemoved = sumOf(
    ...vaults.map((x) => x.totalCoverLiquidityRemoved)
  )
  const totalFlashLoanFees = sumOf(...vaults.map((x) => x.totalFlashLoanFees))

  const tvlCover = totalCoverLiquidityAdded
    .minus(totalCoverLiquidityRemoved)
    .plus(totalFlashLoanFees)
    .toString()

  return tvlCover
}

export { getTotalCoverage }
