import { utils } from "@neptunemutual/sdk";
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

export const isValidProduct = (productKey) => {
  return (
    productKey &&
    productKey !== utils.keyUtil.toBytes32("") &&
    productKey !== "0x00000000"
  );
};

export const getParsedCoverInfo = (ipfsStr = "") => {
  try {
    const obj = JSON.parse(ipfsStr);

    return {
      coverName: obj.coverName,
      projectName: obj.projectName,
      leverage: obj.leverage,
      tags: obj.tags,
      about: obj.about,
      blockchains: obj.blockchains,
      rules: obj.rules,
      exclusions: obj.exclusions,
      links: obj.links,
      pricingFloor: obj.pricingFloor,
      pricingCeiling: obj.pricingCeiling,
      resolutionSources: obj.resolutionSources,
    };
  } catch (error) {}

  return {
    coverName: "---",
    projectName: "---",
    leverage: "0",
    tags: [],
    blockchains: [],
    about: "---",
    rules: "---",
    exclusions: "---",
    links: {},
    pricingFloor: "0",
    pricingCeiling: "0",
    resolutionSources: [],
  };
};

export const getParsedProductInfo = (ipfsStr = "") => {
  try {
    const obj = JSON.parse(ipfsStr);

    return {
      productName: obj.productName,
      tags: obj.tags,
      about: obj.about,
      rules: obj.rules,
      exclusions: obj.exclusions,
      links: obj.links,
      resolutionSources: obj.resolutionSources,
    };
  } catch (error) {}

  return {
    productName: "---",
    tags: [],
    about: "---",
    rules: "---",
    exclusions: "---",
    links: {},
    resolutionSources: [],
  };
};
