import { useState, useEffect, useCallback } from "react";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useTxToast } from "@/src/hooks/useTxToast";
import DateLib from "@/lib/date/DateLib";
import { isGreater } from "@/utils/bn";
import { t } from "@lingui/macro";
import { ADDRESS_ONE, VAULT_INFO_URL } from "@/src/config/constants";
import { getReplacedString } from "@/utils/string";

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
};

export const useMyLiquidityInfo = ({ coverKey }) => {
  const [info, setInfo] = useState(defaultInfo);

  const { library, account } = useWeb3React();
  const { networkId } = useNetwork();
  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const fetchInfo = useCallback(async () => {
    if (!networkId || !coverKey) {
      return;
    }

    const handleError = (err) => {
      notifyError(err, t`get vault info`);
    };

    try {
      const response = await fetch(
        getReplacedString(VAULT_INFO_URL, {
          networkId,
          coverKey,
          account: account || ADDRESS_ONE,
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

      const { data } = await response.json();

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
      };
    } catch (err) {
      handleError(err);
    }

    // temporarily removed notifyError dependency as it causes infinite loop to app when an error detected happened in fetch api
    // eslint-disable-next-line
  }, [account, coverKey, networkId]);

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
        await txToast.push(tx, {
          pending: t`Accruing intrest`,
          success: t`Accrued intrest successfully`,
          failure: t`Could not accrue interest`,
        });
      };

      const onRetryCancel = () => {};
      const onError = (err) => {
        handleError(err);
      };

      invoke({
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
