import { useState, useEffect } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useNetwork } from "@/src/context/Network";

const isValidTimestamp = (_unix) => !!_unix && _unix != "0";

export const useValidReport = ({ start, end, coverKey, productKey }) => {
  const [data, setData] = useState({
    incidentReports: [],
  });
  const [loading, setLoading] = useState(false);
  const { networkId } = useNetwork();

  useEffect(() => {
    let ignore = false;

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
        `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (ignore) return;
        setData(res.data);
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
