import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppConstants } from "@/src/context/AppConstants";
import { useNetwork } from "@/src/context/Network";
import { getLiquidityInfoFromStore } from "@/src/helpers/store/getLiquidityInfoFromStore";
import { useVaultAddress } from "@/src/hooks/contracts/useVaultAddress";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { useWeb3React } from "@web3-react/core";
import React, { useCallback, useEffect, useState } from "react";

const defaultValue = {
  isAccrualComplete: true,
  myStake: "0",
  minStakeToAddLiquidity: "0",
  updateMinStakeInfo: (_ignore = false) => {},
  vaultTokenAddress: "",
  vaultTokenSymbol: "",
  podBalance: "0",
  loadingPodBalance: false,
  updatePodBalance: async () => {},
  lqTokenBalance: "0",
  lqBalanceLoading: false,
  updateLqTokenBalance: async () => {},
  stakeBalance: "0",
  stakeBalanceLoading: false,
  updateStakeBalance: async () => {},
};

const LiquidityFormsContext = React.createContext(defaultValue);

export const LiquidityFormsProvider = ({ coverKey, children }) => {
  const [liquidityInfoFromStore, setLiquidityInfoFromStore] = useState({
    minStakeToAddLiquidity: defaultValue.minStakeToAddLiquidity,
    myStake: defaultValue.myStake,
    isAccrualComplete: defaultValue.isAccrualComplete,
  });
  const vaultTokenAddress = useVaultAddress({ coverKey });
  const vaultTokenSymbol = useTokenSymbol(vaultTokenAddress);
  const {
    balance: podBalance,
    loading: loadingPodBalance,
    refetch: updatePodBalance,
  } = useERC20Balance(vaultTokenAddress);
  const { liquidityTokenAddress, NPMTokenAddress } = useAppConstants();
  const {
    balance: lqTokenBalance,
    loading: lqBalanceLoading,
    refetch: updateLqTokenBalance,
  } = useERC20Balance(liquidityTokenAddress);
  const {
    balance: stakeBalance,
    loading: stakeBalanceLoading,
    refetch: updateStakeBalance,
  } = useERC20Balance(NPMTokenAddress);

  const { networkId } = useNetwork();
  const { library, account } = useWeb3React();

  const updateMinStakeInfo = useCallback(
    async (ignore = false) => {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const _liquidityInfoFromStore = await getLiquidityInfoFromStore(
        networkId,
        coverKey,
        account,
        signerOrProvider.provider
      );

      if (ignore) return;
      setLiquidityInfoFromStore(_liquidityInfoFromStore);
    },
    [account, coverKey, library, networkId]
  );

  useEffect(() => {
    let ignore = false;
    if (!networkId || !account || !coverKey) return;

    updateMinStakeInfo(ignore);

    return () => {
      ignore = true;
    };
  }, [account, coverKey, updateMinStakeInfo, library, networkId]);

  return (
    <LiquidityFormsContext.Provider
      value={{
        isAccrualComplete: liquidityInfoFromStore.isAccrualComplete,
        minStakeToAddLiquidity: liquidityInfoFromStore.minStakeToAddLiquidity,
        myStake: liquidityInfoFromStore.myStake,
        updateMinStakeInfo,
        vaultTokenAddress,
        vaultTokenSymbol,
        podBalance,
        loadingPodBalance,
        updatePodBalance,
        lqTokenBalance,
        lqBalanceLoading,
        updateLqTokenBalance,
        stakeBalance,
        stakeBalanceLoading,
        updateStakeBalance,
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
