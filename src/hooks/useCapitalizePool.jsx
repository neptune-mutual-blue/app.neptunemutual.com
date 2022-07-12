import { useState } from "react";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useTxToast } from "@/src/hooks/useTxToast";
import { registry, utils } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { t } from "@lingui/macro";
import {
  STATUS,
  TransactionHistory,
} from "@/src/services/transactions/transaction-history";
import { METHODS } from "@/src/services/transactions/const";
import { getActionMessage } from "@/src/helpers/notification";

export const useCapitalizePool = ({ coverKey, productKey, incidentDate }) => {
  const [capitalizing, setCapitalizing] = useState(false);

  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const { requiresAuth } = useAuthValidation();

  const txToast = useTxToast();
  const { notifyError } = useErrorNotifier();
  const { invoke } = useInvokeMethod();

  const capitalize = async (onSuccess = (f) => f) => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    setCapitalizing(true);
    const cleanup = () => {
      setCapitalizing(false);
    };

    const handleError = (err) => {
      notifyError(err, t`Capitalize Pool`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const instance = await registry.Reassurance.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.POOL_CAPITALIZE,
          status: STATUS.PENDING,
        });

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.POOL_CAPITALIZE, STATUS.PENDING)
              .title,
            success: getActionMessage(METHODS.POOL_CAPITALIZE, STATUS.SUCCESS)
              .title,
            failure: getActionMessage(METHODS.POOL_CAPITALIZE, STATUS.FAILED)
              .title,
          },
          {
            onTxSuccess: () => {
              onSuccess();
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.CLAIM_COVER_APPROVE,
                status: STATUS.SUCCESS,
              });
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.CLAIM_COVER_APPROVE,
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

      const productKeyArg = productKey || utils.keyUtil.toBytes32("");
      const args = [coverKey, productKeyArg, incidentDate];
      invoke({
        instance,
        methodName: "capitalizePool",
        args,
        onTransactionResult,
        onRetryCancel,
        onError,
      });
    } catch (err) {
      handleError(err);
      cleanup();
    }
  };

  return {
    capitalize,
    capitalizing,
  };
};
