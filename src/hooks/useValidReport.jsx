import { useState, useEffect } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useAppContext } from "@/src/context/AppWrapper";

const isValidTimestamp = (_unix) => !!_unix && _unix != "0";

export const useValidReport = ({ start, end, coverKey }) => {
  const [data, setData] = useState({
    incidentReports: [],
  });
  const [loading, setLoading] = useState(false);
  const { networkId } = useAppContext();

  useEffect(() => {
    if (!networkId || !isValidTimestamp(start) || !isValidTimestamp(end)) {
      return;
    }

    const graphURL = getGraphURL(networkId);

    if (!graphURL) {
      return;
    }

    setLoading(true);
    fetch(graphURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: `
        {
          incidentReports(
            where: {
              incidentDate_gt: "${start}",
              incidentDate_lt: "${end}",
              key: "${coverKey}"
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
        `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [coverKey, end, networkId, start]);

  return {
    data: {
      report: data?.incidentReports[0],
    },
    loading,
  };
};
