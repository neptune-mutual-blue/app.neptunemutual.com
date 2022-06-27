import { useAppConstants } from "@/src/context/AppConstants";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import React from "react";

const defaultValue = {
  stakingTokenBalance: "0",
  stakingTokenBalanceLoading: false,
  isWithdrawalWindowOpen: true,
  updateStakingTokenBalance: async () => {},
  accrueInterest: async () => {},
  refetchInfo: () => {},
  info: {
    withdrawalOpen: "0",
    withdrawalClose: "0",
    totalReassurance: "0",
    vault: "",
    stablecoin: "",
    podTotalSupply: "0",
    myPodBalance: "0",
    vaultStablecoinBalance: "0",
    amountLentInStrategies: "0",
    myShare: "0",
    myUnrealizedShare: "0",
    totalLiquidity: "0",
    myStablecoinBalance: "0",
    stablecoinTokenSymbol: "",
    vaultTokenDecimals: "0",
    vaultTokenSymbol: "",
    minStakeToAddLiquidity: "0",
    myStake: "0",
    isAccrualComplete: true,
  },
};

const LiquidityFormsContext = React.createContext(defaultValue);

export const LiquidityFormsProvider = ({ coverKey, children }) => {
  const {
    info,
    refetch: refetchInfo,
    accrueInterest,
    isWithdrawalWindowOpen,
  } = useMyLiquidityInfo({ coverKey });

  const { NPMTokenAddress } = useAppConstants();
  const {
    balance: stakingTokenBalance,
    loading: stakingTokenBalanceLoading,
    refetch: updateStakingTokenBalance,
  } = useERC20Balance(NPMTokenAddress);

  return (
    <LiquidityFormsContext.Provider
      value={{
        stakingTokenBalance,
        stakingTokenBalanceLoading,
        updateStakingTokenBalance,
        refetchInfo,
        accrueInterest,
        isWithdrawalWindowOpen,
        info,
      }}
    >
      {children}
    </LiquidityFormsContext.Provider>
  );
};

export function useLiquidityFormsContext() {
  const context = React.useContext(LiquidityFormsContext);
  if (context === undefined) {
    throw new Error(
      "useLiquidityFormsContext must be used within a LiquidityFormsContext.Provider"
    );
  }
  return context;
}
