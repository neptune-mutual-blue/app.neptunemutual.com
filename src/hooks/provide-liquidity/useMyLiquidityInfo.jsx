import { useState, useEffect, useCallback } from "react";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useTxPoster } from "@/src/context/TxPoster";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useTxToast } from "@/src/hooks/useTxToast";
import DateLib from "@/lib/date/DateLib";
import { isGreater } from "@/utils/bn";
import { t } from "@lingui/macro";
import { ADDRESS_ONE, VAULT_INFO_URL } from "@/src/config/constants";
import { getReplacedString } from "@/utils/string";
import { getInfo } from "@/src/services/protocol/vault/info";
import { METHODS } from "@/src/services/transactions/const";
import {
  STATUS,
  TransactionHistory,
} from "@/src/services/transactions/transaction-history";
import { getActionMessage } from "@/src/helpers/notification";

const defaultInfo = {
  withdrawalOpen: "0",
  withdrawalClose: "0",
  totalReassurance: "0",
  vault: "",
  stablecoin: "",
  podTotalSupply: "0",
  myPodBalance: "0",
  vaultStablecoinBalance: "0",
  amountLentInStrategies: "0",
  myShare: "0",
  myUnrealizedShare: "0",
  totalLiquidity: "0",
  myStablecoinBalance: "0",
  stablecoinTokenSymbol: "",
  vaultTokenDecimals: "0",
  vaultTokenSymbol: "",
  minStakeToAddLiquidity: "0",
  myStake: "0",
  isAccrualComplete: true,
};

export const useMyLiquidityInfo = ({ coverKey }) => {
  const [info, setInfo] = useState(defaultInfo);

  const { library, account } = useWeb3React();
  const { networkId } = useNetwork();
  const txToast = useTxToast();
  const { writeContract } = useTxPoster();
  const { notifyError } = useErrorNotifier();

  const fetchInfo = useCallback(async () => {
    if (!networkId || !coverKey) {
      return;
    }

    const handleError = (err) => {
      notifyError(err, t`get vault info`);
    };

    try {
      let data;

      if (account) {
        // Get data from provider if wallet's connected
        const signerOrProvider = getProviderOrSigner(
          library,
          account,
          networkId
        );
        data = await getInfo(
          networkId,
          coverKey,
          account,
          signerOrProvider.provider
        );
      } else {
        // Get data from API if wallet's not connected
        const response = await fetch(
          getReplacedString(VAULT_INFO_URL, {
            networkId,
            coverKey,
            account: ADDRESS_ONE,
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

      if (!data || Object.keys(data).length === 0) {
        return;
      }

      return {
        withdrawalOpen: data.withdrawalStarts,
        withdrawalClose: data.withdrawalEnds,
        totalReassurance: data.totalReassurance,
        vault: data.vault,
        stablecoin: data.stablecoin,
        podTotalSupply: data.podTotalSupply,
        myPodBalance: data.myPodBalance,
        vaultStablecoinBalance: data.vaultStablecoinBalance,
        amountLentInStrategies: data.amountLentInStrategies,
        myShare: data.myShare,
        myUnrealizedShare: data.myUnrealizedShare,
        totalLiquidity: data.totalLiquidity,
        myStablecoinBalance: data.myStablecoinBalance,
        stablecoinTokenSymbol: data.stablecoinTokenSymbol,
        vaultTokenDecimals: data.vaultTokenDecimals,
        vaultTokenSymbol: data.vaultTokenSymbol,
        minStakeToAddLiquidity: data.minStakeToAddLiquidity,
        myStake: data.myStake,
        isAccrualComplete: data.isAccrualComplete,
      };
    } catch (err) {
      handleError(err);
    }
  }, [account, coverKey, library, networkId, notifyError]);

  useEffect(() => {
    let ignore = false;

    fetchInfo()
      .then((_info) => {
        if (ignore || !_info) return;
        setInfo(_info);
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [fetchInfo]);

  const updateInfo = useCallback(() => {
    fetchInfo()
      .then((_info) => {
        if (!_info) return;
        setInfo(_info);
      })
      .catch(console.error);
  }, [fetchInfo]);

  const accrueInterest = async () => {
    const handleError = (err) => {
      notifyError(err, t`accrue interest`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.Vault.getInstance(
        networkId,
        coverKey,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        TransactionHistory.push({
          hash: tx.hash,
          methodName: METHODS.LIQUIDITY_INFO,
          status: STATUS.PENDING,
        });

        await txToast.push(
          tx,
          {
            pending: getActionMessage(METHODS.LIQUIDITY_INFO, STATUS.PENDING)
              .title,
            success: getActionMessage(METHODS.LIQUIDITY_INFO, STATUS.SUCCESS)
              .title,
            failure: getActionMessage(METHODS.LIQUIDITY_INFO, STATUS.FAILED)
              .title,
          },
          {
            onTxSuccess: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.LIQUIDITY_INFO,
                status: STATUS.SUCCESS,
              });
            },
            onTxFailure: () => {
              TransactionHistory.push({
                hash: tx.hash,
                methodName: METHODS.LIQUIDITY_INFO,
                status: STATUS.FAILED,
              });
            },
          }
        );
      };

      const onRetryCancel = () => {};
      const onError = (err) => {
        handleError(err);
      };

      writeContract({
        instance,
        methodName: "accrueInterest",
        onTransactionResult,
        onRetryCancel,
        onError,
      });
    } catch (err) {
      handleError(err);
    }
  };

  const now = DateLib.unix();
  const isWithdrawalWindowOpen =
    account &&
    isGreater(now, info.withdrawalOpen) &&
    isGreater(info.withdrawalClose, now);

  return {
    info,

    isWithdrawalWindowOpen: isWithdrawalWindowOpen,
    accrueInterest,

    refetch: updateInfo,
  };
};
