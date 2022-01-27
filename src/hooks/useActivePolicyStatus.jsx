import { useState, useEffect } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useAppContext } from "@/src/context/AppWrapper";

export const useActivePolicyStatus = ({ coverKey, expiresOn }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { networkId } = useAppContext();

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
              key: "${coverKey}"
              incidentDate_lte: "${expiresOn}"
            }
          ) {
            id
            key
            incidentDate
            resolutionTimestamp
            resolved
            finalized
            status
          }
        }        
        `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [coverKey, expiresOn, networkId]);

  return {
    data: {
      statuses: (data?.incidentReports || []).map((x) => x.status),
      reports: data?.incidentReports || [],
    },
    loading,
  };
};
