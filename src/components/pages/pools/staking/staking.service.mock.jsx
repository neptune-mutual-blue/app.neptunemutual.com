import { getAvailableStakingPools as getAvailableStakingsMock } from "@/src/_mocks/pools/staking";
import { sleeper } from "@/src/_mocks/utils";

export const getAvailableStakings = async () => {
  await sleeper(1000)();
  return getAvailableStakingsMock();
};
