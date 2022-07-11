import { useState, useEffect } from "react";
import { useQuery } from "@/src/hooks/useQuery";

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

export const useFetchCoverProductActiveReportings = ({
  coverKey,
  productKey,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: graphData, refetch } = useQuery();

  useEffect(() => {
    let ignore = false;

    if (!graphData || ignore) return;
    setData(graphData.incidentReports);

    return () => {
      ignore = true;
    };
  }, [graphData]);

  useEffect(() => {
    setLoading(true);

    refetch(getQuery(coverKey, productKey))
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [coverKey, productKey, refetch]);

  return {
    data,
    loading,
  };
};
