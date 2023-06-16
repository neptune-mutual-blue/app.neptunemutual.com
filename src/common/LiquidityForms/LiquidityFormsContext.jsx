import React from 'react'

import { useAppConstants } from '@/src/context/AppConstants'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { useMyLiquidityInfo } from '@/src/hooks/useMyLiquidityInfo'

const defaultValue = {
  stakingTokenBalance: '0',
  stakingTokenBalanceLoading: false,
  updateStakingTokenBalance: async () => {},
  stablecoinTokenBalance: '0',
  stablecoinTokenBalanceLoading: false,
  updateStablecoinTokenBalance: async () => {},
  isWithdrawalWindowOpen: true,
  isWithdrawalWindowOutdated: false,
  accrueInterest: async () => {},
  updateWithdrawalWindow: async () => { },
  refetchInfo: () => {},
  info: {
    withdrawalOpen: '0',
    withdrawalClose: '0',
    totalReassurance: '0',
    vault: '',
    stablecoin: '',
    podTotalSupply: '0',
    myPodBalance: '0',
    vaultStablecoinBalance: '0',
    amountLentInStrategies: '0',
    myShare: '0',
    myUnrealizedShare: '0',
    totalLiquidity: '0',
    stablecoinTokenSymbol: '',
    vaultTokenDecimals: '0',
    vaultTokenSymbol: '',
    minStakeToAddLiquidity: '0',
    myStake: '0',
    isAccrualComplete: true
  }
}

const LiquidityFormsContext = React.createContext(defaultValue)

export const LiquidityFormsProvider = ({ coverKey, children }) => {
  const {
    info,
    refetch,
    updateWithdrawalWindow,
    isWithdrawalWindowOutdated,
    accrueInterest,
    isWithdrawalWindowOpen
  } = useMyLiquidityInfo({ coverKey })

  const { NPMTokenAddress, liquidityTokenAddress } = useAppConstants()
  const {
    balance: stakingTokenBalance,
    loading: stakingTokenBalanceLoading,
    refetch: updateStakingTokenBalance
  } = useERC20Balance(NPMTokenAddress)
  const {
    balance: stablecoinTokenBalance,
    loading: stablecoinTokenBalanceLoading,
    refetch: updateStablecoinTokenBalance
  } = useERC20Balance(liquidityTokenAddress)

  const refetchInfo = () => {
    refetch()
    updateStablecoinTokenBalance()
  }

  return (
    <LiquidityFormsContext.Provider
      value={{
        stakingTokenBalance,
        stakingTokenBalanceLoading,
        updateStakingTokenBalance,
        stablecoinTokenBalance,
        stablecoinTokenBalanceLoading,
        updateStablecoinTokenBalance,
        refetchInfo,
        accrueInterest,
        isWithdrawalWindowOpen,
        updateWithdrawalWindow,
        isWithdrawalWindowOutdated,
        info
      }}
    >
      {children}
    </LiquidityFormsContext.Provider>
  )
}

export function useLiquidityFormsContext () {
  const context = React.useContext(LiquidityFormsContext)
  if (context === undefined) {
    throw new Error(
      'useLiquidityFormsContext must be used within a LiquidityFormsContext.Provider'
    )
  }

  return context
}
