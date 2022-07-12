import { useState, useEffect } from "react";
import { useQuery } from "@/src/hooks/useQuery";

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
export const useCoverActiveReportings = ({ coverKey }) => {
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

    refetch(getQuery(coverKey))
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [coverKey, refetch]);

  return {
    data,
    loading,
  };
};
