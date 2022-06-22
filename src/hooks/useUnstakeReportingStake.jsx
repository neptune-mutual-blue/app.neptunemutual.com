import { Contract } from "@ethersproject/contracts";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useTxToast } from "@/src/hooks/useTxToast";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { t } from "@lingui/macro";
import { getReplacedString } from "@/utils/string";
import { UNSTAKE_INFO_URL } from "@/src/config/constants";
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

export const useUnstakeReportingStake = ({
  coverKey,
  productKey,
  incidentDate,
}) => {
  const [info, setInfo] = useState(defaultInfo);
  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();

  const txToast = useTxToast();
  const { requiresAuth } = useAuthValidation();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();
  const [unstaking, setUnstaking] = useState(false);

  const fetchInfo = useCallback(async () => {
    if (!networkId || !coverKey) {
      return;
    }

    let data;
    if (account) {
      // Get data from provider if wallet's connected
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      data = await getUnstakeInfoFor(
        networkId,
        coverKey,
        productKey,
        account,
        incidentDate,
        signerOrProvider.provider
      );
    } else {
      // Get data from API if wallet's not connected
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

      if (!response.ok) {
        return;
      }

      data = (await response.json()).data;
    }

    return data;
  }, [networkId, coverKey, account, library, productKey, incidentDate]);

  useEffect(() => {
    let ignore = false;

    fetchInfo()
      .then((data) => {
        if (ignore || !data) {
          return;
        }

        setInfo(data);
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
      notifyError(err, t`Unstake NPM`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const resolutionContract = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: t`Unstaking NPM`,
          success: t`Unstaked NPM Successfully`,
          failure: t`Could not unstake NPM`,
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

      const productKey = null;
      const args = [coverKey, productKey, incidentDate];
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
      notifyError(err, t`Unstake & claim NPM`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const resolutionContractAddress = await registry.Resolution.getAddress(
        networkId,
        signerOrProvider
      );

      const resolutionContract = new Contract(
        resolutionContractAddress,
        ["function unstakeWithClaim(bytes32, uint256)"],
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: t`Unstaking & claiming NPM`,
          success: t`Unstaked & claimed NPM Successfully`,
          failure: t`Could not unstake & claim NPM`,
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

      const productKey = null;
      const args = [coverKey, productKey, incidentDate];
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
