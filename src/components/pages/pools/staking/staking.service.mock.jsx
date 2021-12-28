import { getAvailableStakingPools as getAvailableStakingsMock } from "@/src/_mocks/pools/staking";
import { sleeper } from "@/src/_mocks/utils";

export const getAvailableStakings = async () => {
  await sleeper(1000)();
  return getAvailableStakingsMock();
};

export const earnPercentage = () => {
  const randomBuffer = new Uint32Array(1);

  window.crypto.getRandomValues(randomBuffer);

  let randomNumber = randomBuffer[0] / (0xffffffff + 1);

  return Math.floor(randomNumber * 50) / 100;
};
