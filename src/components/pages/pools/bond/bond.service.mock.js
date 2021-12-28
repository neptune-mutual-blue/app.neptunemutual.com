import { getBondInfo } from "@/src/_mocks/pools/bond";
import { sleeper } from "@/src/_mocks/utils";

export const getBondData = async () => {
  await sleeper(500)();
  return getBondInfo();
};

export const getUnlockDate = async () => {
  const unlockDate = "September 22, 2021 12:37:03 PM UTC";
  await sleeper(500)();
  return unlockDate;
};
