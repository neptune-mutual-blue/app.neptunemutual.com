import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import {
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
} from "@/utils/bn";
import { useAppContext } from "@/src/context/AppWrapper";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useERC20Allowance } from "@/src/hooks/useERC20Allowance";
import { useBondPoolAddress } from "@/src/hooks/contracts/useBondPoolAddress";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useDebounce } from "@/src/hooks/useDebounce";

export const useCreateBond = ({ info, value }) => {
  const debouncedValue = useDebounce(value, 200);
  const [receiveAmount, setReceiveAmount] = useState("0");

  const [approving, setApproving] = useState(false);
  const [bonding, setBonding] = useState(false);

  const { networkId } = useAppContext();
  const { account, library } = useWeb3React();
  const bondContractAddress = useBondPoolAddress();
  const {
    allowance,
    refetch: updateAllowance,
    approve,
  } = useERC20Allowance(info.lpTokenAddress);
  const { balance, refetch: updateBalance } = useERC20Balance(
    info.lpTokenAddress
  );

  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    updateAllowance(bondContractAddress);
  }, [bondContractAddress, updateAllowance]);

  useEffect(() => {
    let ignore = false;
    if (!networkId || !account || !debouncedValue) return;

    async function updateReceiveAmount() {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.BondPool.getInstance(
        networkId,
        signerOrProvider
      );

      const args = [convertToUnits(debouncedValue).toString()];
      const result = await invoke(
        instance,
        "calculateTokensForLp",
        {},
        notifyError,
        args,
        false
      );

      if (ignore) return;
      setReceiveAmount(result.toString());
    }

    updateReceiveAmount();

    return () => {
      ignore = true;
    };
  }, [networkId, debouncedValue, invoke, notifyError]);

  const handleApprove = async () => {
    try {
      setApproving(true);
      const tx = await approve(
        bondContractAddress,
        convertToUnits(value).toString()
      );

      await txToast.push(tx, {
        pending: "Approving LP tokens",
        success: "Approved LP tokens Successfully",
        failure: "Could not approve LP tokens",
      });

      updateAllowance(bondContractAddress);
    } catch (error) {
      notifyError(error, "approve LP tokens");
    } finally {
      setApproving(false);
    }
  };

  const handleBond = async () => {
    setBonding(true);
    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.BondPool.getInstance(
        networkId,
        signerOrProvider
      );

      //TODO: passing minNpm desired (smart contract)
      const args = [convertToUnits(value).toString(), receiveAmount];
      const tx = await invoke(instance, "createBond", {}, notifyError, args);

      await txToast.push(tx, {
        pending: "Creating bond",
        success: "Created bond successfully",
        failure: "Could not create bond",
      });

      updateBalance();
      updateAllowance(bondContractAddress);
    } catch (err) {
      notifyError(err, "create bond");
    } finally {
      setBonding(false);
    }
  };

  const canBond =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || "0"));
  const isError =
    value &&
    (!isValidNumber(value) || isGreater(convertToUnits(value || "0"), balance));

  return {
    balance,
    receiveAmount,
    approving,
    bonding,

    canBond,
    isError,

    handleApprove,
    handleBond,
  };
};
