import { DAYS, MULTIPLIER } from "@/src/config/constants";

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
