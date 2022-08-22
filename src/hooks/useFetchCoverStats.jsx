import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useNetwork } from "@/src/context/Network";
import { getReplacedString } from "@/utils/string";
import {
  ADDRESS_ONE,
  CoverStatus,
  COVER_STATS_URL,
} from "@/src/config/constants";
import { getStats } from "@/src/services/protocol/cover/stats";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { fetchApi } from "@/src/services/fetchApi.js";

const defaultStats = {
  activeIncidentDate: "0",
  claimPlatformFee: "0",
  activeCommitment: "0",
  isUserWhitelisted: false,
  reporterCommission: "0",
  reportingPeriod: "0",
  requiresWhitelist: false,
  productStatus: "",
  totalPoolAmount: "0",
  availableLiquidity: "0",
};

export const useFetchCoverStats = ({ coverKey, productKey }) => {
  const [info, setInfo] = useState(defaultStats);
  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();

  const fetcher = useCallback(async () => {
    if (!networkId || !coverKey || !productKey) return;

    if (account) {
      // Get data from provider if wallet's connected
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      return getStats(
        networkId,
        coverKey,
        productKey,
        account,
        signerOrProvider.provider
      );
    }

    const url = getReplacedString(COVER_STATS_URL, {
      networkId,
      coverKey,
      productKey,
      account: ADDRESS_ONE,
    });
    // Get data from API if wallet's not connected

    const request = fetchApi(`useFetchCoverStats:: ${url}`);

    const { data } = await request(url);

    return data;
  }, [account, coverKey, library, networkId, productKey]);

  const refetch = useCallback(async () => {
    try {
      const data = await fetcher();

      if (!data) return;

      setInfo({
        activeIncidentDate: data.activeIncidentDate,
        claimPlatformFee: data.claimPlatformFee,
        activeCommitment: data.activeCommitment,
        isUserWhitelisted: data.isUserWhitelisted,
        reporterCommission: data.reporterCommission,
        reportingPeriod: data.reportingPeriod,
        requiresWhitelist: data.requiresWhitelist,
        productStatus: CoverStatus[data.productStatus],
        totalPoolAmount: data.totalPoolAmount,
        availableLiquidity: data.availableLiquidity,
      });
    } catch (error) {
      console.error(error);
    }
  }, [fetcher]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { info, refetch };
};
