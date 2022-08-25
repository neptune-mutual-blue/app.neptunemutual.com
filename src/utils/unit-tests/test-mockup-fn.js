import { testData } from "@/utils/unit-tests/test-data";

import * as ActiveReportings from "@/src/hooks/useActiveReportings";
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
// import * as ValidateReferralCode from "@/src/hooks/useValidateReferralCode";
import * as PolicyFees from "@/src/hooks/usePolicyFees";
import * as PurchasePolicy from "@/src/hooks/usePurchasePolicy";

import * as CalculateLiquidityHook from "@/src/hooks/useCalculateLiquidity";
import * as RemoveLiquidityHook from "@/src/hooks/useRemoveLiquidity";
import * as LocalStorageHook from "@/src/hooks/useLocalStorage";
import * as useAuth from "@/lib/connect-wallet/hooks/useAuth.jsx";
import * as FetchReportHook from "@/src/hooks/useFetchReport";
import * as ConfigEnvironmentFile from "@/src/config/environment";
import * as CoverProductsFunction from "@/src/services/covers-products";
import * as DebounceHook from "@/src/hooks/useDebounce";
import * as BondPoolAddressHook from "@/src/hooks/contracts/useBondPoolAddress";
import * as TxToastHook from "@/src/hooks/useTxToast";
import * as TxPosterHook from "@/src/context/TxPoster";
import * as ErrorNotifierHook from "@/src/hooks/useErrorNotifier";
import * as ERC20AllowanceHook from "@/src/hooks/useERC20Allowance";
import * as UtilsWeb3 from "@/lib/connect-wallet/utils/web3";
import * as NeptuneMutualSDK from "@neptunemutual/sdk";
import * as CoversAndProductsHook from "@/src/context/CoversAndProductsData";
import * as GovernanceAddressHook from "@/src/hooks/contracts/useGovernanceAddress";
import * as UnlimitedApprovalHook from "@/src/context/UnlimitedApproval";
import * as AuthValidationHook from "@/src/hooks/useAuthValidation";

import * as PurchasedEventHook from "@/src/hooks/useFetchCoverPurchasedEvent";
import * as EagerConnect from "@/lib/connect-wallet/hooks/useEagerConnect";

import * as ReportIncident from "@/src/hooks/useReportIncident";
import * as DisputeIncident from "@/src/hooks/useDisputeIncident";
import * as TokenDecimals from "@/src/hooks/useTokenDecimals";
import * as MyLiqudities from "@/src/hooks/useMyLiquidities";
import * as CalculateTotalLiquidity from "@/src/hooks/useCalculateTotalLiquidity";
import * as FetchReport from "@/src/hooks/useFetchReport";

import * as ConsensusReportingInfoHook from "@/src/hooks/useConsensusReportingInfo";
import * as RecentVotesHook from "@/src/hooks/useRecentVotes";
import * as UnstakeReportingStakeHook from "@/src/hooks/useUnstakeReportingStake";
import * as RetryUntilPassedHook from "@/src/hooks/useRetryUntilPassed";
import * as UseVoteHook from "@/src/hooks/useVote";

const Web3React = require("@web3-react/core");

import { render, act, cleanup } from "@/utils/unit-tests/test-utils";
import { act as hooksAct, renderHook } from "@testing-library/react-hooks";
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
  useActiveReportings: (
    cb = () => ({
      data: {
        incidentReports: testData.reporting.activeReporting,
      },
      loading: false,
      hasMore: true,
    })
  ) =>
    jest
      .spyOn(ActiveReportings, "useActiveReportings")
      .mockImplementation(returnFunction(cb)),

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

  useERC20Balance: (cb = () => testData.erc20Balance) =>
    jest
      .spyOn(ERC20BalanceHook, "useERC20Balance")
      .mockImplementation(returnFunction(cb)),

  useERC20Allowance: (cb = () => testData.erc20Allowance) =>
    jest
      .spyOn(ERC20AllowanceHook, "useERC20Allowance")
      .mockImplementation(returnFunction(cb)),

  useCoverStatsContext: (
    cb = () => ({
      ...testData.coverStats.info,
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

  useEagerConnect: (cb = () => {}) =>
    jest
      .spyOn(EagerConnect, "useEagerConnect")
      .mockImplementation(returnFunction(cb)),

  getNetworkId: (cb = () => testData.network.networkId) =>
    jest
      .spyOn(ConfigEnvironmentFile, "getNetworkId")
      .mockImplementation(returnFunction(cb)),

  getGraphURL: (networkId = 80001) =>
    jest
      .spyOn(ConfigEnvironmentFile, "getGraphURL")
      .mockImplementation(
        () => `https://api.thegraph.com/subgraphs/name/test-org/${networkId}`
      ),

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
  // useValidateReferralCode: (cb = () => true) =>
  //   jest
  //     .spyOn(ValidateReferralCode, "useValidateReferralCode")
  //     .mockImplementation(cb),
  usePolicyFees: (cb = () => testData.policyFees) =>
    jest
      .spyOn(PolicyFees, "usePolicyFees")
      .mockImplementation(returnFunction(cb)),

  usePurchasePolicy: (cb = () => testData.purchasePolicy) =>
    jest
      .spyOn(PurchasePolicy, "usePurchasePolicy")
      .mockImplementation(returnFunction(cb)),

  useFetchCoverPurchasedEvent: (cb = () => testData.coverPurchased) =>
    jest
      .spyOn(PurchasedEventHook, "useFetchCoverPurchasedEvent")
      .mockImplementation(returnFunction(cb)),
  useLocalStorage: (cb) =>
    jest
      .spyOn(LocalStorageHook, "useLocalStorage")
      .mockImplementation(returnFunction(cb)),

  useAuth: (
    cb = () => ({ login: jest.fn(() => {}), logout: jest.fn(() => {}) })
  ) => jest.spyOn(useAuth, "default").mockImplementation(returnFunction(cb)),

  consoleError: () => {
    const mockConsoleError = jest.fn();

    return {
      mock: () => {
        Object.defineProperty(global.console, "error", {
          value: mockConsoleError,
        });
      },
      restore: () => {
        Object.defineProperty(global.console, "error", {
          value: console.error,
        });
      },
      mockFunction: mockConsoleError,
    };
  },

  useReportIncident: (cb = () => testData.reportIncident) =>
    jest
      .spyOn(ReportIncident, "useReportIncident")
      .mockImplementation(returnFunction(cb)),

  useTokenDecimals: (cb = () => testData.tokenDecimals) =>
    jest
      .spyOn(TokenDecimals, "useTokenDecimals")
      .mockImplementation(returnFunction(cb)),

  useDisputeIncident: (cb = () => testData.disputeIncident) => {
    jest
      .spyOn(DisputeIncident, "useDisputeIncident")
      .mockImplementation(returnFunction(cb));
  },

  useFetchReport: (cb = () => testData.incidentReports) =>
    jest
      .spyOn(FetchReportHook, "useFetchReport")
      .mockImplementation(returnFunction(cb)),

  useConsensusReportingInfo: (cb = () => testData.consensusInfo) =>
    jest
      .spyOn(ConsensusReportingInfoHook, "useConsensusReportingInfo")
      .mockImplementation(returnFunction(cb)),

  useRecentVotes: (cb = () => testData.recentVotes) =>
    jest
      .spyOn(RecentVotesHook, "useRecentVotes")
      .mockImplementation(returnFunction(cb)),
  useUnstakeReportingStake: (cb = () => testData.unstakeReporting) =>
    jest
      .spyOn(UnstakeReportingStakeHook, "useUnstakeReportingStake")
      .mockImplementation(returnFunction(cb)),
  useRetryUntilPassed: (cb = () => testData.retryUntilPassed) =>
    jest
      .spyOn(RetryUntilPassedHook, "useRetryUntilPassed")
      .mockImplementation(returnFunction(cb)),
  getCoverProductData: (
    cb = (networkId, coverKey, productKey) =>
      `${networkId}:${coverKey}-${productKey}`
  ) =>
    jest
      .spyOn(CoverProductsFunction, "getCoverProductData")
      .mockImplementation(returnFunction(cb)),

  getCoverData: (cb = (networkId, coverKey) => `${networkId}:${coverKey}`) =>
    jest
      .spyOn(CoverProductsFunction, "getCoverData")
      .mockImplementation(returnFunction(cb)),

  fetch: (
    resolve = true,
    fetchResponse = testData.fetch,
    fetchJsonData = {}
  ) => {
    global.fetch = jest.fn(() =>
      resolve
        ? Promise.resolve({
            ...fetchResponse,
            json: () => Promise.resolve(fetchJsonData),
          })
        : Promise.reject("Error occured")
    );
    return {
      unmock: () => {
        if (global.fetch?.mockClear) {
          global.fetch?.mockClear?.();
          delete global.fetch;
        }
      },
    };
  },

  useDebounce: (value = 123) =>
    jest
      .spyOn(DebounceHook, "useDebounce")
      .mockImplementation(returnFunction(value)),

  useBondPoolAddress: (cb = () => testData.bondPoolAddress) =>
    jest
      .spyOn(BondPoolAddressHook, "useBondPoolAddress")
      .mockImplementation(returnFunction(cb)),

  useTxToast: (cb = () => testData.txToast) =>
    jest
      .spyOn(TxToastHook, "useTxToast")
      .mockImplementation(returnFunction(cb)),

  useTxPoster: (cb = () => testData.txPoster) =>
    jest
      .spyOn(TxPosterHook, "useTxPoster")
      .mockImplementation(returnFunction(cb)),

  useErrorNotifier: (cb = () => testData.errorNotifier) =>
    jest
      .spyOn(ErrorNotifierHook, "useErrorNotifier")
      .mockImplementation(returnFunction(cb)),

  utilsWeb3: {
    getProviderOrSigner: (cb = () => testData.providerOrSigner) =>
      jest
        .spyOn(UtilsWeb3, "getProviderOrSigner")
        .mockImplementation(returnFunction(cb)),
  },

  sdk: {
    registry: {
      BondPool: {
        getInstance: () => {
          NeptuneMutualSDK.registry.BondPool.getInstance = jest.fn(() =>
            Promise.resolve("geInstance() mock")
          );
        },
      },
      Governance: {
        getInstance: () => {
          NeptuneMutualSDK.registry.Governance.getInstance = jest.fn(() =>
            Promise.resolve("geInstance() mock")
          );
        },
      },
      IERC20: {
        getInstance: (returnUndefined = false) => {
          NeptuneMutualSDK.registry.IERC20.getInstance = jest.fn(() =>
            returnUndefined ? undefined : "IERC20 geInstance() mock"
          );
        },
      },
    },
    utils: {
      ipfs: {
        write: (returnUndefined = false) => {
          NeptuneMutualSDK.utils.ipfs.write = jest.fn((payload) =>
            Promise.resolve(returnUndefined ? undefined : [payload.toString()])
          );
        },
      },
    },
  },

  setTimeout: () => (global.setTimeout = jest.fn((cb) => cb())),

  useCoversAndProducts: (resolve = true, returnData = {}) =>
    jest
      .spyOn(CoversAndProductsHook, "useCoversAndProducts")
      .mockImplementation(() => ({
        getCoverOrProductData: jest.fn(() =>
          resolve
            ? Promise.resolve(returnData)
            : Promise.reject("Error occured")
        ),
      })),

  useGovernanceAddress: (cb = () => testData.governanceAddress) =>
    jest
      .spyOn(GovernanceAddressHook, "useGovernanceAddress")
      .mockImplementation(returnFunction(cb)),

  useUnlimitedApproval: (cb = () => testData.unlimitedApproval) =>
    jest
      .spyOn(UnlimitedApprovalHook, "useUnlimitedApproval")
      .mockImplementation(returnFunction(cb)),

  useAuthValidation: (cb = () => testData.authValidation) =>
    jest
      .spyOn(AuthValidationHook, "useAuthValidation")
      .mockImplementation(returnFunction(cb)),
  useMyLiquidities: (cb = () => testData.myLiquidities) => {
    jest
      .spyOn(MyLiqudities, "useMyLiquidities")
      .mockImplementation(returnFunction(cb));
  },
  useCalculateTotalLiquidity: (cb = () => testData.calculateTotalLiquidity) => {
    jest
      .spyOn(CalculateTotalLiquidity, "useCalculateTotalLiquidity")
      .mockImplementation(returnFunction(cb));
  },
  useFetchReport: (cb = () => testData.fetchReport) => {
    jest
      .spyOn(FetchReport, "useFetchReport")
      .mockImplementation(returnFunction(cb));
  },
  useVote: (cb = () => testData.castYourVote) =>
    jest.spyOn(UseVoteHook, "useVote").mockImplementation(returnFunction(cb)),
};

export const globalFn = {
  ethereum: () => {
    const ETHEREUM_METHODS = {
      eth_requestAccounts: () => [testData.account.account],
    };

    global.ethereum = {
      enable: jest.fn(() => Promise.resolve(true)),
      send: jest.fn((method) => {
        if (method === "eth_chainId") {
          return Promise.resolve(1);
        }

        if (method === "eth_requestAccounts") {
          return Promise.resolve(testData.account.account);
        }

        return Promise.resolve(true);
      }),
      request: jest.fn(async ({ method }) => {
        if (ETHEREUM_METHODS.hasOwnProperty(method)) {
          return ETHEREUM_METHODS[method];
        }

        return "";
      }),
      on: jest.fn(() => {}),
    };
  },
  crypto: () => {
    //@ts-ignore
    global.crypto = {
      getRandomValues: jest.fn().mockReturnValueOnce(new Uint32Array(10)),
    };
  },
  scrollTo: () => {
    global.scrollTo = jest.fn(() => {});
  },
  console: {
    log: () => (console.log = jest.fn(() => {})),
    dir: () => (console.dir = jest.fn(() => {})),
    error: () => (console.error = jest.fn(() => {})),
  },
  resizeObserver: () => {
    global.ResizeObserver = class ResizeObserver {
      constructor(cb) {
        this.cb = cb;
      }
      observe() {
        this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
      }
      unobserve() {}
    };
  },
  DOMRect: () => {
    global.DOMRect = {
      fromRect: () => ({
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
      }),
    };
  },
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
    return render(<Component {...props} {...newProps} />, options);
  };

  const rerenderFn = (newProps = {}, mocks = () => {}) => {
    return initialRender(newProps, mocks);
  };

  return {
    initialRender,
    rerenderFn,
  };
};

/**
 * @typedef renderHookWrapperReturn
 * @property {Object} result
 * @property {Function} act
 * @property {Function} rerender
 * @property {Function} unmount
 * @property {Function} [waitForNextUpdate]
 * @property {Function} [waitForValueToChange]
 */

/**
 *
 * @param {Function} hookFunction
 * @param {any[]} [hookArgs]
 * @param {boolean | number} [waitForNextUpdate]
 * @param {Object} [renderHookOptions]
 * @returns {Promise<renderHookWrapperReturn>}
 *
 */
export const renderHookWrapper = async (
  hookFunction,
  hookArgs = [],
  waitForNextUpdate = false,
  renderHookOptions = {}
) => {
  let res = {},
    rr = () => {},
    u = () => {},
    wfnu = () => {},
    wfvc = () => {};

  await hooksAct(async () => {
    const {
      result,
      waitForNextUpdate: WFNU,
      rerender,
      unmount,
      waitForValueToChange,
    } = renderHook((args) => hookFunction(...args), {
      initialProps: hookArgs,
      ...renderHookOptions,
    });

    if (typeof waitForNextUpdate === "boolean" && waitForNextUpdate)
      await WFNU();
    else if (typeof waitForNextUpdate === "number")
      await WFNU({ timeout: waitForNextUpdate });

    res = result.current;
    rr = rerender;
    u = unmount;
    wfnu = WFNU;
    wfvc = waitForValueToChange;
  });
  return {
    result: res,
    act: hooksAct,
    rerender: rr,
    unmount: u,
    waitForNextUpdate: wfnu,
    waitForValueToChange: wfvc,
  };
};
