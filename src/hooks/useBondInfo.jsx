import { useCallback, useEffect, useState } from "react";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

import { useNetwork } from "@/src/context/Network";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { ADDRESS_ONE, BOND_INFO_URL } from "@/src/config/constants";
import { getReplacedString } from "@/utils/string";
import { useAppConstants } from "@/src/context/AppConstants";
import { convertToUnits } from "@/utils/bn";

const defaultInfo = {
  lpTokenAddress: "",
  marketPrice: "0",
  discountRate: "0",
  vestingTerm: "0",
  maxBond: "0",
  totalNpmAllocated: "0",
  totalNpmDistributed: "0",
  npmAvailable: "0",
  bondContribution: "0",
  claimable: "0",
  unlockDate: "0",
};

export const useBondInfo = () => {
  const [info, setInfo] = useState(defaultInfo);

  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const { poolsTvl, NPMTokenAddress, getPriceByAddress } = useAppConstants();

  useEffect(() => {
    if (!account && NPMTokenAddress) {
      let price = getPriceByAddress(NPMTokenAddress);
      price = convertToUnits(price).toString();
      setInfo((_info) => ({ ..._info, marketPrice: price }));
    }
  }, [NPMTokenAddress, poolsTvl, account]);

  const fetchBondInfo = useCallback(
    async (onResult) => {
      if (!networkId) {
        return;
      }

      if (!account) {
        try {
          const response = await fetch(
            getReplacedString(BOND_INFO_URL, {
              networkId,
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
          const { data } = await response.json();
          return onResult({
            ...data,
            lpTokenAddress: data.lpToken,
            marketPrice: "0",
          });
        } catch (err) {
          return notifyError(err, "get bond details");
        }
      }

      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      let instance = await registry.BondPool.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = (result) => {
        const [addresses, values] = result;

        const [lpToken] = addresses;
        const [
          marketPrice,
          discountRate,
          vestingTerm,
          maxBond,
          totalNpmAllocated,
          totalNpmDistributed,
          npmAvailable,
          bondContribution,
          claimable,
          unlockDate,
        ] = values;

        onResult({
          lpTokenAddress: lpToken,
          marketPrice: marketPrice.toString(),
          discountRate: discountRate.toString(),
          vestingTerm: vestingTerm.toString(),
          maxBond: maxBond.toString(),
          totalNpmAllocated: totalNpmAllocated.toString(),
          totalNpmDistributed: totalNpmDistributed.toString(),
          npmAvailable: npmAvailable.toString(),
          bondContribution: bondContribution.toString(),
          claimable: claimable.toString(),
          unlockDate: unlockDate.toString(),
        });
      };

      const onRetryCancel = () => {};

      invoke({
        instance,
        methodName: "getInfo",
        args: [account],
        retry: false,
        onTransactionResult,
        onError: notifyError,
        onRetryCancel,
      });
    },
    [account, invoke, library, networkId, notifyError]
  );

  useEffect(() => {
    let ignore = false;

    const onResult = (_info) => {
      if (ignore) return;
      setInfo(_info || defaultInfo);
    };

    fetchBondInfo(onResult).catch(console.error);

    return () => {
      ignore = true;
    };
  }, [fetchBondInfo, account]);

  const updateBondInfo = useCallback(() => {
    const onResult = (_info) => {
      setInfo(_info || defaultInfo);
    };

    fetchBondInfo(onResult).catch(console.error);
  }, [fetchBondInfo]);

  return { info, refetch: updateBondInfo };
};
