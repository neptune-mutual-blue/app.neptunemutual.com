import * as RouterHook from 'next/router'

// import * as CoverStatsContext from '@/common/Cover/CoverStatsContext'
import {
  useLiquidityFormsContext
} from '@/common/LiquidityForms/LiquidityFormsContext'
import useAuth from '@/lib/connect-wallet/hooks/useAuth'
import { useEagerConnect } from '@/lib/connect-wallet/hooks/useEagerConnect'
import { registerToken } from '@/lib/connect-wallet/utils/wallet'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useToast } from '@/lib/toast/context'
import { useClaimTableContext } from '@/modules/my-policies/ClaimCxTokensTable'
import { useCxTokenRowContext } from '@/modules/my-policies/CxTokenRowContext'
import {
  getGraphURL,
  getNetworkId
} from '@/src/config/environment'
import { useAppConstants } from '@/src/context/AppConstants'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
// import {* as Network} from '@/src/context/Network'
import { useSortableStats } from '@/src/context/SortableStatsContext'
import { useTxPoster } from '@/src/context/TxPoster'
import { useUnlimitedApproval } from '@/src/context/UnlimitedApproval'
import { useBondPoolAddress } from '@/src/hooks/contracts/useBondPoolAddress'
import {
  useGovernanceAddress
} from '@/src/hooks/contracts/useGovernanceAddress'
import { usePolicyAddress } from '@/src/hooks/contracts/usePolicyAddress'
import {
  useStakingPoolsAddress
} from '@/src/hooks/contracts/useStakingPoolsAddress'
import { useActivePolicies } from '@/src/hooks/useActivePolicies'
import { useActivePoliciesByCover } from '@/src/hooks/useActivePoliciesByCover'
import { useActiveReportings } from '@/src/hooks/useActiveReportings'
import { useAuthValidation } from '@/src/hooks/useAuthValidation'
import { useBondInfo } from '@/src/hooks/useBondInfo'
import { useBondTxs } from '@/src/hooks/useBondTxs'
import { useCalculateLiquidity } from '@/src/hooks/useCalculateLiquidity'
import { useCalculatePods } from '@/src/hooks/useCalculatePods'
import { useNetwork } from '@/src/context/Network'
import {
  useCalculateTotalLiquidity
} from '@/src/hooks/useCalculateTotalLiquidity'
import { useClaimPolicyInfo } from '@/src/hooks/useClaimPolicyInfo'
import {
  useConsensusReportingInfo
} from '@/src/hooks/useConsensusReportingInfo'
import { useCoverActiveReportings } from '@/src/hooks/useCoverActiveReportings'
// import * as CoverOrProductData from '@/src/hooks/useCoverOrProductData'
// import * as Covers from '@/src/hooks/useCovers'
import { useDebounce } from '@/src/hooks/useDebounce'
import { useDisputeIncident } from '@/src/hooks/useDisputeIncident'
import { useERC20Allowance } from '@/src/hooks/useERC20Allowance'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useExpiredPolicies } from '@/src/hooks/useExpiredPolicies'
import {
  useFetchCoverPurchasedEvent
} from '@/src/hooks/useFetchCoverPurchasedEvent'
// import * as FetchCoverStatsHook from '@/src/hooks/useFetchCoverStats'
import { useFetchHeroStats } from '@/src/hooks/useFetchHeroStats'
import { useFetchReport } from '@/src/hooks/useFetchReport'
import {
  useFetchReportsByKeyAndDate
} from '@/src/hooks/useFetchReportsByKeyAndDate'
// import * as Diversified from '@/src/hooks/useFlattenedCoverProducts'
import { useLiquidityTxs } from '@/src/hooks/useLiquidityTxs'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'
import { useMountedState } from '@/src/hooks/useMountedState'
import { useMyLiquidities } from '@/src/hooks/useMyLiquidities'
import { useMyLiquidityInfo } from '@/src/hooks/useMyLiquidityInfo'
import { usePagination } from '@/src/hooks/usePagination'
import { usePodStakingPools } from '@/src/hooks/usePodStakingPools'
import { usePolicyFees } from '@/src/hooks/usePolicyFees'
import { usePolicyTxs } from '@/src/hooks/usePolicyTxs'
import { usePoolInfo } from '@/src/hooks/usePoolInfo'
import { useProtocolDayData } from '@/src/hooks/useProtocolDayData'
import { useProvideLiquidity } from '@/src/hooks/useProvideLiquidity'
import { usePurchasePolicy } from '@/src/hooks/usePurchasePolicy'
import { useRecentVotes } from '@/src/hooks/useRecentVotes'
import { useRegisterToken } from '@/src/hooks/useRegisterToken'
import { useRemoveLiquidity } from '@/src/hooks/useRemoveLiquidity'
import { useReportIncident } from '@/src/hooks/useReportIncident'
import { useResolvedReportings } from '@/src/hooks/useResolvedReportings'
import { useResolveIncident } from '@/src/hooks/useResolveIncident'
import { useRetryUntilPassed } from '@/src/hooks/useRetryUntilPassed'
import { useSearchResults } from '@/src/hooks/useSearchResults'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { useTokenDecimals } from '@/src/hooks/useTokenDecimals'
import { useTxToast } from '@/src/hooks/useTxToast'
import { useUnstakeReportingStake } from '@/src/hooks/useUnstakeReportingStake'
import { useValidateReferralCode } from '@/src/hooks/useValidateReferralCode'
import { useValidReport } from '@/src/hooks/useValidReport'
import { useVote } from '@/src/hooks/useVote'
// import * as CoverProductsFunction from '@/src/services/covers-products'
// import * as BondInfoFile from '@/src/services/protocol/bond/info'
import { getUnstakeInfoFor } from '@/src/services/protocol/consensus/info'
// import * as VaultInfoFile from '@/src/services/protocol/vault/info'
import { getSubgraphData } from '@/src/services/subgraph'
import * as TransactionHistoryFile
  from '@/src/services/transactions/transaction-history'
import { getReplacedString } from '@/utils/string'
import { testData } from '@/utils/unit-tests/test-data'

const Web3React = require('@web3-react/core')

/**
 *
 * @param {Array | Object | Function} d
 * @returns
 */
const returnFunction = (d) => {
  if (typeof d === 'function') return d
  return jest.fn(() => d)
}

const mockHooksOrMethods = {
  useResolveIncident: (cb = () => testData.resolveIncidentHookValues) =>
    jest
      .spyOn({ useResolveIncident }, 'useResolveIncident')
      .mockImplementation(returnFunction(cb)),

  useActivePoliciesByCover: (
    cb = () => ({
      data: { ...testData.activePoliciesByCover },
      hasMore: false
    })
  ) =>
    jest
      .spyOn({ useActivePoliciesByCover }, 'useActivePoliciesByCover')
      .mockImplementation(returnFunction(cb)),

  useFetchReportsByKeyAndDate: (
    cb = () => ({
      data: testData.reports,
      loading: false
    })
  ) =>
    jest
      .spyOn({ useFetchReportsByKeyAndDate }, 'useFetchReportsByKeyAndDate')
      .mockImplementation(returnFunction(cb)),

  useActiveReportings: (
    cb = () => ({
      data: {
        incidentReports: testData.reporting.activeReporting
      },
      loading: false,
      hasMore: true
    })
  ) =>
    jest
      .spyOn({ useActiveReportings }, 'useActiveReportings')
      .mockImplementation(returnFunction(cb)),

  // useCoverOrProductData: (cb = () => testData.coverInfo) =>
  //   jest
  //     .spyOn(CoverOrProductData, 'useCoverOrProductData')
  //     .mockImplementation(returnFunction(cb)),

  // useFetchCoverStats: (
  //   cb = () => ({
  //     ...testData.coverStats,
  //     refetch: () => Promise.resolve(testData.coverStats)
  //   })
  // ) =>
  //   jest
  //     .spyOn(FetchCoverStatsHook, 'useFetchCoverStats')
  //     .mockImplementation(returnFunction(cb)),

  useValidReport: (cb = () => testData.reporting.validReport) =>
    jest
      .spyOn({ useValidReport }, 'useValidReport')
      .mockImplementation(returnFunction(cb)),

  useERC20Balance: (cb = () => testData.erc20Balance) =>
    jest
      .spyOn({ useERC20Balance }, 'useERC20Balance')
      .mockImplementation(returnFunction(cb)),

  useERC20Allowance: (cb = () => testData.erc20Allowance) =>
    jest
      .spyOn({ useERC20Allowance }, 'useERC20Allowance')
      .mockImplementation(returnFunction(cb)),

  // useCoverStatsContext: (
  //   cb = () => ({
  //     ...testData.coverStats.info,
  //     refetch: () => Promise.resolve(1)
  //   })
  // ) =>
  //   jest
  //     .spyOn(CoverStatsContext, 'useCoverStatsContext')
  //     .mockImplementation(returnFunction(cb)),

  // useCovers: (
  //   cb = () => ({
  //     data: {
  //       ...testData.covers,
  //       getInfoByKey: () => ({
  //         projectName: 'animated-brands'
  //       })
  //     },
  //     loading: false
  //   })
  // ) => jest.spyOn(Covers, 'useCovers').mockImplementation(returnFunction(cb)),

  // useFlattenedCoverProducts: (
  //   cb = () => ({ data: testData.covers, loading: false })
  // ) =>
  //   jest
  //     .spyOn(Diversified, 'useFlattenedCoverProducts')
  //     .mockImplementation(returnFunction(cb)),

  useRegisterToken: (cb = () => testData.registerToken) =>
    jest
      .spyOn({ useRegisterToken }, 'useRegisterToken')
      .mockImplementation(returnFunction(cb)),

  usePolicyTxs: (cb = () => testData.policies) =>
    jest
      .spyOn({ usePolicyTxs }, 'usePolicyTxs')
      .mockImplementation(returnFunction(cb)),

  useNetwork: (cb = () => testData.network) =>
    jest.spyOn({ useNetwork }, 'useNetwork').mockImplementation(returnFunction(cb)),

  useWeb3React: (cb = () => testData.account) =>
    jest
      .spyOn(Web3React, 'useWeb3React')
      .mockImplementation(returnFunction(cb)),

  useEagerConnect: (cb = () => {}) =>
    jest
      .spyOn({ useEagerConnect }, 'useEagerConnect')
      .mockImplementation(returnFunction(cb)),

  getNetworkId: (cb = () => testData.network.networkId) =>
    jest
      .spyOn({ getNetworkId }, 'getNetworkId')
      .mockImplementation(returnFunction(cb)),

  getGraphURL: (networkId = 80001, sendNull = false) =>
    jest
      .spyOn({ getGraphURL }, 'getGraphURL')
      .mockImplementation(() =>
        sendNull
          ? null
          : `https://api.thegraph.com/subgraphs/name/test-org/${networkId}`
      ),

  useRouter: (cb = () => testData.router) =>
    jest.spyOn(RouterHook, 'useRouter').mockImplementation(returnFunction(cb)),

  useAppConstants: (cb = () => testData.appConstants) =>
    jest
      .spyOn({ useAppConstants }, 'useAppConstants')
      .mockImplementation(returnFunction(cb)),

  useProtocolDayData: (cb = () => testData.protocolDayData) =>
    jest
      .spyOn({ useProtocolDayData }, 'useProtocolDayData')
      .mockImplementation(returnFunction(cb)),

  useFetchHeroStats: (
    cb = () => ({ data: testData.heroStats, loading: false })
  ) =>
    jest
      .spyOn({ useFetchHeroStats }, 'useFetchHeroStats')
      .mockImplementation(returnFunction(cb)),

  useLiquidityFormsContext: (cb = () => testData.liquidityFormsContext) =>
    jest
      .spyOn({ useLiquidityFormsContext }, 'useLiquidityFormsContext')
      .mockImplementation(returnFunction(cb)),

  useCoverActiveReportings: (cb = () => testData.coverActiveReportings) =>
    jest
      .spyOn({ useCoverActiveReportings }, 'useCoverActiveReportings')
      .mockImplementation(returnFunction(cb)),

  usePagination: (cb = () => testData.pagination) =>
    jest
      .spyOn({ usePagination }, 'usePagination')
      .mockImplementation(returnFunction(cb)),

  useLiquidityTxs: (cb = () => testData.liquidityTxs) =>
    jest
      .spyOn({ useLiquidityTxs }, 'useLiquidityTxs')
      .mockImplementation(returnFunction(cb)),

  useClaimPolicyInfo: (cb = () => testData.claimPolicyInfo) =>
    jest
      .spyOn({ useClaimPolicyInfo }, 'useClaimPolicyInfo')
      .mockImplementation(returnFunction(cb)),

  useCxTokenRowContext: (cb = () => testData.cxTokenRowContext) =>
    jest
      .spyOn({ useCxTokenRowContext }, 'useCxTokenRowContext')
      .mockImplementation(returnFunction(cb)),

  useClaimTableContext: (cb = () => testData.claimTableContext) =>
    jest
      .spyOn({ useClaimTableContext }, 'useClaimTableContext')
      .mockImplementation(returnFunction(cb)),

  usePodStakingPools: (cb = () => testData.podStakingPools) =>
    jest
      .spyOn({ usePodStakingPools }, 'usePodStakingPools')
      .mockImplementation(returnFunction(cb)),

  usePoolInfo: (cb = () => testData.poolInfo) =>
    jest
      .spyOn({ usePoolInfo }, 'usePoolInfo')
      .mockImplementation(returnFunction(cb)),

  useSortableStats: (cb = () => testData.sortableStats) =>
    jest
      .spyOn({ useSortableStats }, 'useSortableStats')
      .mockImplementation(returnFunction(cb)),

  useActivePolicies: (cb = () => testData.activePolicies) =>
    jest
      .spyOn({ useActivePolicies }, 'useActivePolicies')
      .mockImplementation(returnFunction(cb)),

  useExpiredPolicies: (cb = () => testData.useExpiredPolicies) =>
    jest
      .spyOn({ useExpiredPolicies }, 'useExpiredPolicies')
      .mockImplementation(returnFunction(cb)),

  chartMockFn: (props) => {
    const options = props?.options
    options?.scales?.x?.ticks?.callback?.()
    options?.animation?.onComplete?.({
      chart: {
        ctx: { fillText: jest.fn() },
        getDatasetMeta: () => ({
          data: [
            { x: 1, y: 1 },
            { x: 1, y: 1 }
          ]
        }),
        data: { datasets: [{ data: [1] }] }
      }
    })
    return <div data-testid={props['data-testid']} />
  },

  useToast: (cb = () => testData.toast) =>
    jest.spyOn({ useToast }, 'useToast').mockImplementation(returnFunction(cb)),

  useResolvedReportings: (cb = () => testData.resolvedReportings) =>
    jest
      .spyOn({ useResolvedReportings }, 'useResolvedReportings')
      .mockImplementation(returnFunction(cb)),

  useSearchResults: (cb = () => testData.searchResults) =>
    jest
      .spyOn({ useSearchResults }, 'useSearchResults')
      .mockImplementation(returnFunction(cb)),

  useCalculateLiquidity: (cb = () => testData.calculateLiquidity) =>
    jest
      .spyOn({ useCalculateLiquidity }, 'useCalculateLiquidity')
      .mockImplementation(returnFunction(cb)),

  useRemoveLiquidity: (cb = () => testData.removeLiquidity) =>
    jest
      .spyOn({ useRemoveLiquidity }, 'useRemoveLiquidity')
      .mockImplementation(returnFunction(cb)),

  useMyLiquidityInfo: (cb = () => testData.liquidityFormsContext) =>
    jest
      .spyOn({ useMyLiquidityInfo }, 'useMyLiquidityInfo')
      .mockImplementation(returnFunction(cb)),

  // useValidateReferralCode: (cb = () => true) =>
  //   jest
  //     .spyOn(ValidateReferralCode, "useValidateReferralCode")
  //     .mockImplementation(cb),
  usePolicyFees: (cb = () => testData.policyFees) =>
    jest
      .spyOn({ usePolicyFees }, 'usePolicyFees')
      .mockImplementation(returnFunction(cb)),

  usePurchasePolicy: (cb = () => testData.purchasePolicy) =>
    jest
      .spyOn({ usePurchasePolicy }, 'usePurchasePolicy')
      .mockImplementation(returnFunction(cb)),

  useFetchCoverPurchasedEvent: (cb = () => testData.coverPurchased) =>
    jest
      .spyOn({ useFetchCoverPurchasedEvent }, 'useFetchCoverPurchasedEvent')
      .mockImplementation(returnFunction(cb)),

  useLocalStorage: (cb) =>
    jest
      .spyOn({ useLocalStorage }, 'useLocalStorage')
      .mockImplementation(returnFunction(cb)),

  useAuth: (
    cb = () => ({ login: jest.fn(() => {}), logout: jest.fn(() => {}) })
  ) => jest.spyOn({ useAuth }, 'useAuth').mockImplementation(returnFunction(cb)),

  useReportIncident: (cb = () => testData.reportIncident) =>
    jest
      .spyOn({ useReportIncident }, 'useReportIncident')
      .mockImplementation(returnFunction(cb)),

  useTokenDecimals: (cb = () => testData.tokenDecimals) =>
    jest
      .spyOn({ useTokenDecimals }, 'useTokenDecimals')
      .mockImplementation(returnFunction(cb)),

  useDisputeIncident: (cb = () => testData.disputeIncident) => {
    jest
      .spyOn({ useDisputeIncident }, 'useDisputeIncident')
      .mockImplementation(returnFunction(cb))
  },

  useFetchReport: (cb = () => testData.incidentReports) =>
    jest
      .spyOn({ useFetchReport }, 'useFetchReport')
      .mockImplementation(returnFunction(cb)),

  useConsensusReportingInfo: (cb = () => testData.consensusInfo) =>
    jest
      .spyOn({ useConsensusReportingInfo }, 'useConsensusReportingInfo')
      .mockImplementation(returnFunction(cb)),

  useRecentVotes: (cb = () => testData.recentVotes) =>
    jest
      .spyOn({ useRecentVotes }, 'useRecentVotes')
      .mockImplementation(returnFunction(cb)),

  useUnstakeReportingStake: (cb = () => testData.unstakeReporting) =>
    jest
      .spyOn({ useUnstakeReportingStake }, 'useUnstakeReportingStake')
      .mockImplementation(returnFunction(cb)),

  useRetryUntilPassed: (cb = () => testData.retryUntilPassed) =>
    jest
      .spyOn({ useRetryUntilPassed }, 'useRetryUntilPassed')
      .mockImplementation(returnFunction(cb)),
  // getCoverProductData: (
  //   cb = (networkId, coverKey, productKey) =>
  //     `${networkId}:${coverKey}-${productKey}`
  // ) =>
  //   jest
  //     .spyOn(CoverProductsFunction, 'getCoverProductData')
  //     .mockImplementation(returnFunction(cb)),

  // getCoverData: (cb = (networkId, coverKey) => `${networkId}:${coverKey}`) =>
  //   jest
  //     .spyOn(CoverProductsFunction, 'getCoverData')
  //     .mockImplementation(returnFunction(cb)),

  useDebounce: (value = 123) =>
    jest
      .spyOn({ useDebounce }, 'useDebounce')
      .mockImplementation(returnFunction(value)),

  getReplacedString: (networkId = 80001, account = testData.account.account) =>
    jest
      .spyOn({ getReplacedString }, 'getReplacedString')
      .mockImplementation(
        () =>
          `https://api.npm.finance/protocol/bond/info/${networkId}/${account}`
      ),

  getUnstakeInfoFor: (value = testData.consensusInfo.reportingInfo) =>
    jest
      .spyOn({ getUnstakeInfoFor }, 'getUnstakeInfoFor')
      .mockImplementation(returnFunction(value)),

  useMountedState: (cb = () => false) =>
    jest
      .spyOn({ useMountedState }, 'useMountedState')
      .mockImplementation(returnFunction(cb)),

  useBondPoolAddress: (cb = () => testData.bondPoolAddress) =>
    jest
      .spyOn({ useBondPoolAddress }, 'useBondPoolAddress')
      .mockImplementation(returnFunction(cb)),

  useTxToast: (cb = () => testData.txToast) =>
    jest
      .spyOn({ useTxToast }, 'useTxToast')
      .mockImplementation(returnFunction(cb)),

  useTxPoster: (cb = () => testData.txPoster) =>
    jest
      .spyOn({ useTxPoster }, 'useTxPoster')
      .mockImplementation(returnFunction(cb)),

  useErrorNotifier: (cb = () => testData.errorNotifier) =>
    jest
      .spyOn({ useErrorNotifier }, 'useErrorNotifier')
      .mockImplementation(returnFunction(cb)),

  utilsWeb3: {
    getProviderOrSigner: (cb = () => testData.providerOrSigner) =>
      jest
        .spyOn({ getProviderOrSigner }, 'getProviderOrSigner')
        .mockImplementation(returnFunction(cb))
  },

  useCoversAndProducts: (resolve = true, returnData = {}) =>
    jest
      .spyOn({ useCoversAndProducts2 }, 'useCoversAndProducts2')
      .mockImplementation(() => ({
        getCoverOrProductData: jest.fn(() =>
          resolve
            ? Promise.resolve(returnData)
            : Promise.reject(new Error('Error occurred'))
        )
      })),

  useGovernanceAddress: (cb = () => testData.governanceAddress) =>
    jest
      .spyOn({ useGovernanceAddress }, 'useGovernanceAddress')
      .mockImplementation(returnFunction(cb)),

  useUnlimitedApproval: (cb = () => testData.unlimitedApproval) =>
    jest
      .spyOn({ useUnlimitedApproval }, 'useUnlimitedApproval')
      .mockImplementation(returnFunction(cb)),

  useAuthValidation: (cb = () => testData.authValidation) =>
    jest
      .spyOn({ useAuthValidation }, 'useAuthValidation')
      .mockImplementation(returnFunction(cb)),

  useMyLiquidities: (cb = () => testData.myLiquidities) => {
    jest
      .spyOn({ useMyLiquidities }, 'useMyLiquidities')
      .mockImplementation(returnFunction(cb))
  },

  useCalculateTotalLiquidity: (cb = () => testData.calculateTotalLiquidity) => {
    jest
      .spyOn({ useCalculateTotalLiquidity }, 'useCalculateTotalLiquidity')
      .mockImplementation(returnFunction(cb))
  },

  useVote: (cb = () => testData.castYourVote) =>
    jest.spyOn({ useVote }, 'useVote').mockImplementation(returnFunction(cb)),

  useBondInfo: (cb = () => testData.bondInfo) => {
    jest
      .spyOn({ useBondInfo }, 'useBondInfo')
      .mockImplementation(returnFunction(cb))
  },

  useBondTxs: (cb = () => testData.bondTxs) =>
    jest
      .spyOn({ useBondTxs }, 'useBondTxs')
      .mockImplementation(returnFunction(cb)),

  // getInfo: (cb = () => testData.myLiquidityInfo) =>
  //   jest.spyOn(VaultInfoFile, 'getInfo').mockImplementation(returnFunction(cb)),

  // getBondInfo: (cb = () => testData.bondInfo.info) =>
  //   jest.spyOn(BondInfoFile, 'getInfo').mockImplementation(returnFunction(cb)),

  registerToken: (success = true) =>
    jest
      .spyOn({ registerToken }, 'registerToken')
      .mockImplementation(() =>
        success
          ? Promise.resolve('registerToken success')
          : Promise.reject(new Error('registerToken error'))
      ),

  getSubgraphData: (cb = () => testData.defaultSubgraphData) =>
    jest
      .spyOn({ getSubgraphData }, 'getSubgraphData')
      .mockImplementation(returnFunction(cb)),

  useStakingPoolsAddress: (cb = () => testData.stakingPoolsAddress) =>
    jest
      .spyOn({ useStakingPoolsAddress }, 'useStakingPoolsAddress')
      .mockImplementation(returnFunction(cb)),

  useSubgraphFetch: (cb) =>
    jest.spyOn({ useSubgraphFetch }, 'useSubgraphFetch').mockReturnValue(cb),

  TransactionHistory: {
    callback: (mockCallbackFunction = true) => {
      const originalFunction =
        TransactionHistoryFile.TransactionHistory.callback

      if (mockCallbackFunction) {
        const mockFunction = jest.fn(
          (provider, { success = () => {}, failure = () => {} }) => {
            const arg = { hash: 1, methodName: 'success', data: {} }
            success(arg)
            failure(arg)
          }
        )
        TransactionHistoryFile.TransactionHistory.callback = mockFunction
        return null
      }
      TransactionHistoryFile.TransactionHistory.callback = originalFunction
    }
  },

  usePolicyAddress: (cb = () => testData.policyContractAddress) =>
    jest
      .spyOn({ usePolicyAddress }, 'usePolicyAddress')
      .mockImplementation(returnFunction(cb)),

  useValidateReferralCode: (cb = () => testData.referralCodeHook) =>
    jest
      .spyOn({ useValidateReferralCode }, 'useValidateReferralCode')
      .mockImplementation(returnFunction(cb)),

  useCalculatePods: (cb = () => testData.calculatePods) =>
    jest
      .spyOn({ useCalculatePods }, 'useCalculatePods')
      .mockImplementation(returnFunction(cb)),

  useProvideLiquidity: (cb = () => testData.provideLiquidity) =>
    jest
      .spyOn({ useProvideLiquidity }, 'useProvideLiquidity')
      .mockImplementation(returnFunction(cb))
}

export { mockHooksOrMethods }
