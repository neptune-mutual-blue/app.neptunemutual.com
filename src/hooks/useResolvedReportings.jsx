import { useState, useEffect } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useNetwork } from "@/src/context/Network";

export const useResolvedReportings = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { networkId } = useNetwork();

  useEffect(() => {
    if (!networkId) {
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
            orderBy: incidentDate
            orderDirection: desc
            where:{
              resolved: true
            }
          ) {
            id
            key
            incidentDate
            resolutionDeadline
            resolved
            emergencyResolved
            emergencyResolveTransaction{
              timestamp
            }
            resolveTransaction{
              timestamp
            }
            finalized
            status
            resolutionTimestamp
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
  }, [networkId]);

  return {
    data: {
      incidentReports: data?.incidentReports || [],
    },
    loading,
  };
};
