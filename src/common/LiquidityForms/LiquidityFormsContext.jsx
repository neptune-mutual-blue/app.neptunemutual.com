import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppConstants } from "@/src/context/AppConstants";
import { useNetwork } from "@/src/context/Network";
import { getLiquidityInfoFromStore } from "@/src/helpers/store/getLiquidityInfoFromStore";
import { useVaultAddress } from "@/src/hooks/contracts/useVaultAddress";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { useTokenDecimals } from "@/src/hooks/useTokenDecimals";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { useWeb3React } from "@web3-react/core";
import React, { useCallback, useEffect, useState } from "react";

const defaultValue = {
  isAccrualComplete: true,
  myStake: "0",
  minStakeToAddLiquidity: "0",
  updateMinStakeInfo: () => {},
  vaultTokenAddress: "",
  vaultTokenSymbol: "",
  vaultTokenDecimals: "0",
  podBalance: "0",
  loadingPodBalance: false,
  updatePodBalance: async () => {},
  lqTokenBalance: "0",
  lqBalanceLoading: false,
  updateLqTokenBalance: async () => {},
  stakingTokenBalance: "0",
  stakingTokenBalanceLoading: false,
  updateStakingTokenBalance: async () => {},
};

const LiquidityFormsContext = React.createContext(defaultValue);

export const LiquidityFormsProvider = ({ coverKey, productKey, children }) => {
  const [liquidityInfoFromStore, setLiquidityInfoFromStore] = useState({
    minStakeToAddLiquidity: defaultValue.minStakeToAddLiquidity,
    myStake: defaultValue.myStake,
    isAccrualComplete: defaultValue.isAccrualComplete,
  });
  const vaultTokenAddress = useVaultAddress({ coverKey });
  const vaultTokenSymbol = useTokenSymbol(vaultTokenAddress);
  const tokenDecimals = useTokenDecimals(vaultTokenAddress);
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
    balance: stakingTokenBalance,
    loading: stakingTokenBalanceLoading,
    refetch: updateStakingTokenBalance,
  } = useERC20Balance(NPMTokenAddress);

  const { networkId } = useNetwork();
  const { library, account } = useWeb3React();

  const fetchMinStakeInfo = useCallback(async () => {
    if (!networkId || !account || !coverKey) return;

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    const _liquidityInfoFromStore = await getLiquidityInfoFromStore(
      networkId,
      coverKey,
      account,
      signerOrProvider.provider
    );

    return _liquidityInfoFromStore;
  }, [account, coverKey, library, networkId]);

  useEffect(() => {
    let ignore = false;
    if (!networkId || !account || !coverKey) return;

    fetchMinStakeInfo()
      .then((_liquidityInfoFromStore) => {
        if (ignore || !_liquidityInfoFromStore) return;
        setLiquidityInfoFromStore(_liquidityInfoFromStore);
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [account, coverKey, fetchMinStakeInfo, library, networkId]);

  const updateMinStakeInfo = useCallback(() => {
    fetchMinStakeInfo()
      .then((_liquidityInfoFromStore) => {
        if (!_liquidityInfoFromStore) return;
        setLiquidityInfoFromStore(_liquidityInfoFromStore);
      })
      .catch(console.error);
  }, [fetchMinStakeInfo]);

  return (
    <LiquidityFormsContext.Provider
      value={{
        isAccrualComplete: liquidityInfoFromStore.isAccrualComplete,
        minStakeToAddLiquidity: liquidityInfoFromStore.minStakeToAddLiquidity,
        myStake: liquidityInfoFromStore.myStake,
        updateMinStakeInfo,
        vaultTokenAddress,
        vaultTokenSymbol,
        vaultTokenDecimals: tokenDecimals,
        podBalance,
        loadingPodBalance,
        updatePodBalance,
        lqTokenBalance,
        lqBalanceLoading,
        updateLqTokenBalance,
        stakingTokenBalance,
        stakingTokenBalanceLoading,
        updateStakingTokenBalance,
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
