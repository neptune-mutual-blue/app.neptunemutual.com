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
import * as TokenStakingPoolsHook from '@/src/hooks/useTokenStakingPools'
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
import * as IPFS from '@/src/utils/ipfs'
import * as ReplacedStringFn from '@/utils/string'
import * as ProtocolDayDataFile from '@/src/services/aggregated-stats/protocol'
import { testData } from '@/utils/unit-tests/test-data'

const Web3React = require('@web3-react/core')

/**
 *
 * @param {Array | Object | Function} d
 * @returns
 */
const returnFunction = (d) => {
  if (typeof d === 'function') { return d }

  return jest.fn(() => { return d })
}

const mockHooksOrMethods = {
  useResolveIncident: (cb = () => { return testData.resolveIncidentHookValues }) => {
    return jest
      .spyOn(ResolveIncidentHook, 'useResolveIncident')
      .mockImplementation(returnFunction(cb))
  },

  useActivePoliciesByCover: (
    cb = () => {
      return {
        data: { ...testData.activePoliciesByCover },
        hasMore: false
      }
    }
  ) => {
    return jest
      .spyOn(ActivePoliciesByCoverHook, 'useActivePoliciesByCover')
      .mockImplementation(returnFunction(cb))
  },

  useFetchReportsByKeyAndDate: (
    cb = () => {
      return {
        data: testData.reports,
        loading: false
      }
    }
  ) => {
    return jest
      .spyOn(FetchReportsByKeyAndDateHook, 'useFetchReportsByKeyAndDate')
      .mockImplementation(returnFunction(cb))
  },

  useActiveReportings: (
    cb = () => {
      return {
        data: {
          incidentReports: testData.reporting.activeReporting
        },
        loading: false,
        hasMore: true
      }
    }
  ) => {
    return jest
      .spyOn(ActiveReportingsHook, 'useActiveReportings')
      .mockImplementation(returnFunction(cb))
  },

  useValidReport: (cb = () => { return testData.reporting.validReport }) => {
    return jest
      .spyOn(ValidReportHook, 'useValidReport')
      .mockImplementation(returnFunction(cb))
  },

  useERC20Balance: (cb = () => { return testData.erc20Balance }) => {
    return jest
      .spyOn(ERC20BalanceHook, 'useERC20Balance')
      .mockImplementation(returnFunction(cb))
  },

  useERC20Allowance: (cb = () => { return testData.erc20Allowance }) => {
    return jest
      .spyOn(ERC20AllowanceHook, 'useERC20Allowance')
      .mockImplementation(returnFunction(cb))
  },

  useRegisterToken: (cb = () => { return testData.registerToken }) => {
    return jest
      .spyOn(RegisterTokenHook, 'useRegisterToken')
      .mockImplementation(returnFunction(cb))
  },

  usePolicyTxs: (cb = () => { return testData.policies }) => {
    return jest
      .spyOn(PolicyTxsHook, 'usePolicyTxs')
      .mockImplementation(returnFunction(cb))
  },

  useNetwork: (cb = () => { return testData.network }) => { return jest.spyOn(NetworkHook, 'useNetwork').mockImplementation(returnFunction(cb)) },

  useWeb3React: (cb = () => { return testData.account }) => {
    return jest
      .spyOn(Web3React, 'useWeb3React')
      .mockImplementation(returnFunction(cb))
  },

  useEagerConnect: (cb = () => {}) => {
    return jest
      .spyOn(EagerConnectHook, 'useEagerConnect')
      .mockImplementation(returnFunction(cb))
  },

  getActivePolicies: (cb = () => { return testData.getActivePolicies }) => {
    return jest
      .spyOn(GetActivePolicies, 'getActivePolicies')
      .mockImplementation(returnFunction(cb))
  },

  getNetworkId: (cb = () => { return testData.network.networkId }) => {
    return jest
      .spyOn(ConfigEnvironment, 'getNetworkId')
      .mockImplementation(returnFunction(cb))
  },

  getGraphURL: (networkId = 80001, sendNull = false) => {
    return jest
      .spyOn(ConfigEnvironment, 'getGraphURL')
      .mockImplementation(() => {
        return sendNull
          ? null
          : `https://api.thegraph.com/subgraphs/name/test-org/${networkId}`
      }
      )
  },

  useRouter: (cb = () => { return testData.router }) => { return jest.spyOn(RouterHook, 'useRouter').mockImplementation(returnFunction(cb)) },

  useAppConstants: (cb = () => { return testData.appConstants }) => {
    return jest
      .spyOn(AppConstantsHook, 'useAppConstants')
      .mockImplementation(returnFunction(cb))
  },

  useProtocolDayData: (cb = () => { return testData.protocolDayData }) => {
    return jest
      .spyOn(ProtocolDayDataHook, 'useProtocolDayData')
      .mockImplementation(returnFunction(cb))
  },

  useFetchHeroStats: (
    cb = () => { return { data: testData.heroStats, loading: false } }
  ) => {
    return jest
      .spyOn(FetchHeroStatsHook, 'useFetchHeroStats')
      .mockImplementation(returnFunction(cb))
  },

  useLiquidityFormsContext: (cb = () => { return testData.liquidityFormsContext }) => {
    return jest
      .spyOn(LiquidityFormsContext, 'useLiquidityFormsContext')
      .mockImplementation(returnFunction(cb))
  },

  useCoverActiveReportings: (cb = () => { return testData.coverActiveReportings }) => {
    return jest
      .spyOn(CoverActiveReportingsHook, 'useCoverActiveReportings')
      .mockImplementation(returnFunction(cb))
  },

  usePagination: (cb = () => { return testData.pagination }) => {
    return jest
      .spyOn(PaginationHook, 'usePagination')
      .mockImplementation(returnFunction(cb))
  },

  useLiquidityTxs: (cb = () => { return testData.liquidityTxs }) => {
    return jest
      .spyOn(LiquidityTxsHook, 'useLiquidityTxs')
      .mockImplementation(returnFunction(cb))
  },

  useClaimPolicyInfo: (cb = () => { return testData.claimPolicyInfo }) => {
    return jest
      .spyOn(ClaimPolicyInfoHook, 'useClaimPolicyInfo')
      .mockImplementation(returnFunction(cb))
  },

  useCxTokenRowContext: (cb = () => { return testData.cxTokenRowContext }) => {
    return jest
      .spyOn(CxTokenRowContextHook, 'useCxTokenRowContext')
      .mockImplementation(returnFunction(cb))
  },

  useClaimTableContext: (cb = () => { return testData.claimTableContext }) => {
    return jest
      .spyOn(ClaimTableContextHook, 'useClaimTableContext')
      .mockImplementation(returnFunction(cb))
  },

  usePodStakingPools: (cb = () => { return testData.podStakingPools }) => {
    return jest
      .spyOn(PodStakingPoolsHook, 'usePodStakingPools')
      .mockImplementation(returnFunction(cb))
  },

  usePoolInfo: (cb = () => { return testData.poolInfo }) => {
    return jest
      .spyOn(PoolInfoHook, 'usePoolInfo')
      .mockImplementation(returnFunction(cb))
  },

  useSortableStats: (cb = () => { return testData.sortableStats }) => {
    return jest
      .spyOn(SortableStatsHook, 'useSortableStats')
      .mockImplementation(returnFunction(cb))
  },

  useActivePolicies: (cb = () => { return testData.activePolicies }) => {
    return jest
      .spyOn(ActivePoliciesHook, 'useActivePolicies')
      .mockImplementation(returnFunction(cb))
  },

  useExpiredPolicies: (cb = () => { return testData.useExpiredPolicies }) => {
    return jest
      .spyOn(ExpiredPoliciesHook, 'useExpiredPolicies')
      .mockImplementation(returnFunction(cb))
  },

  chartMockFn: (props) => {
    const options = props?.options
    options?.scales?.x?.ticks?.callback?.()
    options?.animation?.onComplete?.({
      chart: {
        ctx: { fillText: jest.fn() },
        getDatasetMeta: () => {
          return {
            data: [
              { x: 1, y: 1 },
              { x: 1, y: 1 }
            ]
          }
        },
        data: { datasets: [{ data: [1] }] }
      }
    })

    return <div data-testid={props['data-testid']} />
  },

  useToast: (cb = () => { return testData.toast }) => { return jest.spyOn(ToastHook, 'useToast').mockImplementation(returnFunction(cb)) },

  useResolvedReportings: (cb = () => { return testData.resolvedReportings }) => {
    return jest
      .spyOn(ResolvedReportingsHook, 'useResolvedReportings')
      .mockImplementation(returnFunction(cb))
  },

  useSearchResults: (cb = () => { return testData.searchResults }) => {
    return jest
      .spyOn(SearchResultsHook, 'useSearchResults')
      .mockImplementation(returnFunction(cb))
  },

  useCalculateLiquidity: (cb = () => { return testData.calculateLiquidity }) => {
    return jest
      .spyOn(CalculateLiquidityHook, 'useCalculateLiquidity')
      .mockImplementation(returnFunction(cb))
  },

  useRemoveLiquidity: (cb = () => { return testData.removeLiquidity }) => {
    return jest
      .spyOn(RemoveLiquidityHook, 'useRemoveLiquidity')
      .mockImplementation(returnFunction(cb))
  },

  useMyLiquidityInfo: (cb = () => { return testData.liquidityFormsContext }) => {
    return jest
      .spyOn(MyLiquidityInfoHook, 'useMyLiquidityInfo')
      .mockImplementation(returnFunction(cb))
  },

  usePolicyFees: (cb = () => { return testData.policyFees }) => {
    return jest
      .spyOn(PolicyFeesHook, 'usePolicyFees')
      .mockImplementation(returnFunction(cb))
  },

  usePurchasePolicy: (cb = () => { return testData.purchasePolicy }) => {
    return jest
      .spyOn(PurchasePolicyHook, 'usePurchasePolicy')
      .mockImplementation(returnFunction(cb))
  },

  useFetchCoverPurchasedEvent: (cb = () => { return testData.coverPurchased }) => {
    return jest
      .spyOn(FetchCoverPurchasedEventHook, 'useFetchCoverPurchasedEvent')
      .mockImplementation(returnFunction(cb))
  },

  useLocalStorage: (cb) => {
    return jest
      .spyOn(LocalStorageHook, 'useLocalStorage')
      .mockImplementation(returnFunction(cb))
  },

  useAuth: (
    cb = () => { return { login: jest.fn(() => {}), logout: jest.fn(() => {}) } }
  ) => {
    return jest
      .spyOn(AuthHook, 'useAuth')
      .mockImplementation(returnFunction(cb))
  },

  useReportIncident: (cb = () => { return testData.reportIncident }) => {
    return jest
      .spyOn(ReportIncidentHook, 'useReportIncident')
      .mockImplementation(returnFunction(cb))
  },

  useTokenDecimals: (cb = () => { return testData.tokenDecimals }) => {
    return jest
      .spyOn(TokenDecimalsHook, 'useTokenDecimals')
      .mockImplementation(returnFunction(cb))
  },

  useDisputeIncident: (cb = () => { return testData.disputeIncident }) => {
    jest
      .spyOn(DisputeIncidentHook, 'useDisputeIncident')
      .mockImplementation(returnFunction(cb))
  },

  useFetchReport: (cb = () => { return testData.incidentReports }) => {
    return jest
      .spyOn(FetchReportHook, 'useFetchReport')
      .mockImplementation(returnFunction(cb))
  },

  useConsensusReportingInfo: (cb = () => { return testData.consensusInfo }) => {
    return jest
      .spyOn(ConsensusReportingInfoHook, 'useConsensusReportingInfo')
      .mockImplementation(returnFunction(cb))
  },

  useRecentVotes: (cb = () => { return testData.recentVotes }) => {
    return jest
      .spyOn(RecentVotesHook, 'useRecentVotes')
      .mockImplementation(returnFunction(cb))
  },

  useUnstakeReportingStake: (cb = () => { return testData.unstakeReporting }) => {
    return jest
      .spyOn(UnstakeReportingStakeHook, 'useUnstakeReportingStake')
      .mockImplementation(returnFunction(cb))
  },

  useRetryUntilPassed: (cb = () => { return testData.retryUntilPassed }) => {
    return jest
      .spyOn(RetryUntilPassedHook, 'useRetryUntilPassed')
      .mockImplementation(returnFunction(cb))
  },

  useDebounce: (value = 123) => {
    return jest
      .spyOn(DebounceHook, 'useDebounce')
      .mockImplementation(returnFunction(value))
  },

  getReplacedString: (networkId = 80001, account = testData.account.account) => {
    return jest
      .spyOn(ReplacedStringFn, 'getReplacedString')
      .mockImplementation(
        () => { return `https://api.npm.finance/protocol/bond/info/${networkId}/${account}` }
      )
  },

  getUnstakeInfoFor: (value = testData.consensusInfo.reportingInfo) => {
    return jest
      .spyOn(UnstakeInfoForFn, 'getUnstakeInfoFor')
      .mockImplementation(returnFunction(value))
  },

  useMountedState: (cb = () => { return false }) => {
    return jest
      .spyOn(MountedStateHook, 'useMountedState')
      .mockImplementation(returnFunction(cb))
  },

  useBondPoolAddress: (cb = () => { return testData.bondPoolAddress }) => {
    return jest
      .spyOn(BondPoolAddressHook, 'useBondPoolAddress')
      .mockImplementation(returnFunction(cb))
  },

  useTxToast: (cb = () => { return testData.txToast }) => {
    return jest
      .spyOn(TxToastHook, 'useTxToast')
      .mockImplementation(returnFunction(cb))
  },

  useTxPoster: (cb = () => { return testData.txPoster }) => {
    return jest
      .spyOn(TxPosterHook, 'useTxPoster')
      .mockImplementation(returnFunction(cb))
  },

  useErrorNotifier: (cb = () => { return testData.errorNotifier }) => {
    return jest
      .spyOn(ErrorNotifierHook, 'useErrorNotifier')
      .mockImplementation(returnFunction(cb))
  },

  utilsWeb3: {
    getProviderOrSigner: (cb = () => { return testData.providerOrSigner }) => {
      return jest
        .spyOn(Web3Utils, 'getProviderOrSigner')
        .mockImplementation(returnFunction(cb))
    }
  },
  ipfs: {
    writeToIpfs: (cb = () => { return testData.writeToIpfs }) => {
      return jest
        .spyOn(IPFS, 'writeToIpfs')
        .mockImplementation(returnFunction(cb))
    },
    readFromIpfs: (cb = () => { return testData.readFromIpfs }) => {
      return jest
        .spyOn(IPFS, 'readFromIpfs')
        .mockImplementation(returnFunction(cb))
    }
  },

  useCoversAndProducts2: (cb = () => { return testData.coversAndProducts2 }) => {
    return jest
      .spyOn(CoversAndProducts2Hook, 'useCoversAndProducts2')
      .mockImplementation(returnFunction(cb))
  },

  useGovernanceAddress: (cb = () => { return testData.governanceAddress }) => {
    return jest
      .spyOn(GovernanceAddressHook, 'useGovernanceAddress')
      .mockImplementation(returnFunction(cb))
  },

  useUnlimitedApproval: (cb = () => { return testData.unlimitedApproval }) => {
    return jest
      .spyOn(UnlimitedApprovalHook, 'useUnlimitedApproval')
      .mockImplementation(returnFunction(cb))
  },

  useAuthValidation: (cb = () => { return testData.authValidation }) => {
    return jest
      .spyOn(AuthValidationHook, 'useAuthValidation')
      .mockImplementation(returnFunction(cb))
  },

  useMyLiquidities: (cb = () => { return testData.myLiquidities }) => {
    jest
      .spyOn(MyLiquiditiesHook, 'useMyLiquidities')
      .mockImplementation(returnFunction(cb))
  },

  useCalculateTotalLiquidity: (cb = () => { return testData.calculateTotalLiquidity }) => {
    jest
      .spyOn(CalculateTotalLiquidityHook, 'useCalculateTotalLiquidity')
      .mockImplementation(returnFunction(cb))
  },

  useVote: (cb = () => { return testData.castYourVote }) => { return jest.spyOn(VoteHook, 'useVote').mockImplementation(returnFunction(cb)) },

  useCoverDropdown: (cb = () => { return testData.coverDropdown }) => { return jest.spyOn(CoverDropdownHook, 'useCoverDropdown').mockImplementation(returnFunction(cb)) },

  useBondInfo: (cb = () => { return testData.bondInfo }) => {
    jest
      .spyOn(BondInfoHook, 'useBondInfo')
      .mockImplementation(returnFunction(cb))
  },

  useBondTxs: (cb = () => { return testData.bondTxs }) => {
    return jest
      .spyOn(BondTxsHook, 'useBondTxs')
      .mockImplementation(returnFunction(cb))
  },

  registerToken: (success = true) => {
    return jest
      .spyOn(WalletUtils, 'registerToken')
      .mockImplementation(() => {
        return success
          ? Promise.resolve('registerToken success')
          : Promise.reject(new Error('registerToken error'))
      }
      )
  },

  getSubgraphData: (cb = () => { return testData.defaultSubgraphData }) => {
    return jest
      .spyOn(SubgraphDataFn, 'getSubgraphData')
      .mockImplementation(returnFunction(cb))
  },

  useStakingPoolsAddress: (cb = () => { return testData.stakingPoolsAddress }) => {
    return jest
      .spyOn(StakingPoolsAddressHook, 'useStakingPoolsAddress')
      .mockImplementation(returnFunction(cb))
  },

  useSubgraphFetch: (cb) => { return jest.spyOn(SubgraphFetchHook, 'useSubgraphFetch').mockReturnValue(cb) },

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

  usePolicyAddress: (cb = () => { return testData.policyContractAddress }) => {
    return jest
      .spyOn(PolicyAddressHook, 'usePolicyAddress')
      .mockImplementation(returnFunction(cb))
  },

  useValidateReferralCode: (cb = () => { return testData.referralCodeHook }) => {
    return jest
      .spyOn(ValidateReferralCodeHook, 'useValidateReferralCode')
      .mockImplementation(returnFunction(cb))
  },

  useCalculatePods: (cb = () => { return testData.calculatePods }) => {
    return jest
      .spyOn(CalculatePodsHook, 'useCalculatePods')
      .mockImplementation(returnFunction(cb))
  },

  useProvideLiquidity: (cb = () => { return testData.provideLiquidity }) => {
    return jest
      .spyOn(ProvideLiquidityHook, 'useProvideLiquidity')
      .mockImplementation(returnFunction(cb))
  },

  useTokenStakingPools: (cb = () => { return testData.tokenStakingPools }) => {
    return jest
      .spyOn(TokenStakingPoolsHook, 'useTokenStakingPools')
      .mockImplementation(returnFunction(cb))
  },

  getGroupedProtocolDayData: (cb = () => { return Promise.resolve(testData.protocolDayData.data) }) => {
    return jest
      .spyOn(ProtocolDayDataFile, 'getGroupedProtocolDayData')
      .mockImplementation(returnFunction(cb))
  }
}

export { mockHooksOrMethods }
