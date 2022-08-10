import { testData } from "@/utils/unit-tests/test-data";

import * as CoverOrProductData from "@/src/hooks/useCoverOrProductData";
import * as ValidReportHook from "@/src/hooks/useValidReport";

import * as FetchCoverStatsHook from "@/src/hooks/useFetchCoverStats";
import * as ERC20BalanceHook from "@/src/hooks/useERC20Balance";
import * as CoverStatsContext from "@/common/Cover/CoverStatsContext";
import * as Covers from "@/src/hooks/useCovers";
import * as Diversified from "@/src/hooks/useFlattenedCoverProducts";
import * as UseRegisterTokenHook from "@/src/hooks/useRegisterToken";
import * as PolicyTxs from "@/src/hooks/usePolicyTxs";
import * as Network from "@/src/context/Network";
import * as AppConstants from "@/src/context/AppConstants";
import * as ProtocolDayDataHook from "@/src/hooks/useProtocolDayData";
import * as FetchHeroStats from "@/src/hooks/useFetchHeroStats";
import * as RouterHook from "next/router";
import * as LiquidityFormsContextHook from "@/common/LiquidityForms/LiquidityFormsContext";
import * as CoverActiveReportingsHook from "@/src/hooks/useCoverActiveReportings";
import * as PaginationHook from "@/src/hooks/usePagination";
import * as LiquidityTxsHook from "@/src/hooks/useLiquidityTxs";
import * as ClaimPolicyHook from "@/src/hooks/useClaimPolicyInfo";
import * as CxTokenRowContextHook from "@/modules/my-policies/CxTokenRowContext";
import * as ClaimTableContextHook from "@/modules/my-policies/ClaimCxTokensTable";
import * as PodStakingPoolsHook from "@/src/hooks/usePodStakingPools";
import * as PoolInfoHook from "@/src/hooks/usePoolInfo";
import * as SortableStatsHook from "@/src/context/SortableStatsContext";
import * as ActivePoliciesHook from "@/src/hooks/useActivePolicies";
import * as ToastHook from "@/lib/toast/context";
import * as ResolvedReportingsHook from "@/src/hooks/useResolvedReportings";
import * as SearchResultsHook from "@/src/hooks/useSearchResults";
import * as LiquidityInfoHook from "@/src/hooks/useMyLiquidityInfo";

import * as CalculateLiquidityHook from "@/src/hooks/useCalculateLiquidity";
import * as RemoveLiquidityHook from "@/src/hooks/useRemoveLiquidity";
const Web3React = require("@web3-react/core");

import { render, act, cleanup } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

/**
 *
 * @param {Array | Object | Function} d
 * @returns
 */
const returnFunction = (d) => {
  if (typeof d === "function") return d;
  return () => d;
};

export const mockFn = {
  useCoverOrProductData: (cb = () => testData.coverInfo) =>
    jest
      .spyOn(CoverOrProductData, "useCoverOrProductData")
      .mockImplementation(returnFunction(cb)),
  useFetchCoverStats: (
    cb = () => ({
      ...testData.coverStats,
      refetch: () => Promise.resolve(testData.coverStats),
    })
  ) =>
    jest
      .spyOn(FetchCoverStatsHook, "useFetchCoverStats")
      .mockImplementation(returnFunction(cb)),
  useValidReport: (cb = () => testData.reporting.validReport) =>
    jest
      .spyOn(ValidReportHook, "useValidReport")
      .mockImplementation(returnFunction(cb)),
  useERC20Balance: (
    cb = () => ({
      balance: "1400000000000000000000",
    })
  ) =>
    jest
      .spyOn(ERC20BalanceHook, "useERC20Balance")
      .mockImplementation(returnFunction(cb)),

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
      .mockImplementation(returnFunction(cb)),
  useCovers: (
    cb = () => ({
      data: {
        ...testData.covers,
        getInfoByKey: () => ({
          projectName: "animated-brands",
        }),
      },
      loading: false,
    })
  ) => jest.spyOn(Covers, "useCovers").mockImplementation(returnFunction(cb)),
  useFlattenedCoverProducts: (
    cb = () => ({ data: testData.covers, loading: false })
  ) =>
    jest
      .spyOn(Diversified, "useFlattenedCoverProducts")
      .mockImplementation(returnFunction(cb)),
  useRegisterToken: (cb = () => testData.registerToken) =>
    jest
      .spyOn(UseRegisterTokenHook, "useRegisterToken")
      .mockImplementation(returnFunction(cb)),
  usePolicyTxs: (cb = () => testData.policies) =>
    jest
      .spyOn(PolicyTxs, "usePolicyTxs")
      .mockImplementation(returnFunction(cb)),
  useNetwork: (cb = () => testData.network) =>
    jest.spyOn(Network, "useNetwork").mockImplementation(returnFunction(cb)),
  useWeb3React: (cb = () => testData.account) =>
    jest
      .spyOn(Web3React, "useWeb3React")
      .mockImplementation(returnFunction(cb)),
  useRouter: (cb = () => testData.router) =>
    jest.spyOn(RouterHook, "useRouter").mockImplementation(returnFunction(cb)),
  useAppConstants: (cb = () => testData.appConstants) =>
    jest
      .spyOn(AppConstants, "useAppConstants")
      .mockImplementation(returnFunction(cb)),
  useProtocolDayData: (cb = () => testData.protocolDayData) =>
    jest
      .spyOn(ProtocolDayDataHook, "useProtocolDayData")
      .mockImplementation(returnFunction(cb)),

  useFetchHeroStats: (
    cb = () => ({ data: testData.heroStats, loading: false })
  ) =>
    jest
      .spyOn(FetchHeroStats, "useFetchHeroStats")
      .mockImplementation(returnFunction(cb)),
  useLiquidityFormsContext: (cb = () => testData.liquidityFormsContext) =>
    jest
      .spyOn(LiquidityFormsContextHook, "useLiquidityFormsContext")
      .mockImplementation(returnFunction(cb)),
  useCoverActiveReportings: (cb = () => testData.coverActiveReportings) =>
    jest
      .spyOn(CoverActiveReportingsHook, "useCoverActiveReportings")
      .mockImplementation(returnFunction(cb)),
  usePagination: (cb = () => testData.pagination) =>
    jest
      .spyOn(PaginationHook, "usePagination")
      .mockImplementation(returnFunction(cb)),
  useLiquidityTxs: (cb = () => testData.liquidityTxs) =>
    jest
      .spyOn(LiquidityTxsHook, "useLiquidityTxs")
      .mockImplementation(returnFunction(cb)),
  useClaimPolicyInfo: (cb = () => testData.claimPolicyInfo) =>
    jest
      .spyOn(ClaimPolicyHook, "useClaimPolicyInfo")
      .mockImplementation(returnFunction(cb)),
  useCxTokenRowContext: (cb = () => testData.cxTokenRowContext) =>
    jest
      .spyOn(CxTokenRowContextHook, "useCxTokenRowContext")
      .mockImplementation(returnFunction(cb)),
  useClaimTableContext: (cb = () => testData.claimTableContext) =>
    jest
      .spyOn(ClaimTableContextHook, "useClaimTableContext")
      .mockImplementation(returnFunction(cb)),
  usePodStakingPools: (cb = () => testData.podStakingPools) =>
    jest
      .spyOn(PodStakingPoolsHook, "usePodStakingPools")
      .mockImplementation(returnFunction(cb)),
  usePoolInfo: (cb = () => testData.poolInfo) =>
    jest
      .spyOn(PoolInfoHook, "usePoolInfo")
      .mockImplementation(returnFunction(cb)),
  useSortableStats: (cb = () => testData.sortableStats) =>
    jest
      .spyOn(SortableStatsHook, "useSortableStats")
      .mockImplementation(returnFunction(cb)),
  useActivePolicies: (cb = () => testData.activePolicies) =>
    jest
      .spyOn(ActivePoliciesHook, "useActivePolicies")
      .mockImplementation(returnFunction(cb)),
  chartMockFn: (props) => <div data-testid={props["data-testid"]}></div>,
  useToast: (cb = () => testData.toast) =>
    jest.spyOn(ToastHook, "useToast").mockImplementation(returnFunction(cb)),
  useResolvedReportings: (cb = () => testData.resolvedReportings) =>
    jest
      .spyOn(ResolvedReportingsHook, "useResolvedReportings")
      .mockImplementation(returnFunction(cb)),
  useSearchResults: (cb = () => testData.searchResults) =>
    jest
      .spyOn(SearchResultsHook, "useSearchResults")
      .mockImplementation(returnFunction(cb)),
  useCalculateLiquidity: (cb = () => testData.calculateLiquidity) =>
    jest
      .spyOn(CalculateLiquidityHook, "useCalculateLiquidity")
      .mockImplementation(returnFunction(cb)),
  useRemoveLiquidity: (cb = () => testData.removeLiquidity) =>
    jest
      .spyOn(RemoveLiquidityHook, "useRemoveLiquidity")
      .mockImplementation(returnFunction(cb)),
  useMyLiquidityInfo: (cb = () => testData.liquidityFormsContext) =>
    jest
      .spyOn(LiquidityInfoHook, "useMyLiquidityInfo")
      .mockImplementation(returnFunction(cb)),
};

export const initiateTest = (
  Component,
  props = {},
  initialMocks = () => {},
  options = {}
) => {
  const initialRender = (newProps = {}, newMocks = () => {}) => {
    cleanup();
    initialMocks();
    newMocks();
    act(() => {
      i18n.activate("en");
    });
    render(<Component {...props} {...newProps} />, options);
  };

  const rerenderFn = (newProps = {}, mocks = () => {}) => {
    initialRender(newProps, mocks);
  };

  return {
    initialRender,
    rerenderFn,
  };
};
