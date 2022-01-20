import { parseBytes32String } from "@ethersproject/strings";

export const getCoverImgSrc = (coverInfo) => {
  return `/images/covers/${parseBytes32String(coverInfo?.key)}.png`;
};
