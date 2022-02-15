import { useState, useEffect } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useAppContext } from "@/src/context/AppWrapper";

export const useFetchReport = (reportId) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { networkId } = useAppContext();

  useEffect(() => {
    if (!networkId || !reportId) {
      return;
    }

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
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [networkId, reportId]);

  return {
    data: {
      incidentReport: data?.incidentReport,
    },
    loading,
  };
};
