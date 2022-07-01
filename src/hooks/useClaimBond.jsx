import { useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useNetwork } from "@/src/context/Network";
import { t } from "@lingui/macro";
import {
  STATUS,
  TransactionHistory,
} from "@/src/services/transactions/transaction-history";
import { METHODS } from "@/src/services/transactions/const";
import { useAppConstants } from "@/src/context/AppConstants";
import { getActionMessage } from "@/src/helpers/notification";

export const useClaimBond = () => {
  const [claiming, setClaiming] = useState();

  const { NPMTokenSymbol } = useAppConstants();
  const { networkId } = useNetwork();
  const { account, library } = useWeb3React();
  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const handleClaim = async (onTxSuccess) => {
    if (!account || !networkId) {
      return;
    }

    setClaiming(true);
    const cleanup = () => {
      setClaiming(false);
    };
    const handleError = (err) => {
      notifyError(err, t`claim bond`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.BondPool.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.BOND_CLAIM,
          status: STATUS.PENDING,
          data: {
            tokenSymbol: NPMTokenSymbol,
          },
        });

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.BOND_CLAIM, STATUS.PENDING, {
              tokenSymbol: NPMTokenSymbol,
            }).title,
            success: getActionMessage(METHODS.BOND_CLAIM, STATUS.SUCCESS, {
              tokenSymbol: NPMTokenSymbol,
            }).title,
            failure: getActionMessage(METHODS.BOND_CLAIM, STATUS.FAILED, {
              tokenSymbol: NPMTokenSymbol,
            }).title,
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.BOND_CLAIM,
                status: STATUS.SUCCESS,
              });
              onTxSuccess();
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.BOND_CLAIM,
                status: STATUS.FAILED,
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

      invoke({
        instance,
        methodName: "claimBond",
        onError,
        onTransactionResult,
        onRetryCancel,
      });
    } catch (err) {
      handleError(err);
      cleanup();
    }
  };

  return {
    claiming,
    handleClaim,
  };
};
