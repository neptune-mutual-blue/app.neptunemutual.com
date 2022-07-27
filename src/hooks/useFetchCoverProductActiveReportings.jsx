import { useState, useEffect } from "react";
import { fetchSubgraph } from "@/src/services/fetchSubgraph";
import { getNetworkId } from "@/src/config/environment";

const getQuery = (coverKey, productKey) => {
  return `
  {
    incidentReports(where: {
      coverKey: "${coverKey}"
      productKey: "${productKey}"
      finalized: false
    }) {
      id
      reporterInfo
      coverKey
      productKey
      incidentDate
    }
  }
  `;
};

const fetchCoverProductActiveReportings = fetchSubgraph(
  "useFetchCoverProductActiveReportings"
);
/**
 *
 * @param {object} param
 * @param {string} param.coverKey
 * @param {string} param.productKey
 * @returns
 */
export const useFetchCoverProductActiveReportings = ({
  coverKey,
  productKey,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productKey && coverKey) {
      setLoading(true);
      fetchCoverProductActiveReportings(
        getNetworkId(),
        getQuery(coverKey, productKey)
      )
        .then(({ incidentReports }) => {
          setData(incidentReports);
        })
        .catch((e) => console.error(`Error: ${e.message}`))
        .finally(() => setLoading(false));
    }
  }, [coverKey, productKey]);

  return {
    data,
    loading,
  };
};
