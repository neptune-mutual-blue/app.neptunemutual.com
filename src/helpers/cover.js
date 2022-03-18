import { sumOf, toBN } from "@/utils/bn";
import {
  parseBytes32String,
  formatBytes32String,
} from "@ethersproject/strings";

export const defaultStats = {
  liquidity: "0",
  protection: "0",
  utilization: "0",
};

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

export const calculateCoverStats = (cover) => {
  try {
    const liquidity = sumOf(
      ...cover.vaults.map((x) => {
        return toBN(x.totalCoverLiquidityAdded)
          .minus(x.totalCoverLiquidityRemoved)
          .plus(x.totalFlashLoanFees);
      })
    ).toString();

    const protection = sumOf(
      ...cover.cxTokens.map((x) => x.totalCoveredAmount)
    ).toString();

    const utilization = toBN(protection)
      .dividedBy(liquidity)
      .decimalPlaces(2)
      .toString();

    return {
      liquidity,
      protection,
      utilization: utilization == "NaN" ? "0" : utilization,
    };
  } catch (err) {
    console.error(err);
  }

  return defaultStats;
};
