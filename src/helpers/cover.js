import DateLib from "@/lib/date/DateLib";
import { isGreater, sumOf, toBN } from "@/utils/bn";
import {
  parseBytes32String,
  formatBytes32String,
} from "@ethersproject/strings";

export const defaultStats = {
  liquidity: "0",
  protection: "0",
  utilization: "0",
  status: "",
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

export const getCoverStatus = (incidentReports, stopped) => {
  if (stopped) {
    return "Stopped";
  }

  if (incidentReports.length === 0) {
    return "Normal";
  }

  if (incidentReports[0].resolved === false) {
    const isAttestedWon = isGreater(
      incidentReports[0].totalAttestedStake,
      incidentReports[0].totalRefutedStake
    );

    return isAttestedWon ? "Incident Happened" : "False Reporting";
  }

  const now = DateLib.unix();
  const isClaimableNow =
    incidentReports[0].decision &&
    isGreater(incidentReports[0].claimExpiresAt, now) &&
    isGreater(now, incidentReports[0].claimBeginsFrom);

  if (isClaimableNow) {
    return "Claimable";
  }

  return incidentReports[0].decision ? "Incident Happened" : "False Reporting";
};

export const calculateCoverStats = (cover) => {
  try {
    const status = getCoverStatus(cover.incidentReports, cover.stopped);

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
      status,
      liquidity,
      protection,
      utilization: utilization == "NaN" ? "0" : utilization,
    };
  } catch (err) {
    console.error(err);
  }

  return defaultStats;
};
