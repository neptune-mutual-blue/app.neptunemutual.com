import { getCoverInfo } from "@/src/_mocks/cover";
import { sleeper } from "@/src/_mocks/utils";
import { FEES, MAX_VALUE_TO_PURCHASE } from "@/src/_mocks/cover/coverform";

export const getCoverByAddress = async (address) => {
  await sleeper(1000)();
  return getCoverInfo();
};

export const getFees = async () => {
  const FEES = 6.5;
  await sleeper(1000)();
  return FEES;
};

export const getMaxValueToPurchase = async () => {
  const MAX_VALUE_TO_PURCHASE = 500000;
  await sleeper(1000)();
  return MAX_VALUE_TO_PURCHASE;
};
