import { DAYS, MULTIPLIER } from "@/src/config/constants";
import { sumOf, toBN } from "@/utils/bn";
import { utils } from "@neptunemutual/sdk";

export const getDiscountedPrice = (discountRate, npmPrice) => {
  const discountedPrice = (npmPrice * (MULTIPLIER - discountRate)) / MULTIPLIER;
  return discountedPrice.toFixed(12);
};

export const getAnnualDiscountRate = (protoDiscountRate, vestingTerm) => {
  // Divide by the multiplier to receive back the original number
  const discountRate = protoDiscountRate / MULTIPLIER;
  const discountRatePerDay = discountRate / vestingTerm;

  // Annualized discount rate
  return discountRatePerDay * 365 * DAYS;
};

export const calcBondPoolTVL = async (bondPool, networkId, NPMTokenAddress) => {
  const bondInitialNpm = bondPool.values[3];
  const bondClaimed = bondPool.totalBondClaimed;
  const bondLpTokensAdded = bondPool.totalLpAddedToBond;

  const bondNpmBalance = toBN(bondInitialNpm).minus(bondClaimed).toString();

  const bondNpmValue = await utils.pricing.token.getPrice(
    networkId,
    NPMTokenAddress,
    bondNpmBalance
  );

  const lpTokenPrice = await utils.pricing.lp.getPrice(
    networkId,
    bondPool.address0,
    "1"
  );

  const bondLpTokenValue = toBN(bondLpTokensAdded).multipliedBy(lpTokenPrice);

  return sumOf(bondNpmValue.toString(), bondLpTokenValue.toString()).toString();
};
