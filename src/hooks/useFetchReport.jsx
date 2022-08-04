import { useState, useEffect, useCallback } from "react";
import { fetchSubgraph } from "@/src/services/fetchSubgraph";
import { getNetworkId } from "@/src/config/environment";

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
        timestamp
      }
      disputeTransaction {
        id
        timestamp
      }
      reportIpfsData
      disputeIpfsData
    }
  }
  `;
};

/**
 *
 * @param {object} param
 * @param {string} param.coverKey
 * @param {string} param.productKey
 * @param {string | string[]} param.incidentDate
 * @returns
 */
export const useFetchReport = ({ coverKey, productKey, incidentDate }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const reportId = `${coverKey}-${productKey}-${incidentDate}`;

  const getData = useCallback(() => {
    setLoading(true);

    return fetchSubgraph("useFetchReport")(getNetworkId(), getQuery(reportId))
      .then(({ incidentReport }) => {
        setData(incidentReport);
      })
      .catch((e) => console.error(`Error: ${e.message}`))
      .finally(() => setLoading(false));
  }, [reportId]);

  useEffect(() => {
    getData();
  }, [getData]);

  return {
    data: { incidentReport: data },
    loading,
    refetch: getData,
  };
};
