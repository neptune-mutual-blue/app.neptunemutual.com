import { testData } from "@/utils/unit-tests/test-data";

import * as CoverOrProductData from "@/src/hooks/useCoverOrProductData";
import * as ValidReportHook from "@/src/hooks/useValidReport";

import * as FetchCoverStatsHook from "@/src/hooks/useFetchCoverStats";
import * as ERC20BalanceHook from "@/src/hooks/useERC20Balance";
import * as CoverStatsContext from "@/common/Cover/CoverStatsContext";
import * as Covers from "@/src/hooks/useCovers";
import * as Diversified from "@/src/hooks/useFlattenedCoverProducts";

export const mockFn = {
  useCoverOrProductData: (cb = () => testData.coverInfo) =>
    jest
      .spyOn(CoverOrProductData, "useCoverOrProductData")
      .mockImplementation(cb),
  useFetchCoverStats: (cb = () => testData.coverStats) =>
    jest
      .spyOn(FetchCoverStatsHook, "useFetchCoverStats")
      .mockImplementation(cb),
  useValidReport: (cb = () => testData.reporting.validReport) =>
    jest.spyOn(ValidReportHook, "useValidReport").mockImplementation(cb),
  useERC20Balance: (
    cb = () => ({
      balance: "1400000000000000000000",
    })
  ) => jest.spyOn(ERC20BalanceHook, "useERC20Balance").mockImplementation(cb),

  useCoverStatsContext: (
    cb = () => ({
      productStatus: "active",
      activeIncidentDate: "12232323",
      claimPlatformFee: "0",
      commitment: "0",
      isUserWhitelisted: false,
      reporterCommission: "0",
      reportingPeriod: "0",
      requiresWhitelist: false,
      activeCommitment: "0",
      totalPoolAmount: "0",
      availableLiquidity: "0",
      refetch: () => Promise.resolve(1),
    })
  ) =>
    jest
      .spyOn(CoverStatsContext, "useCoverStatsContext")
      .mockImplementation(cb),
  useCovers: (cb = () => ({ data: testData.covers, loading: false })) =>
    jest.spyOn(Covers, "useCovers").mockImplementation(cb),
  useFlattenedCoverProducts: (
    cb = () => ({ data: testData.covers, loading: false })
  ) =>
    jest.spyOn(Diversified, "useFlattenedCoverProducts").mockImplementation(cb),
};
