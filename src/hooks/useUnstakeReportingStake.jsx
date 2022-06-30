import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useTxToast } from "@/src/hooks/useTxToast";
import { registry, utils } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { t } from "@lingui/macro";
import { getReplacedString } from "@/utils/string";
import { ADDRESS_ONE, UNSTAKE_INFO_URL } from "@/src/config/constants";
import { getUnstakeInfoFor } from "@/src/services/protocol/consensus/info";
import {
  STATUS,
  TransactionHistory,
} from "@/src/services/transactions/transaction-history";
import { METHODS } from "@/src/services/transactions/const";
import { useAppConstants } from "@/src/context/AppConstants";
import { getActionMessage } from "@/src/helpers/notification";

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

  const { NPMTokenSymbol } = useAppConstants();

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
          productKey,
          account: ADDRESS_ONE,
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
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.REPORTING_UNSTAKE,
          status: STATUS.PENDING,
          data: {
            tokenSymbol: NPMTokenSymbol,
          },
        });

        await txToast.push(
          tx,
          {
            pending: getActionMessage(
              METHODS.REPORTING_UNSTAKE,
              STATUS.PENDING,
              {
                tokenSymbol: NPMTokenSymbol,
              }
            ).title,
            success: getActionMessage(
              METHODS.REPORTING_UNSTAKE,
              STATUS.SUCCESS,
              {
                tokenSymbol: NPMTokenSymbol,
              }
            ).title,
            failure: getActionMessage(
              METHODS.REPORTING_UNSTAKE,
              STATUS.FAILED,
              {
                tokenSymbol: NPMTokenSymbol,
              }
            ).title,
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.REPORTING_UNSTAKE,
                status: STATUS.SUCCESS,
                data: {
                  tokenSymbol: NPMTokenSymbol,
                },
              });
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.REPORTING_UNSTAKE,
                status: STATUS.FAILED,
                data: {
                  tokenSymbol: NPMTokenSymbol,
                },
              });
            },
          }
        );
        cleanup();
      };

      const onRetryCancel = () => {
        cleanup();
      };

      const onError = (err) => {
        handleError(err);
        cleanup();
      };

      const _productKey = productKey ?? utils.keyUtil.toBytes32("");
      const args = [coverKey, _productKey, incidentDate];
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
      const resolutionContract = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.REPORTING_UNSTAKE_CLAIM,
          status: STATUS.PENDING,
          data: {
            tokenSymbol: NPMTokenSymbol,
          },
        });

        await txToast.push(
          tx,
          {
            pending: getActionMessage(
              METHODS.REPORTING_UNSTAKE_CLAIM,
              STATUS.PENDING,
              {
                tokenSymbol: NPMTokenSymbol,
              }
            ).title,
            success: getActionMessage(
              METHODS.REPORTING_UNSTAKE_CLAIM,
              STATUS.SUCCESS,
              {
                tokenSymbol: NPMTokenSymbol,
              }
            ).title,
            failure: getActionMessage(
              METHODS.REPORTING_UNSTAKE_CLAIM,
              STATUS.FAILED,
              {
                tokenSymbol: NPMTokenSymbol,
              }
            ).title,
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.REPORTING_UNSTAKE_CLAIM,
                status: STATUS.SUCCESS,
                data: {
                  tokenSymbol: NPMTokenSymbol,
                },
              });
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.REPORTING_UNSTAKE_CLAIM,
                status: STATUS.FAILED,
                data: {
                  tokenSymbol: NPMTokenSymbol,
                },
              });
            },
          }
        );
        cleanup();
      };

      const onRetryCancel = () => {
        cleanup();
      };

      const onError = (err) => {
        handleError(err);
        cleanup();
      };

      const _productKey = productKey ?? utils.keyUtil.toBytes32("");
      const args = [coverKey, _productKey, incidentDate];
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
