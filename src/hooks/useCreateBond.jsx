import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import {
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
  weiAsAmount,
} from "@/utils/bn";
import { useAppContext } from "@/src/context/AppWrapper";
import { useDebouncedEffect } from "@/src/hooks/useDebouncedEffect";
import { useTxToast } from "@/src/hooks/useTxToast";

export const useCreateBond = ({ info, value }) => {
  const [balance, setBalance] = useState("0");
  const [receiveAmount, setReceiveAmount] = useState("0");
  const [allowance, setAllowance] = useState("0");
  const [approving, setApproving] = useState(false);
  const [bonding, setBonding] = useState(false);

  const { chainId, account, library } = useWeb3React();
  const { networkId } = useAppContext();

  const txToast = useTxToast();

  const checkAllowance = async () => {
    try {
      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      const instance = registry.IERC20.getInstance(
        chainId,
        info.lpTokenAddress,
        signerOrProvider
      );

      const bondContractAddress = await registry.BondPool.getAddress(
        chainId,
        signerOrProvider
      );

      if (!instance) {
        console.log(
          "Could not get an instance of LP token from the address %s",
          info.lpTokenAddress
        );
      }
      let result = await instance.allowance(account, bondContractAddress);

      setAllowance(result.toString());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!chainId || !account || !info.lpTokenAddress) return;

    let ignore = false;
    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    checkAllowance();

    const instance = registry.IERC20.getInstance(
      chainId,
      info.lpTokenAddress,
      signerOrProvider
    );

    instance
      .balanceOf(account)
      .then((bal) => {
        if (ignore) return;
        setBalance(bal.toString());
      })
      .catch((e) => {
        console.error(e);
        if (ignore) return;
      });

    return () => (ignore = true);
  }, [account, chainId, library, info.lpTokenAddress]);

  useDebouncedEffect(
    () => {
      if (!networkId || !value) return;

      async function updateReceiveAmount() {
        const instance = await registry.BondPool.getInstance(networkId);
        const result = await instance.calculateTokensForLp(
          convertToUnits(value).toString()
        );

        setReceiveAmount(weiAsAmount(result.toString()));
      }

      updateReceiveAmount();
    },
    [networkId, value],
    100
  );

  const handleApprove = async () => {
    try {
      setApproving(true);
      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      const bondContractAddress = await registry.BondPool.getAddress(
        chainId,
        signerOrProvider
      );

      const instance = registry.IERC20.getInstance(
        chainId,
        info.lpTokenAddress,
        signerOrProvider
      );

      const tx = await instance.approve(
        bondContractAddress,
        convertToUnits(value).toString()
      );

      await txToast.push(tx, {
        pending: "Approving LP tokens",
        success: "Approved LP tokens Successfully",
        failure: "Could not approve LP tokens",
      });

      setApproving(false);
      checkAllowance();
    } catch (error) {
      setApproving(false);
    }
  };

  const handleBond = async () => {
    setBonding(true);
    try {
      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      const instance = await registry.BondPool.getInstance(
        chainId,
        signerOrProvider
      );

      //TODO: passing minNpm desired (smart contract)
      let tx = await instance.createBond(
        convertToUnits(value).toString(),
        convertToUnits(value).toString()
      );

      await txToast.push(tx, {
        pending: "Creating bond",
        success: "Created bond successfully",
        failure: "Could not create bond",
      });
    } catch (err) {
      console.error(err);
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
