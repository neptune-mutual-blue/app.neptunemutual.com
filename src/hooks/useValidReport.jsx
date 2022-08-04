import { useState, useEffect } from "react";
import { useNetwork } from "@/src/context/Network";
import { fetchSubgraph } from "@/src/services/fetchSubgraph";

const isValidTimestamp = (_unix) => !!_unix && _unix != "0";

const getQuery = (start, end, coverKey, productKey) => {
  return `
  {
    incidentReports(
      where: {
        incidentDate_gt: "${start}",
        incidentDate_lt: "${end}",
        coverKey: "${coverKey}"
        productKey: "${productKey}"
      },
      orderBy: incidentDate,
      orderDirection: desc
    ) {
      incidentDate
      resolutionDeadline
      status
      claimBeginsFrom
      claimExpiresAt
    }
  }
  `;
};

export const useValidReport = ({ start, end, coverKey, productKey }) => {
  const [data, setData] = useState({
    incidentReports: [],
  });
  const [loading, setLoading] = useState(false);
  const { networkId } = useNetwork();

  useEffect(() => {
    let ignore = false;

    if (!isValidTimestamp(start) || !isValidTimestamp(end)) {
      return;
    }

    setLoading(true);

    fetchSubgraph("useValidReport")(
      networkId,
      getQuery(start, end, coverKey, productKey)
    )
      .then((_data) => {
        if (ignore || !_data) return;
        setData(_data);
      })
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
  }, [coverKey, end, networkId, productKey, start]);

  return {
    data: {
      report: data?.incidentReports[0],
    },
    loading,
  };
};
