import { parseBytes32String } from "@ethersproject/strings";

export const getTokenImgSrc = (key) => {
  try {
    return `/images/tokens/${parseBytes32String(key)}.png`;
  } catch (error) {
    return `/images/tokens/OKB.png`;
  }
};
