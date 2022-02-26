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

export const useRemoveLiquidity = ({ coverKey, value }) => {
  const { library, account } = useWeb3React();
  const { networkId } = useAppContext();
  const vaultTokenAddress = useVaultAddress({ coverKey });
  const { balance } = useERC20Balance(vaultTokenAddress);

  const txToast = useTxToast();
  const { notifyError } = useErrorNotifier();
  const { invoke } = useInvokeMethod();

  const handleWithdraw = async () => {
    if (!networkId || !account) return;

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    try {
      const instance = await registry.Vault.getInstance(
        networkId,
        coverKey,
        signerOrProvider
      );

      const args = [coverKey, convertToUnits(value).toString(), "0"];
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
    } catch (err) {
      notifyError(err, "remove liquidity");
    }
  };

  return {
    balance,
    vaultTokenAddress,
    handleWithdraw,
  };
};
