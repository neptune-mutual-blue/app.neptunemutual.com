import { getGraphURL } from "@/src/config/environment";
import { useNetwork } from "@/src/context/Network";
import { useState, useEffect } from "react";

export const useRecentVotes = ({ coverKey, incidentDate, limit, page }) => {
  const [data, setData] = useState({
    votes: [],
    blockNumber: null,
  });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { networkId } = useNetwork();
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
            skip: ${limit * (page - 1)}
            first: ${limit} 
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
        if (res.errors || !res.data) {
          return;
        }

        const isLastPage =
          res.data.votes.length === 0 || res.data.votes.length < limit;

        if (isLastPage) {
          setHasMore(false);
        }

        setData((prev) => ({
          blockNumber: res.data._meta.block.number,
          votes: [...prev.votes, ...res.data.votes],
        }));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [coverKey, incidentDate, limit, networkId, page]);

  return {
    data: {
      blockNumber: data.blockNumber,
      transactions: data?.votes || [],
    },
    loading,
    hasMore,
  };
};
