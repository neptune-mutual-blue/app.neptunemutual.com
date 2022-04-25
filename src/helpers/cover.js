import {
  parseBytes32String,
  formatBytes32String,
} from "@ethersproject/strings";

export const getCoverImgSrc = (coverInfo) => {
  try {
    return `/images/covers/${parseBytes32String(coverInfo?.key)}.svg`;
  } catch (error) {
    return `/images/covers/empty.svg`;
  }
};

export const getParsedKey = (bytes32String) => {
  try {
    return parseBytes32String(bytes32String);
  } catch (error) {
    return bytes32String;
  }
};

export const toBytes32 = (str) => {
  try {
    return formatBytes32String(str);
  } catch (error) {
    return str;
  }
};
