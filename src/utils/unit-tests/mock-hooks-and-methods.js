import * as RouterHook from 'next/router'

import * as LiquidityFormsContext
  from '@/common/LiquidityForms/LiquidityFormsContext'
import * as AuthHook from '@/lib/connect-wallet/hooks/useAuth'
import * as EagerConnectHook from '@/lib/connect-wallet/hooks/useEagerConnect'
import * as WalletUtils from '@/lib/connect-wallet/utils/wallet'
import * as Web3Utils from '@/lib/connect-wallet/utils/web3'
import * as ToastHook from '@/lib/toast/context'
import * as ClaimTableContextHook
  from '@/modules/my-policies/ClaimCxTokensTable'
import * as CxTokenRowContextHook from '@/modules/my-policies/CxTokenRowContext'
import * as ConfigEnvironment from '@/src/config/environment'
import * as AppConstantsHook from '@/src/context/AppConstants'
import * as CoversAndProducts2Hook from '@/src/context/CoversAndProductsData2'
import * as NetworkHook from '@/src/context/Network'
import * as SortableStatsHook from '@/src/context/SortableStatsContext'
import * as TxPosterHook from '@/src/context/TxPoster'
import * as UnlimitedApprovalHook from '@/src/context/UnlimitedApproval'
import * as BondPoolAddressHook from '@/src/hooks/contracts/useBondPoolAddress'
import * as GovernanceAddressHook
  from '@/src/hooks/contracts/useGovernanceAddress'
import * as PolicyAddressHook from '@/src/hooks/contracts/usePolicyAddress'
import * as StakingPoolsAddressHook
  from '@/src/hooks/contracts/useStakingPoolsAddress'
import * as ActivePoliciesHook from '@/src/hooks/useActivePolicies'
import * as ActivePoliciesByCoverHook
  from '@/src/hooks/useActivePoliciesByCover'
import * as ActiveReportingsHook from '@/src/hooks/useActiveReportings'
import * as AuthValidationHook from '@/src/hooks/useAuthValidation'
import * as BondInfoHook from '@/src/hooks/useBondInfo'
import * as BondTxsHook from '@/src/hooks/useBondTxs'
import * as CalculateLiquidityHook from '@/src/hooks/useCalculateLiquidity'
import * as CalculatePodsHook from '@/src/hooks/useCalculatePods'
import * as CalculateTotalLiquidityHook
  from '@/src/hooks/useCalculateTotalLiquidity'
import * as ClaimPolicyInfoHook from '@/src/hooks/useClaimPolicyInfo'
import * as ConsensusReportingInfoHook
  from '@/src/hooks/useConsensusReportingInfo'
import * as CoverActiveReportingsHook
  from '@/src/hooks/useCoverActiveReportings'
import * as CoverDropdownHook from '@/src/hooks/useCoverDropdown'
import * as DebounceHook from '@/src/hooks/useDebounce'
import * as DisputeIncidentHook from '@/src/hooks/useDisputeIncident'
import * as ERC20AllowanceHook from '@/src/hooks/useERC20Allowance'
import * as ERC20BalanceHook from '@/src/hooks/useERC20Balance'
import * as ErrorNotifierHook from '@/src/hooks/useErrorNotifier'
import * as ExpiredPoliciesHook from '@/src/hooks/useExpiredPolicies'
import * as FetchCoverPurchasedEventHook
  from '@/src/hooks/useFetchCoverPurchasedEvent'
import * as FetchHeroStatsHook from '@/src/hooks/useFetchHeroStats'
import * as FetchReportHook from '@/src/hooks/useFetchReport'
import * as FetchReportsByKeyAndDateHook
  from '@/src/hooks/useFetchReportsByKeyAndDate'
import * as LiquidityTxsHook from '@/src/hooks/useLiquidityTxs'
import * as LocalStorageHook from '@/src/hooks/useLocalStorage'
import * as MountedStateHook from '@/src/hooks/useMountedState'
import * as MyLiquiditiesHook from '@/src/hooks/useMyLiquidities'
import * as MyLiquidityInfoHook from '@/src/hooks/useMyLiquidityInfo'
import * as PaginationHook from '@/src/hooks/usePagination'
import * as PodStakingPoolsHook from '@/src/hooks/usePodStakingPools'
import * as PolicyFeesHook from '@/src/hooks/usePolicyFees'
import * as PolicyTxsHook from '@/src/hooks/usePolicyTxs'
import * as PoolInfoHook from '@/src/hooks/usePoolInfo'
import * as ProtocolDayDataHook from '@/src/hooks/useProtocolDayData'
import * as ProvideLiquidityHook from '@/src/hooks/useProvideLiquidity'
import * as PurchasePolicyHook from '@/src/hooks/usePurchasePolicy'
import * as RecentVotesHook from '@/src/hooks/useRecentVotes'
import * as RegisterTokenHook from '@/src/hooks/useRegisterToken'
import * as RemoveLiquidityHook from '@/src/hooks/useRemoveLiquidity'
import * as ReportIncidentHook from '@/src/hooks/useReportIncident'
import * as ResolvedReportingsHook from '@/src/hooks/useResolvedReportings'
import * as ResolveIncidentHook from '@/src/hooks/useResolveIncident'
import * as RetryUntilPassedHook from '@/src/hooks/useRetryUntilPassed'
import * as SearchResultsHook from '@/src/hooks/useSearchResults'
import * as SubgraphFetchHook from '@/src/hooks/useSubgraphFetch'
import * as TokenDecimalsHook from '@/src/hooks/useTokenDecimals'
import * as TxToastHook from '@/src/hooks/useTxToast'
import * as UnstakeReportingStakeHook
  from '@/src/hooks/useUnstakeReportingStake'
import * as ValidateReferralCodeHook from '@/src/hooks/useValidateReferralCode'
import * as ValidReportHook from '@/src/hooks/useValidReport'
import * as VoteHook from '@/src/hooks/useVote'
import * as GetActivePolicies from '@/src/services/api/policy/active'
import * as UnstakeInfoForFn from '@/src/services/protocol/consensus/info'
import * as SubgraphDataFn from '@/src/services/subgraph'
import * as TransactionHistoryFile
  from '@/src/services/transactions/transaction-history'
import * as ReplacedStringFn from '@/utils/string'
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
      .spyOn(ResolveIncidentHook, 'useResolveIncident')
      .mockImplementation(returnFunction(cb)),

  useActivePoliciesByCover: (
    cb = () => ({
      data: { ...testData.activePoliciesByCover },
      hasMore: false
    })
  ) =>
    jest
      .spyOn(ActivePoliciesByCoverHook, 'useActivePoliciesByCover')
      .mockImplementation(returnFunction(cb)),

  useFetchReportsByKeyAndDate: (
    cb = () => ({
      data: testData.reports,
      loading: false
    })
  ) =>
    jest
      .spyOn(FetchReportsByKeyAndDateHook, 'useFetchReportsByKeyAndDate')
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
      .spyOn(ActiveReportingsHook, 'useActiveReportings')
      .mockImplementation(returnFunction(cb)),

  useValidReport: (cb = () => testData.reporting.validReport) =>
    jest
      .spyOn(ValidReportHook, 'useValidReport')
      .mockImplementation(returnFunction(cb)),

  useERC20Balance: (cb = () => testData.erc20Balance) =>
    jest
      .spyOn(ERC20BalanceHook, 'useERC20Balance')
      .mockImplementation(returnFunction(cb)),

  useERC20Allowance: (cb = () => testData.erc20Allowance) =>
    jest
      .spyOn(ERC20AllowanceHook, 'useERC20Allowance')
      .mockImplementation(returnFunction(cb)),

  useRegisterToken: (cb = () => testData.registerToken) =>
    jest
      .spyOn(RegisterTokenHook, 'useRegisterToken')
      .mockImplementation(returnFunction(cb)),

  usePolicyTxs: (cb = () => testData.policies) =>
    jest
      .spyOn(PolicyTxsHook, 'usePolicyTxs')
      .mockImplementation(returnFunction(cb)),

  useNetwork: (cb = () => testData.network) =>
    jest.spyOn(NetworkHook, 'useNetwork').mockImplementation(returnFunction(cb)),

  useWeb3React: (cb = () => testData.account) =>
    jest
      .spyOn(Web3React, 'useWeb3React')
      .mockImplementation(returnFunction(cb)),

  useEagerConnect: (cb = () => {}) =>
    jest
      .spyOn(EagerConnectHook, 'useEagerConnect')
      .mockImplementation(returnFunction(cb)),

  getActivePolicies: (cb = () => testData.getActivePolicies) =>
    jest
      .spyOn(GetActivePolicies, 'getActivePolicies')
      .mockImplementation(returnFunction(cb)),

  getNetworkId: (cb = () => testData.network.networkId) =>
    jest
      .spyOn(ConfigEnvironment, 'getNetworkId')
      .mockImplementation(returnFunction(cb)),

  getGraphURL: (networkId = 80001, sendNull = false) =>
    jest
      .spyOn(ConfigEnvironment, 'getGraphURL')
      .mockImplementation(() =>
        sendNull
          ? null
          : `https://api.thegraph.com/subgraphs/name/test-org/${networkId}`
      ),

  useRouter: (cb = () => testData.router) =>
    jest.spyOn(RouterHook, 'useRouter').mockImplementation(returnFunction(cb)),

  useAppConstants: (cb = () => testData.appConstants) =>
    jest
      .spyOn(AppConstantsHook, 'useAppConstants')
      .mockImplementation(returnFunction(cb)),

  useProtocolDayData: (cb = () => testData.protocolDayData) =>
    jest
      .spyOn(ProtocolDayDataHook, 'useProtocolDayData')
      .mockImplementation(returnFunction(cb)),

  useFetchHeroStats: (
    cb = () => ({ data: testData.heroStats, loading: false })
  ) =>
    jest
      .spyOn(FetchHeroStatsHook, 'useFetchHeroStats')
      .mockImplementation(returnFunction(cb)),

  useLiquidityFormsContext: (cb = () => testData.liquidityFormsContext) =>
    jest
      .spyOn(LiquidityFormsContext, 'useLiquidityFormsContext')
      .mockImplementation(returnFunction(cb)),

  useCoverActiveReportings: (cb = () => testData.coverActiveReportings) =>
    jest
      .spyOn(CoverActiveReportingsHook, 'useCoverActiveReportings')
      .mockImplementation(returnFunction(cb)),

  usePagination: (cb = () => testData.pagination) =>
    jest
      .spyOn(PaginationHook, 'usePagination')
      .mockImplementation(returnFunction(cb)),

  useLiquidityTxs: (cb = () => testData.liquidityTxs) =>
    jest
      .spyOn(LiquidityTxsHook, 'useLiquidityTxs')
      .mockImplementation(returnFunction(cb)),

  useClaimPolicyInfo: (cb = () => testData.claimPolicyInfo) =>
    jest
      .spyOn(ClaimPolicyInfoHook, 'useClaimPolicyInfo')
      .mockImplementation(returnFunction(cb)),

  useCxTokenRowContext: (cb = () => testData.cxTokenRowContext) =>
    jest
      .spyOn(CxTokenRowContextHook, 'useCxTokenRowContext')
      .mockImplementation(returnFunction(cb)),

  useClaimTableContext: (cb = () => testData.claimTableContext) =>
    jest
      .spyOn(ClaimTableContextHook, 'useClaimTableContext')
      .mockImplementation(returnFunction(cb)),

  usePodStakingPools: (cb = () => testData.podStakingPools) =>
    jest
      .spyOn(PodStakingPoolsHook, 'usePodStakingPools')
      .mockImplementation(returnFunction(cb)),

  usePoolInfo: (cb = () => testData.poolInfo) =>
    jest
      .spyOn(PoolInfoHook, 'usePoolInfo')
      .mockImplementation(returnFunction(cb)),

  useSortableStats: (cb = () => testData.sortableStats) =>
    jest
      .spyOn(SortableStatsHook, 'useSortableStats')
      .mockImplementation(returnFunction(cb)),

  useActivePolicies: (cb = () => testData.activePolicies) =>
    jest
      .spyOn(ActivePoliciesHook, 'useActivePolicies')
      .mockImplementation(returnFunction(cb)),

  useExpiredPolicies: (cb = () => testData.useExpiredPolicies) =>
    jest
      .spyOn(ExpiredPoliciesHook, 'useExpiredPolicies')
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
    jest.spyOn(ToastHook, 'useToast').mockImplementation(returnFunction(cb)),

  useResolvedReportings: (cb = () => testData.resolvedReportings) =>
    jest
      .spyOn(ResolvedReportingsHook, 'useResolvedReportings')
      .mockImplementation(returnFunction(cb)),

  useSearchResults: (cb = () => testData.searchResults) =>
    jest
      .spyOn(SearchResultsHook, 'useSearchResults')
      .mockImplementation(returnFunction(cb)),

  useCalculateLiquidity: (cb = () => testData.calculateLiquidity) =>
    jest
      .spyOn(CalculateLiquidityHook, 'useCalculateLiquidity')
      .mockImplementation(returnFunction(cb)),

  useRemoveLiquidity: (cb = () => testData.removeLiquidity) =>
    jest
      .spyOn(RemoveLiquidityHook, 'useRemoveLiquidity')
      .mockImplementation(returnFunction(cb)),

  useMyLiquidityInfo: (cb = () => testData.liquidityFormsContext) =>
    jest
      .spyOn(MyLiquidityInfoHook, 'useMyLiquidityInfo')
      .mockImplementation(returnFunction(cb)),

  usePolicyFees: (cb = () => testData.policyFees) =>
    jest
      .spyOn(PolicyFeesHook, 'usePolicyFees')
      .mockImplementation(returnFunction(cb)),

  usePurchasePolicy: (cb = () => testData.purchasePolicy) =>
    jest
      .spyOn(PurchasePolicyHook, 'usePurchasePolicy')
      .mockImplementation(returnFunction(cb)),

  useFetchCoverPurchasedEvent: (cb = () => testData.coverPurchased) =>
    jest
      .spyOn(FetchCoverPurchasedEventHook, 'useFetchCoverPurchasedEvent')
      .mockImplementation(returnFunction(cb)),

  useLocalStorage: (cb) =>
    jest
      .spyOn(LocalStorageHook, 'useLocalStorage')
      .mockImplementation(returnFunction(cb)),

  useAuth: (
    cb = () => ({ login: jest.fn(() => {}), logout: jest.fn(() => {}) })
  ) => jest
    .spyOn(AuthHook, 'useAuth')
    .mockImplementation(returnFunction(cb)),

  useReportIncident: (cb = () => testData.reportIncident) =>
    jest
      .spyOn(ReportIncidentHook, 'useReportIncident')
      .mockImplementation(returnFunction(cb)),

  useTokenDecimals: (cb = () => testData.tokenDecimals) =>
    jest
      .spyOn(TokenDecimalsHook, 'useTokenDecimals')
      .mockImplementation(returnFunction(cb)),

  useDisputeIncident: (cb = () => testData.disputeIncident) => {
    jest
      .spyOn(DisputeIncidentHook, 'useDisputeIncident')
      .mockImplementation(returnFunction(cb))
  },

  useFetchReport: (cb = () => testData.incidentReports) =>
    jest
      .spyOn(FetchReportHook, 'useFetchReport')
      .mockImplementation(returnFunction(cb)),

  useConsensusReportingInfo: (cb = () => testData.consensusInfo) =>
    jest
      .spyOn(ConsensusReportingInfoHook, 'useConsensusReportingInfo')
      .mockImplementation(returnFunction(cb)),

  useRecentVotes: (cb = () => testData.recentVotes) =>
    jest
      .spyOn(RecentVotesHook, 'useRecentVotes')
      .mockImplementation(returnFunction(cb)),

  useUnstakeReportingStake: (cb = () => testData.unstakeReporting) =>
    jest
      .spyOn(UnstakeReportingStakeHook, 'useUnstakeReportingStake')
      .mockImplementation(returnFunction(cb)),

  useRetryUntilPassed: (cb = () => testData.retryUntilPassed) =>
    jest
      .spyOn(RetryUntilPassedHook, 'useRetryUntilPassed')
      .mockImplementation(returnFunction(cb)),

  useDebounce: (value = 123) =>
    jest
      .spyOn(DebounceHook, 'useDebounce')
      .mockImplementation(returnFunction(value)),

  getReplacedString: (networkId = 80001, account = testData.account.account) =>
    jest
      .spyOn(ReplacedStringFn, 'getReplacedString')
      .mockImplementation(
        () =>
          `https://api.npm.finance/protocol/bond/info/${networkId}/${account}`
      ),

  getUnstakeInfoFor: (value = testData.consensusInfo.reportingInfo) =>
    jest
      .spyOn(UnstakeInfoForFn, 'getUnstakeInfoFor')
      .mockImplementation(returnFunction(value)),

  useMountedState: (cb = () => false) =>
    jest
      .spyOn(MountedStateHook, 'useMountedState')
      .mockImplementation(returnFunction(cb)),

  useBondPoolAddress: (cb = () => testData.bondPoolAddress) =>
    jest
      .spyOn(BondPoolAddressHook, 'useBondPoolAddress')
      .mockImplementation(returnFunction(cb)),

  useTxToast: (cb = () => testData.txToast) =>
    jest
      .spyOn(TxToastHook, 'useTxToast')
      .mockImplementation(returnFunction(cb)),

  useTxPoster: (cb = () => testData.txPoster) =>
    jest
      .spyOn(TxPosterHook, 'useTxPoster')
      .mockImplementation(returnFunction(cb)),

  useErrorNotifier: (cb = () => testData.errorNotifier) =>
    jest
      .spyOn(ErrorNotifierHook, 'useErrorNotifier')
      .mockImplementation(returnFunction(cb)),

  utilsWeb3: {
    getProviderOrSigner: (cb = () => testData.providerOrSigner) =>
      jest
        .spyOn(Web3Utils, 'getProviderOrSigner')
        .mockImplementation(returnFunction(cb))
  },

  useCoversAndProducts2: (cb = () => testData.coversAndProducts2) =>
    jest
      .spyOn(CoversAndProducts2Hook, 'useCoversAndProducts2')
      .mockImplementation(returnFunction(cb)),

  useGovernanceAddress: (cb = () => testData.governanceAddress) =>
    jest
      .spyOn(GovernanceAddressHook, 'useGovernanceAddress')
      .mockImplementation(returnFunction(cb)),

  useUnlimitedApproval: (cb = () => testData.unlimitedApproval) =>
    jest
      .spyOn(UnlimitedApprovalHook, 'useUnlimitedApproval')
      .mockImplementation(returnFunction(cb)),

  useAuthValidation: (cb = () => testData.authValidation) =>
    jest
      .spyOn(AuthValidationHook, 'useAuthValidation')
      .mockImplementation(returnFunction(cb)),

  useMyLiquidities: (cb = () => testData.myLiquidities) => {
    jest
      .spyOn(MyLiquiditiesHook, 'useMyLiquidities')
      .mockImplementation(returnFunction(cb))
  },

  useCalculateTotalLiquidity: (cb = () => testData.calculateTotalLiquidity) => {
    jest
      .spyOn(CalculateTotalLiquidityHook, 'useCalculateTotalLiquidity')
      .mockImplementation(returnFunction(cb))
  },

  useVote: (cb = () => testData.castYourVote) =>
    jest.spyOn(VoteHook, 'useVote').mockImplementation(returnFunction(cb)),

  useCoverDropdown: (cb = () => testData.coverDropdown) =>
    jest.spyOn(CoverDropdownHook, 'useCoverDropdown').mockImplementation(returnFunction(cb)),

  useBondInfo: (cb = () => testData.bondInfo) => {
    jest
      .spyOn(BondInfoHook, 'useBondInfo')
      .mockImplementation(returnFunction(cb))
  },

  useBondTxs: (cb = () => testData.bondTxs) =>
    jest
      .spyOn(BondTxsHook, 'useBondTxs')
      .mockImplementation(returnFunction(cb)),

  registerToken: (success = true) =>
    jest
      .spyOn(WalletUtils, 'registerToken')
      .mockImplementation(() =>
        success
          ? Promise.resolve('registerToken success')
          : Promise.reject(new Error('registerToken error'))
      ),

  getSubgraphData: (cb = () => testData.defaultSubgraphData) =>
    jest
      .spyOn(SubgraphDataFn, 'getSubgraphData')
      .mockImplementation(returnFunction(cb)),

  useStakingPoolsAddress: (cb = () => testData.stakingPoolsAddress) =>
    jest
      .spyOn(StakingPoolsAddressHook, 'useStakingPoolsAddress')
      .mockImplementation(returnFunction(cb)),

  useSubgraphFetch: (cb) =>
    jest.spyOn(SubgraphFetchHook, 'useSubgraphFetch').mockReturnValue(cb),

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
      .spyOn(PolicyAddressHook, 'usePolicyAddress')
      .mockImplementation(returnFunction(cb)),

  useValidateReferralCode: (cb = () => testData.referralCodeHook) =>
    jest
      .spyOn(ValidateReferralCodeHook, 'useValidateReferralCode')
      .mockImplementation(returnFunction(cb)),

  useCalculatePods: (cb = () => testData.calculatePods) =>
    jest
      .spyOn(CalculatePodsHook, 'useCalculatePods')
      .mockImplementation(returnFunction(cb)),

  useProvideLiquidity: (cb = () => testData.provideLiquidity) =>
    jest
      .spyOn(ProvideLiquidityHook, 'useProvideLiquidity')
      .mockImplementation(returnFunction(cb))
}

export { mockHooksOrMethods }
