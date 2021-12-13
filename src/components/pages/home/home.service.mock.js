import { getAvailableCovers as getAvailableCoversMock } from "@/src/_mocks/cover/available";

export const getAvailableCovers = async () => {
  return getAvailableCoversMock();
};
