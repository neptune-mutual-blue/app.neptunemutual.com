import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useNetwork } from "@/src/context/Network";
import { getReplacedString } from "@/utils/string";
import {
  ADDRESS_ONE,
  CoverStatus,
  COVER_STATS_URL,
} from "@/src/config/constants";

const defaultStats = {
  activeIncidentDate: "0",
  claimPlatformFee: "0",
  activeCommitment: "0",
  isUserWhitelisted: false,
  reporterCommission: "0",
  reportingPeriod: "0",
  requiresWhitelist: false,
  status: "",
  totalPoolAmount: "0",
  availableLiquidity: "0",
};

export const useFetchCoverStats = ({ coverKey }) => {
  const [info, setInfo] = useState(defaultStats);
  const { account } = useWeb3React();
  const { networkId } = useNetwork();

  useEffect(() => {
    async function exec() {
      if (!networkId || !coverKey) return;

      try {
        const response = await fetch(
          getReplacedString(COVER_STATS_URL, {
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

        setInfo({
          activeIncidentDate: data.activeIncidentDate,
          claimPlatformFee: data.claimPlatformFee,
          activeCommitment: data.activeCommitment,
          isUserWhitelisted: data.isUserWhitelisted,
          reporterCommission: data.reporterCommission,
          reportingPeriod: data.reportingPeriod,
          requiresWhitelist: data.requiresWhitelist,
          status: CoverStatus[data.status],
          totalPoolAmount: data.totalPoolAmount,
          availableLiquidity: data.availableLiquidity,
        });
      } catch (error) {
        console.error(error);
      }
    }

    exec();
  }, [account, coverKey, networkId]);

  return info;
};
