import { getCoverInfo } from "@/src/_mocks/cover";
import { sleeper } from "@/src/_mocks/utils";

export const getCoverByAddress = async (address) => {
  await sleeper(1000)();
  return getCoverInfo();
};
