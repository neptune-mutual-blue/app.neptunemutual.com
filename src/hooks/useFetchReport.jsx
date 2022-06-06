import { useState, useEffect, useCallback } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useNetwork } from "@/src/context/Network";

export const useFetchReport = ({ coverKey, incidentDate }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { networkId } = useNetwork();

  const fetchApi = useCallback(async () => {
    let ignore = false;

    if (!networkId || !coverKey || !incidentDate) {
      return;
    }

    const reportId = `${coverKey}-${incidentDate}`;
    const graphURL = getGraphURL(networkId);

    if (!graphURL) {
      return;
    }

    setLoading(true);
    fetch(graphURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: `
        {
          incidentReport(
            id: "${reportId}"
          ) {
            id
            key
            incidentDate
            resolutionDeadline
            resolved
            resolveTransaction{
              timestamp
            }
            emergencyResolved
            emergencyResolveTransaction{
              timestamp
            }
            finalized
            status
            decision
            resolutionTimestamp
            claimBeginsFrom
            claimExpiresAt
            reporter
            reporterInfo
            reporterStake
            disputer
            disputerInfo
            disputerStake
            totalAttestedStake
            totalAttestedCount
            totalRefutedStake
            totalRefutedCount
            reportTransaction {
              id
            }
            disputeTransaction {
              id
            }
          }
        }
        `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (ignore) return;
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });

      return () => {
        ignore = true;
      };
  }, [coverKey, incidentDate, networkId]);

  useEffect(() => {
    fetchApi();
  }, [fetchApi]);

  return {
    data: {
      incidentReport: data?.incidentReport,
    },
    loading,
    refetch: fetchApi,
  };
};
