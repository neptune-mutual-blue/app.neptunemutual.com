import { parseBytes32String } from "@ethersproject/strings";

export const getCoverImgSrc = ({ key } = { key: "" }) => {
  try {
    return `/images/covers/${parseBytes32String(key)}.svg`;
  } catch (error) {
    return `/images/covers/empty.svg`;
  }
};
