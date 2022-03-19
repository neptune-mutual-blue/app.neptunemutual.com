import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useTxToast } from "@/src/hooks/useTxToast";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { UNSTAKE_INFO_URL } from "@/src/config/constants";
import { getReplacedString } from "@/utils/string";

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
  const mountedRef = useRef(false);
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

    const response = await fetch(
      getReplacedString(UNSTAKE_INFO_URL, {
        networkId,
        coverKey,
        account,
        incidentDate,
      }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );

    const { data } = await response.json();

    if (!mountedRef.current || !data) {
      return;
    }

    setInfo({
      ...data,
    });
  }, [account, coverKey, incidentDate, networkId]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    fetchInfo().catch(console.error);
  }, [fetchInfo]);

  const unstake = async () => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    try {
      setUnstaking(true);
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

        fetchInfo().catch(console.error);
        setUnstaking(false);
      };

      const args = [coverKey, incidentDate];
      invoke({
        instance: resolutionContract,
        methodName: "unstake",
        catcher: notifyError,
        onTransactionResult,
        args,
      });
    } catch (err) {
      setUnstaking(false);
      notifyError(err, "Unstake NPM");
    }
  };

  const unstakeWithClaim = async () => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    try {
      setUnstaking(true);
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

        fetchInfo().catch(console.error);
        setUnstaking(false);
      };

      const args = [coverKey, incidentDate];
      invoke({
        instance: resolutionContract,
        methodName: "unstakeWithClaim",
        catcher: notifyError,
        onTransactionResult,
        args,
      });
    } catch (err) {
      notifyError(err, "Unstake & claim NPM");
      setUnstaking(false);
    }
  };

  return {
    info,
    unstake,
    unstakeWithClaim,
    unstaking,
  };
};
