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

export const defaultStats = {
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
  minReportingStake: "0",
};

export const useFetchCoverStats = ({ coverKey, productKey }) => {
  const [info, setInfo] = useState(defaultStats);
  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();

  const fetcher = useCallback(async () => {
    if (!networkId || !coverKey || !productKey) return;

    let data = null;

    if (account) {
      // Get data from provider if wallet's connected
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      data = await getStats(
        networkId,
        coverKey,
        productKey,
        account,
        signerOrProvider.provider
      );
    } else {
      // Get data from API if wallet's not connected
      const response = await fetch(
        getReplacedString(COVER_STATS_URL, {
          networkId,
          coverKey,
          productKey,
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

    return data;
  }, [account, coverKey, library, networkId, productKey]);

  useEffect(() => {
    let ignore = false;

    async function exec() {
      try {
        const data = await fetcher();

        if (ignore || !data) return;

        setInfo({
          activeIncidentDate:
            data.activeIncidentDate || defaultStats.activeIncidentDate,
          claimPlatformFee:
            data.claimPlatformFee || defaultStats.claimPlatformFee,
          activeCommitment:
            data.activeCommitment || defaultStats.activeCommitment,
          isUserWhitelisted:
            data.isUserWhitelisted || defaultStats.isUserWhitelisted,
          reporterCommission:
            data.reporterCommission || defaultStats.reporterCommission,
          reportingPeriod: data.reportingPeriod || defaultStats.reportingPeriod,
          requiresWhitelist:
            data.requiresWhitelist || defaultStats.requiresWhitelist,
          productStatus:
            CoverStatus[data.productStatus] ||
            CoverStatus[defaultStats.productStatus],
          totalPoolAmount: data.totalPoolAmount || defaultStats.totalPoolAmount,
          availableLiquidity:
            data.availableLiquidity || defaultStats.availableLiquidity,
          minReportingStake:
            data.minReportingStake || defaultStats.minReportingStake,
        });
      } catch (error) {
        console.error(error);
      }
    }

    exec();

    return () => {
      ignore = true;
    };
  }, [fetcher]);

  const refetch = useCallback(async () => {
    try {
      const data = await fetcher();

      if (!data) return;

      setInfo({
        activeIncidentDate:
          data.activeIncidentDate || defaultStats.activeIncidentDate,
        claimPlatformFee:
          data.claimPlatformFee || defaultStats.claimPlatformFee,
        activeCommitment:
          data.activeCommitment || defaultStats.activeCommitment,
        isUserWhitelisted:
          data.isUserWhitelisted || defaultStats.isUserWhitelisted,
        reporterCommission:
          data.reporterCommission || defaultStats.reporterCommission,
        reportingPeriod: data.reportingPeriod || defaultStats.reportingPeriod,
        requiresWhitelist:
          data.requiresWhitelist || defaultStats.requiresWhitelist,
        productStatus:
          CoverStatus[data.productStatus] ||
          CoverStatus[defaultStats.productStatus],
        totalPoolAmount: data.totalPoolAmount || defaultStats.totalPoolAmount,
        availableLiquidity:
          data.availableLiquidity || defaultStats.availableLiquidity,
        minReportingStake:
          data.minReportingStake || defaultStats.minReportingStake,
      });
    } catch (error) {
      console.error(error);
    }
  }, [fetcher]);

  return { info, refetch };
};
