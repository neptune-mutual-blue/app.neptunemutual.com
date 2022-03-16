import { useState, useEffect } from "react";
import { useQuery } from "@/src/hooks/useQuery";

const getQuery = (coverKey, incidentDate) => {
  return `
  {
    incidentReports (
      where: {
        key: "${coverKey}"
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

export const useFetchReportsByKeyAndDate = ({ coverKey, incidentDate }) => {
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
    let ignore = false;

    if (!coverKey || !incidentDate) {
      return;
    }

    setLoading(true);
    refetch(getQuery(coverKey, incidentDate))
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
  }, [coverKey, incidentDate, refetch]);

  return {
    data,
    loading,
  };
};
