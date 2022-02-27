import { useState, useEffect } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useAppContext } from "@/src/context/AppWrapper";

const defaultData = [];

export const useFetchCoverActiveReportings = ({ coverKey }) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const { networkId } = useAppContext();

  useEffect(() => {
    if (!networkId) {
      return;
    }

    const graphURL = getGraphURL(networkId);

    if (!graphURL || !coverKey) {
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
          incidentReports (where: {
            key: "${coverKey}"
            finalized: false
          }) {
            id
            reporterInfo
          }
        }
        `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res.errors) {
          setData(res.data.incidentReports);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [coverKey, networkId]);

  return {
    data,
    loading,
  };
};
