import { useEffect, useState } from "react";
import { AddressZero } from "@ethersproject/constants";
import { useWeb3React } from "@web3-react/core";
import { registry, governance } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import {
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
} from "@/utils/bn";
import { useAppContext } from "@/src/context/AppWrapper";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useAppConstants } from "@/src/context/AppConstants";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";

export const useReportIncident = ({ coverKey, value }) => {
  const [balance, setBalance] = useState("0");
  const [allowance, setAllowance] = useState("0");
  const [minStake, setMinStake] = useState("0");
  const [approving, setApproving] = useState(false);
  const [reporting, setReporting] = useState(false);

  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();
  const { NPMTokenAddress } = useAppConstants();
  const tokenSymbol = useTokenSymbol(NPMTokenAddress);
  const txToast = useTxToast();

  const checkAllowance = async () => {
    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const instance = registry.IERC20.getInstance(
        networkId,
        NPMTokenAddress,
        signerOrProvider
      );

      const governanceContractAddress = await registry.Governance.getAddress(
        networkId,
        signerOrProvider
      );

      if (!instance) {
        console.log("No instance found");
      }

      let result = await instance.allowance(account, governanceContractAddress);

      setAllowance(result.toString());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!networkId || !account || !NPMTokenAddress) return;

    let ignore = false;
    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    checkAllowance();

    const instance = registry.IERC20.getInstance(
      networkId,
      NPMTokenAddress,
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
  }, [account, networkId, library, NPMTokenAddress]);

  useEffect(() => {
    if (!networkId) return;

    let ignore = false;
    async function fetchMinStake() {
      const signerOrProvider = getProviderOrSigner(
        library,
        account || AddressZero,
        networkId
      );

      const governance = await registry.Governance.getInstance(
        networkId,
        signerOrProvider
      );

      const minStake = await governance.getFirstReportingStake(coverKey);

      if (ignore) return;
      setMinStake(minStake.toString());
    }

    fetchMinStake().catch(console.log);

    return () => (ignore = true);
  }, [account, coverKey, library, networkId]);

  const handleApprove = async () => {
    try {
      setApproving(true);
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const governanceContractAddress = await registry.Governance.getAddress(
        networkId,
        signerOrProvider
      );

      const instance = registry.IERC20.getInstance(
        networkId,
        NPMTokenAddress,
        signerOrProvider
      );

      const tx = await instance.approve(
        governanceContractAddress,
        convertToUnits(value).toString()
      );

      await txToast.push(tx, {
        pending: `Approving ${tokenSymbol} tokens`,
        success: `Approved ${tokenSymbol} tokens Successfully`,
        failure: `Could not approve ${tokenSymbol} tokens`,
      });

      setApproving(false);
      checkAllowance();
    } catch (error) {
      setApproving(false);
    }
  };

  const handleReport = async (payload) => {
    setReporting(true);

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const {
        result: { tx },
      } = await governance.report(
        networkId,
        coverKey,
        payload,
        signerOrProvider
      );

      await txToast.push(tx, {
        pending: "Reporting incident",
        success: "Reported incident successfully",
        failure: "Could not report incident",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setReporting(false);
    }
  };

  const canReport =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || "0"));
  const isError =
    value &&
    (!isValidNumber(value) || isGreater(convertToUnits(value || "0"), balance));

  return {
    tokenAddress: NPMTokenAddress,
    tokenSymbol,
    minStake,

    balance,
    approving,
    reporting,

    canReport,
    isError,

    handleApprove,
    handleReport,
  };
};
