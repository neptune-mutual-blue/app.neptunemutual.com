import { getGraphURL } from "@/src/config/environment";
import { useAppContext } from "@/src/context/AppWrapper";
import { useState, useEffect } from "react";

export const useRecentVotes = ({ coverKey, incidentDate }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { networkId } = useAppContext();
  useEffect(() => {
    if (!networkId || !coverKey || !incidentDate) {
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
          _meta {
            block {
              number
            }
          }
          votes(
            orderBy: createdAtTimestamp
            orderDirection: desc
            where: {
              key:"${coverKey}"
              incidentDate: "${incidentDate}"
          }) {
            id
            createdAtTimestamp
            voteType
            witness
            stake
            transaction {
              id
              timestamp
            }
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
  }, [coverKey, incidentDate, networkId]);

  return {
    data: {
      blockNumber: data?._meta?.block?.number,
      transactions: data?.votes || [],
      totalCount: (data?.votes || []).length,
    },
    loading,
  };
};
