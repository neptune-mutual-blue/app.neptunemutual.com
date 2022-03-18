import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { convertToUnits } from "@/utils/bn";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useAppContext } from "@/src/context/AppWrapper";
import { useVaultAddress } from "@/src/hooks/contracts/useVaultAddress";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useEffect, useState } from "react";
import { useERC20Allowance } from "@/src/hooks/useERC20Allowance";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";

export const useRemoveLiquidity = ({
  coverKey,
  value,
  npmValue,
  refetchInfo,
}) => {
  const [approving, setApproving] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const { library, account } = useWeb3React();
  const { networkId } = useAppContext();
  const vaultTokenAddress = useVaultAddress({ coverKey });
  const vaultTokenSymbol = useTokenSymbol(vaultTokenAddress);
  const { balance, refetch: updateBalance } =
    useERC20Balance(vaultTokenAddress);
  const {
    allowance,
    approve,
    refetch: updateAllowance,
  } = useERC20Allowance(vaultTokenAddress);

  const txToast = useTxToast();
  const { notifyError } = useErrorNotifier();
  const { invoke } = useInvokeMethod();

  useEffect(() => {
    updateAllowance(vaultTokenAddress);
  }, [vaultTokenAddress, updateAllowance]);

  const handleApprove = async () => {
    setApproving(true);
    try {
      const tx = await approve(
        vaultTokenAddress,
        convertToUnits(value).toString()
      );

      await txToast.push(tx, {
        pending: `Approving ${vaultTokenSymbol} tokens`,
        success: `Approved ${vaultTokenSymbol} tokens Successfully`,
        failure: `Could not approve ${vaultTokenSymbol} tokens`,
      });

      updateAllowance(vaultTokenAddress);
    } catch (err) {
      notifyError(err, `approve ${vaultTokenSymbol} tokens`);
    } finally {
      setApproving(false);
    }
  };

  const handleWithdraw = async () => {
    if (!networkId || !account) return;

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    try {
      setWithdrawing(true);
      const instance = await registry.Vault.getInstance(
        networkId,
        coverKey,
        signerOrProvider
      );

      const args = [
        coverKey,
        convertToUnits(value).toString(),
        convertToUnits(npmValue).toString(),
        false,
      ];
      const tx = await invoke(
        instance,
        "removeLiquidity",
        {},
        notifyError,
        args
      );

      await txToast.push(tx, {
        pending: "Removing Liquidity",
        success: "Removed Liquidity Successfully",
        failure: "Could not remove liquidity",
      });

      updateBalance();
      updateAllowance(vaultTokenAddress);
      refetchInfo();
    } catch (err) {
      notifyError(err, "remove liquidity");
    } finally {
      setWithdrawing(false);
    }
  };

  return {
    balance,
    allowance,
    vaultTokenAddress,
    vaultTokenSymbol,

    approving,
    withdrawing,

    handleApprove,
    handleWithdraw,
  };
};
