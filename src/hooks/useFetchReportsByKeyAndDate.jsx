import { useState, useEffect } from "react";
import { fetchSubgraph } from "@/src/services/fetchSubgraph";
import { getNetworkId } from "@/src/config/environment";

const getQuery = (coverKey, incidentDate) => {
  return `
  {
    incidentReports (
      where: {
        coverKey: "${coverKey}"
        incidentDate: "${incidentDate}"
        decision: true
        resolved: true
      }
    ) {
      id
      claimExpiresAt
    }
  }

  `;
};

const fetchReportsByKeyAndDate = fetchSubgraph("useFetchReportsByKeyAndDate");
/**
 *
 * @param {object} param
 * @param {string} param.coverKey
 * @param {string | string[]} param.incidentDate
 * @returns
 */
export const useFetchReportsByKeyAndDate = ({ coverKey, incidentDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coverKey && incidentDate) {
      setLoading(true);
      fetchReportsByKeyAndDate(getNetworkId(), getQuery(coverKey, incidentDate))
        .then(({ incidentReports }) => {
          setData(incidentReports);
        })
        .catch((e) => console.error(`Error: ${e.message}`))
        .finally(() => setLoading(false));
    }
  }, [coverKey, incidentDate]);

  return {
    data,
    loading,
  };
};
