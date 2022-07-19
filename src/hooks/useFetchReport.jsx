import { useState, useEffect } from "react";
import { useQuery } from "@/src/hooks/useQuery";

const getQuery = (reportId) => {
  return `
  {
    incidentReport(
        id: "${reportId}"
    ) {
      id
      coverKey
      productKey
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
  `;
};

export const useFetchReport = ({ coverKey, productKey, incidentDate }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { data: graphData, refetch } = useQuery();

  useEffect(() => {
    let ignore = false;

    if (!graphData || ignore) return;
    setData(graphData.incidentReport);

    return () => {
      ignore = true;
    };
  }, [graphData]);

  useEffect(() => {
    let ignore = false;

    if (!coverKey || !incidentDate) {
      return;
    }

    const reportId = `${coverKey}-${productKey}-${incidentDate}`;

    setLoading(true);
    refetch(getQuery(reportId))
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [coverKey, incidentDate, productKey, refetch]);

  const refetchData = async () => {
    const reportId = `${coverKey}-${productKey}-${incidentDate}`;

    setLoading(true);
    refetch(getQuery(reportId))
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    data: { incidentReport: data },
    loading,
    refetch: refetchData,
  };
};
