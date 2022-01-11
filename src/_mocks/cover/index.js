import { getAvailableCovers } from "@/src/_mocks/cover/available";

export const coverList = [];

export const getCoverInfo = (key) => {
  const covers = getAvailableCovers();
  const info = covers.find((x) => x.key === key);

  return info || covers[0];
};
