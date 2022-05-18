import { parseBytes32String } from "@ethersproject/strings";

/**
 * 
 * @param {Object} [coverData]
 * @param {string} coverData.key
 * @returns 
 */
export const getCoverImgSrc = ({ key } = { key: "" }) => {
  try {
    return `/images/covers/${parseBytes32String(key)}.svg`;
  } catch (error) {
    return `/images/covers/empty.svg`;
  }
};
