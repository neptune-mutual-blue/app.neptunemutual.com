import { getAvailableStakingPools as getAvailableStakingsMock } from "@/src/_mocks/pools/staking";
import { sleeper } from "@/src/_mocks/utils";

export const getAvailableStakings = async () => {
  await sleeper(1000)();
  return getAvailableStakingsMock();
};

export const earnPercentage = () => {
  let randomNum = Math.floor(Math.random() * 50);
  let youEarned = randomNum / 100;
  return youEarned.toFixed(2);
};
