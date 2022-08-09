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
const Web3React = require("@web3-react/core");

import { render, act, cleanup } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

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
  ) => jest.spyOn(Covers, "useCovers").mockImplementation(cb),
  useFlattenedCoverProducts: (
    cb = () => ({ data: testData.covers, loading: false })
  ) =>
    jest.spyOn(Diversified, "useFlattenedCoverProducts").mockImplementation(cb),
  useRegisterToken: (cb = () => testData.registerToken) =>
    jest.spyOn(UseRegisterTokenHook, "useRegisterToken").mockImplementation(cb),
  usePolicyTxs: (cb = () => testData.policies) =>
    jest.spyOn(PolicyTxs, "usePolicyTxs").mockImplementation(cb),
  useNetwork: (cb = () => testData.network) =>
    jest.spyOn(Network, "useNetwork").mockImplementation(cb),
  useWeb3React: (cb = () => testData.account) =>
    jest.spyOn(Web3React, "useWeb3React").mockImplementation(cb),
  useRouter: (cb = () => testData.router) =>
    jest.spyOn(RouterHook, "useRouter").mockImplementation(cb),
  useAppConstants: (cb = () => testData.appConstants) =>
    jest.spyOn(AppConstants, "useAppConstants").mockImplementation(cb),
  useProtocolDayData: (cb = () => testData.protocolDayData) =>
    jest
      .spyOn(ProtocolDayDataHook, "useProtocolDayData")
      .mockImplementation(cb),

  useFetchHeroStats: (
    cb = () => ({ data: testData.heroStats, loading: false })
  ) => jest.spyOn(FetchHeroStats, "useFetchHeroStats").mockImplementation(cb),
  useLiquidityFormsContext: (cb = () => testData.liquidityFormsContext) =>
    jest
      .spyOn(LiquidityFormsContextHook, "useLiquidityFormsContext")
      .mockImplementation(cb),
  useCoverActiveReportings: (cb = () => testData.coverActiveReportings) =>
    jest
      .spyOn(CoverActiveReportingsHook, "useCoverActiveReportings")
      .mockImplementation(cb),
  usePagination: (cb = () => testData.pagination) =>
    jest.spyOn(PaginationHook, "usePagination").mockImplementation(cb),
  useLiquidityTxs: (cb = () => testData.liquidityTxs) =>
    jest.spyOn(LiquidityTxsHook, "useLiquidityTxs").mockImplementation(cb),
  useClaimPolicyInfo: (cb = () => testData.claimPolicyInfo) =>
    jest.spyOn(ClaimPolicyHook, "useClaimPolicyInfo").mockImplementation(cb),
  useCxTokenRowContext: (cb = () => testData.cxTokenRowContext) =>
    jest
      .spyOn(CxTokenRowContextHook, "useCxTokenRowContext")
      .mockImplementation(cb),
  useClaimTableContext: (cb = () => testData.claimTableContext) =>
    jest
      .spyOn(ClaimTableContextHook, "useClaimTableContext")
      .mockImplementation(cb),
  usePodStakingPools: (cb = () => testData.podStakingPools) =>
    jest
      .spyOn(PodStakingPoolsHook, "usePodStakingPools")
      .mockImplementation(cb),
  usePoolInfo: (cb = () => testData.poolInfo) =>
    jest.spyOn(PoolInfoHook, "usePoolInfo").mockImplementation(cb),
  useSortableStats: (cb = () => testData.sortableStats) =>
    jest.spyOn(SortableStatsHook, "useSortableStats").mockImplementation(cb),
  useActivePolicies: (cb = () => testData.activePolicies) =>
    jest.spyOn(ActivePoliciesHook, "useActivePolicies").mockImplementation(cb),
  chartMockFn: (props) => <div data-testid={props["data-testid"]}></div>,
  useToast: (cb = () => testData.toast) =>
    jest.spyOn(ToastHook, "useToast").mockImplementation(cb),
};

export const initiateTest = (
  Component,
  props = {},
  initialMocks = () => {},
  options = {}
) => {
  const initialRender = (newProps = {}, rerender = false) => {
    cleanup();
    if (!rerender) initialMocks();
    act(() => {
      i18n.activate("en");
    });
    render(<Component {...props} {...newProps} />, options);
  };

  const rerenderFn = (newProps = {}, mocks = () => {}) => {
    mocks();
    initialRender(newProps, true);
  };

  return {
    initialRender,
    rerenderFn,
  };
};
