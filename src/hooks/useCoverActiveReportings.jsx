import { useState, useEffect } from "react";
import { fetchSubgraph } from "@/src/services/fetchSubgraph";

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

const fetchCoverActiveReportings = fetchSubgraph("useCoverActiveReportings");

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

  useEffect(() => {
    if (coverKey) {
      setLoading(true);
      fetchCoverActiveReportings(getQuery(coverKey))
        .then(({ incidentReports }) => setData(incidentReports))
        .catch((e) => console.error(`Error: ${e.message}`))
        .finally(() => setLoading(false));
    }
  }, [coverKey]);

  return {
    data,
    loading,
  };
};
