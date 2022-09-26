import { useState, useEffect } from "react";
import { getNetworkId } from "@/src/config/environment";
import { useSubgraphFetch } from "@/src/hooks/useSubgraphFetch";

const getQuery = (coverKey) => {
  return `
  {
    incidentReports(where: {
      coverKey: "${coverKey}"
      finalized: false
    }) {
      id
      status
      productKey
      incidentDate
    }
  }
  `;
};

// TODO: Instead we could expose `isCoverNormalInternal` from smart contracts
/**
 *
 * @param {object} param
 * @param {string} param.coverKey
 * @returns
 */
export const useCoverActiveReportings = ({ coverKey }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchCoverActiveReportings = useSubgraphFetch(
    "useCoverActiveReportings"
  );

  useEffect(() => {
    if (coverKey) {
      setLoading(true);
      fetchCoverActiveReportings(getNetworkId(), getQuery(coverKey))
        .then(({ incidentReports }) => setData(incidentReports))
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [coverKey, fetchCoverActiveReportings]);

  return {
    data,
    loading,
  };
};
