import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useNetwork } from "@/src/context/Network";
import { getReplacedString } from "@/utils/string";
import { CoverStatus, COVER_INFO_URL } from "@/src/config/constants";

const defaultInfo = {
  activeIncidentDate: "",
  claimPlatformFee: "",
  commitment: "",
  isUserWhitelisted: false,
  reporterCommission: "",
  reportingPeriod: "",
  requiresWhitelist: false,
  status: "",
  totalCommitment: "",
  totalPoolAmount: "",
};

export const useFetchCoverInfo = ({ coverKey }) => {
  const [info, setInfo] = useState(defaultInfo);
  const { account } = useWeb3React();
  const { networkId } = useNetwork();

  useEffect(() => {
    async function fetchCoverInfo() {
      if (!networkId || !coverKey || !account) return;

      try {
        const response = await fetch(
          getReplacedString(COVER_INFO_URL, { networkId, coverKey, account }),
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
          }
        );

        const { data } = await response.json();
        setInfo({
          activeIncidentDate: data.activeIncidentDate,
          claimPlatformFee: data.claimPlatformFee,
          commitment: data.commitment,
          isUserWhitelisted: data.isUserWhitelisted,
          reporterCommission: data.reporterCommission,
          reportingPeriod: data.reportingPeriod,
          requiresWhitelist: data.requiresWhitelist,
          status: CoverStatus[data.status],
          totalCommitment: data.totalCommitment,
          totalPoolAmount: data.totalPoolAmount,
        });
      } catch (error) {
        console.error(error);
      }
    }
    fetchCoverInfo();
  }, [account, coverKey, networkId]);

  return info;
};
