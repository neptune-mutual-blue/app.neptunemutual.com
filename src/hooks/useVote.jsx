import { useEffect, useState } from "react";
import { AddressZero } from "@ethersproject/constants";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry, governance, config } from "@neptunemutual/sdk";
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
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useApprovalAmount } from "@/src/hooks/useApprovalAmount";

export const useVote = ({ coverKey, value, incidentDate }) => {
  const [balance, setBalance] = useState("0");
  const [allowance, setAllowance] = useState("0");
  const [minStake, setMinStake] = useState("0");
  const [approving, setApproving] = useState(false);
  const [voting, setVoting] = useState(false);

  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();
  const { getApprovalAmount } = useApprovalAmount();
  const { NPMTokenAddress } = useAppConstants();
  const tokenSymbol = useTokenSymbol(NPMTokenAddress);
  const txToast = useTxToast();
  const { notifyError } = useErrorNotifier();

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

      console.log(
        "Could not get an instance of NPM token from the address %s",
        NPMTokenAddress
      );

      let result = await instance.allowance(account, governanceContractAddress);

      setAllowance(result.toString());
    } catch (error) {
      console.error(error);
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

      const minStake = await governance["getFirstReportingStake(bytes32)"](
        coverKey
      );

      if (ignore) return;
      setMinStake(minStake.toString());
    }

    fetchMinStake().catch(console.log);

    return () => (ignore = true);
  }, [account, coverKey, library, networkId]);

  const handleApprove = async () => {
    setApproving(true);
    try {
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
        getApprovalAmount(convertToUnits(value).toString())
      );

      await txToast.push(tx, {
        pending: `Approving ${tokenSymbol} tokens`,
        success: `Approved ${tokenSymbol} tokens Successfully`,
        failure: `Could not approve ${tokenSymbol} tokens`,
      });

      checkAllowance();
    } catch (error) {
      // console.error(error);
      notifyError(error, `approve ${tokenSymbol} tokens`);
    } finally {
      setApproving(false);
    }
  };

  const handleAttest = async () => {
    setVoting(true);

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const { result: tx } = await governance.attest(
        networkId,
        coverKey,
        convertToUnits(value).toString(),
        signerOrProvider
      );

      await txToast.push(tx, {
        pending: "Attesting",
        success: "Attested successfully",
        failure: "Could not attest",
      });
    } catch (err) {
      // console.error(err);
      notifyError(err, "attest");
    } finally {
      setVoting(false);
    }
  };

  const handleRefute = async () => {
    setVoting(true);

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const { result: tx } = await governance.refute(
        networkId,
        coverKey,
        convertToUnits(value).toString(),
        signerOrProvider
      );

      await txToast.push(tx, {
        pending: "Refuting",
        success: "Refuted successfully",
        failure: "Could not refute",
      });
    } catch (err) {
      // console.error(err);
      notifyError(err, "refute");
    } finally {
      setVoting(false);
    }
  };

  const handleDispute = async () => {
    setVoting(true);

    if (!networkId || !account) {
      return;
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.Governance.getInstance(
        networkId,
        signerOrProvider
      );

      const tx = await instance.dispute(
        coverKey,
        incidentDate,
        config.constants.ZERO_BYTES32,
        convertToUnits(value).toString()
      );

      await txToast.push(tx, {
        pending: "Disputing",
        success: "Disputed successfully",
        failure: "Could not dispute",
      });
    } catch (err) {
      // console.error(err);
      notifyError(err, "dispute");
    } finally {
      setVoting(false);
    }
  };

  const canVote =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || "0"));
  const isError =
    value &&
    (!isValidNumber(value) || isGreater(convertToUnits(value || "0"), balance));

  return {
    tokenAddress: NPMTokenAddress,
    tokenSymbol,

    balance,
    minStake,
    approving,
    voting,

    canVote,
    isError,

    handleApprove,
    handleDispute,
    handleAttest,
    handleRefute,
  };
};
