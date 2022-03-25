import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useTxToast } from "@/src/hooks/useTxToast";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { getUnstakeInfoFor } from "@/src/services/protocol/consensus/info";

const defaultInfo = {
  yes: "0",
  no: "0",
  myYes: "0",
  myNo: "0",
  totalStakeInWinningCamp: "0",
  totalStakeInLosingCamp: "0",
  myStakeInWinningCamp: "0",
  unstaken: "0",
  latestIncidentDate: "0",
  burnRate: "0",
  reporterCommission: "0",
  allocatedReward: "0",
  toBurn: "0",
  toReporter: "0",
  myReward: "0",
  willReceive: "0",
};

export const useUnstakeReportingStake = ({ coverKey, incidentDate }) => {
  const [info, setInfo] = useState(defaultInfo);
  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();

  const txToast = useTxToast();
  const { requiresAuth } = useAuthValidation();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();
  const [unstaking, setUnstaking] = useState(false);

  const fetchInfo = useCallback(async () => {
    if (!networkId || !account) {
      return;
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId);
    const data = await getUnstakeInfoFor(
      networkId,
      coverKey,
      account,
      incidentDate,
      signerOrProvider.provider
    );

    if (!data) {
      return;
    }

    return data;
  }, [account, coverKey, incidentDate, library, networkId]);

  useEffect(() => {
    let ignore = false;

    fetchInfo()
      .then((_info) => {
        if (!_info || ignore) return;

        setInfo(_info);
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [fetchInfo]);

  const unstake = async () => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    setUnstaking(true);
    const cleanup = () => {
      fetchInfo().catch(console.error);
      setUnstaking(false);
    };
    const handleError = (err) => {
      notifyError(err, "Unstake NPM");
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const resolutionContract = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: "Unstaking NPM",
          success: "Unstaked NPM Successfully",
          failure: "Could not unstake NPM",
        });
        cleanup();
      };

      const onRetryCancel = () => {
        cleanup();
      };

      const onError = (err) => {
        handleError(err);
        cleanup();
      };

      const args = [coverKey, incidentDate];
      invoke({
        instance: resolutionContract,
        methodName: "unstake",
        onError,
        onTransactionResult,
        onRetryCancel,
        args,
      });
    } catch (err) {
      cleanup();
      handleError(err);
    }
  };

  const unstakeWithClaim = async () => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    setUnstaking(true);
    const cleanup = () => {
      fetchInfo().catch(console.error);
      setUnstaking(false);
    };

    const handleError = (err) => {
      notifyError(err, "Unstake & claim NPM");
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const resolutionContractAddress = await registry.Resolution.getAddress(
        networkId,
        signerOrProvider
      );

      const resolutionContract = new ethers.Contract(
        resolutionContractAddress,
        ["function unstakeWithClaim(bytes32, uint256)"],
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: "Unstaking & claiming NPM",
          success: "Unstaked & claimed NPM Successfully",
          failure: "Could not unstake & claim NPM",
        });
        cleanup();
      };

      const onRetryCancel = () => {
        cleanup();
      };

      const onError = (err) => {
        handleError(err);
        cleanup();
      };

      const args = [coverKey, incidentDate];
      invoke({
        instance: resolutionContract,
        methodName: "unstakeWithClaim",
        onTransactionResult,
        onRetryCancel,
        onError,
        args,
      });
    } catch (err) {
      handleError(err);
      cleanup();
    }
  };

  return {
    info,
    unstake,
    unstakeWithClaim,
    unstaking,
  };
};
