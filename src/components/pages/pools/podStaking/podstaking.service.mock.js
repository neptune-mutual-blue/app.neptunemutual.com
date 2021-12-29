import { getAvailablePodStakingPools as getAvailablePodStakingsMock } from "@/src/_mocks/pools/podstaking";
import { sleeper } from "@/src/_mocks/utils";

export const getAvailablePodStakings = async () => {
  await sleeper(500)();
  return getAvailablePodStakingsMock();
};
