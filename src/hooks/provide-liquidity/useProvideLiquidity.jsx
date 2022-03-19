import { useState, useEffect } from "react";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

import {
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
} from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useNetwork } from "@/src/context/Network";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { useAppConstants } from "@/src/context/AppConstants";
import { useVaultAddress } from "@/src/hooks/contracts/useVaultAddress";
import { useERC20Allowance } from "@/src/hooks/useERC20Allowance";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";

export const useProvideLiquidity = ({ coverKey, lqValue, npmValue }) => {
  const [lqApproving, setLqApproving] = useState();
  const [npmApproving, setNPMApproving] = useState();
  const [providing, setProviding] = useState();

  const { networkId } = useNetwork();
  const { library, account } = useWeb3React();
  const { liquidityTokenAddress, NPMTokenAddress } = useAppConstants();
  const { balance: lqTokenBalance, refetch: updateLqTokenBalance } =
    useERC20Balance(liquidityTokenAddress);
  const { balance: npmBalance, refetch: updateNpmBalance } =
    useERC20Balance(NPMTokenAddress);
  const vaultAddress = useVaultAddress({ coverKey });
  const {
    allowance: lqTokenAllowance,
    approve: lqTokenApprove,
    refetch: updateLqAllowance,
  } = useERC20Allowance(liquidityTokenAddress);
  const {
    allowance: npmTokenAllowance,
    approve: npmTokenApprove,
    refetch: updateStakeAllowance,
  } = useERC20Allowance(NPMTokenAddress);
  const podSymbol = useTokenSymbol(vaultAddress);

  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    updateLqAllowance(vaultAddress);
  }, [updateLqAllowance, vaultAddress]);

  useEffect(() => {
    updateStakeAllowance(vaultAddress);
  }, [updateStakeAllowance, vaultAddress]);

  const handleLqTokenApprove = async () => {
    setLqApproving(true);
    const onTransactionResult = async (tx) => {
      try {
        await txToast.push(tx, {
          pending: "Approving DAI",
          success: "Approved DAI Successfully",
          failure: "Could not approve DAI",
        });
      } catch (error) {
        notifyError(error, "approve DAI");
      } finally {
        setLqApproving(false);
      }
    };

    lqTokenApprove(
      vaultAddress,
      convertToUnits(lqValue).toString(),
      onTransactionResult
    );
  };

  const handleNPMTokenApprove = async () => {
    setNPMApproving(true);
    const onTransactionResult = async (tx) => {
      try {
        await txToast.push(tx, {
          pending: "Approving NPM",
          success: "Approved NPM Successfully",
          failure: "Could not approve NPM",
        });
      } catch (error) {
        notifyError(error, "approve NPM");
      } finally {
        setNPMApproving(false);
      }
    };

    npmTokenApprove(
      vaultAddress,
      convertToUnits(npmValue).toString(),
      onTransactionResult
    );
  };

  const handleProvide = async () => {
    try {
      setProviding(true);

      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const lqAmount = convertToUnits(lqValue).toString();
      const npmAmount = convertToUnits(npmValue).toString();

      const vault = await registry.Vault.getInstance(
        networkId,
        coverKey,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: "Adding Liquidity",
          success: "Added Liquidity Successfully",
          failure: "Could not add liquidity",
        });

        setProviding(false);
        updateLqTokenBalance();
        updateNpmBalance();
        updateLqAllowance();
        updateStakeAllowance();
      };

      const args = [coverKey, lqAmount, npmAmount];
      invoke({
        instance: vault,
        methodName: "addLiquidity",
        catcher: notifyError,
        onTransactionResult,
        args,
      });
    } catch (err) {
      setProviding(false);
      notifyError(err, "add liquidity");
    } finally {
    }
  };

  const hasLqTokenAllowance = isGreaterOrEqual(
    lqTokenAllowance || "0",
    convertToUnits(lqValue || "0")
  );
  const hasNPMTokenAllowance = isGreaterOrEqual(
    npmTokenAllowance || "0",
    convertToUnits(npmValue || "0")
  );

  const canProvideLiquidity =
    lqValue &&
    isValidNumber(lqValue) &&
    hasLqTokenAllowance &&
    hasNPMTokenAllowance;
  const isError =
    lqValue &&
    (!isValidNumber(lqValue) ||
      isGreater(convertToUnits(lqValue || "0"), lqTokenBalance || "0"));

  return {
    lqTokenBalance,
    npmBalance,
    hasLqTokenAllowance,
    hasNPMTokenAllowance,
    canProvideLiquidity,
    isError,
    lqApproving,
    npmApproving,
    providing,
    handleLqTokenApprove,
    handleNPMTokenApprove,
    handleProvide,
    podSymbol,
  };
};
