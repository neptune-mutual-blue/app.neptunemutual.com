import { parseBytes32String } from "@ethersproject/strings";

export const getCoverImgSrc = (coverInfo) => {
  try {
    return `/images/covers/${parseBytes32String(coverInfo?.key)}.png`;
  } catch (error) {
    return `/images/covers/clearpool.png`;
  }
};
