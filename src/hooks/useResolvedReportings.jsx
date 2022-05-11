import { useState, useEffect, useCallback } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useNetwork } from "@/src/context/Network";
import { COVERS_PER_PAGE } from "@/src/config/constants";

export const useResolvedReportings = () => {
  const [data, setData] = useState({
    incidentReports: [],
  });
  const [loading, setLoading] = useState(false);
  const [itemsToSkip, setItemsToSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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
            skip: ${itemsToSkip}
            first: ${COVERS_PER_PAGE}
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
        if (res.errors || !res.data) {
          return;
        }

        const { incidentReports } = res.data;

        setHasMore(
          incidentReports.length > itemsToSkip || incidentReports.length !== 0
        );

        setData((prev) => ({
          incidentReports: [...prev.incidentReports, ...incidentReports],
        }));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [itemsToSkip, networkId]);

  const handleShowMore = useCallback(() => {
    setItemsToSkip((prev) => prev + COVERS_PER_PAGE);
  }, []);

  return {
    handleShowMore,
    hasMore,
    data: {
      incidentReports: data.incidentReports,
    },
    loading,
  };
};
