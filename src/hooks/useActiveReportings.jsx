import { useState, useEffect, useCallback } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useNetwork } from "@/src/context/Network";
import { CARDS_PER_PAGE } from "@/src/config/constants";

export const useActiveReportings = () => {
  const [data, setData] = useState({
    incidentReports: [],
  });
  const [loading, setLoading] = useState(false);
  const [itemsToSkip, setItemsToSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { networkId } = useNetwork();

  useEffect(() => {
    let ignore = false;

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
            first: ${CARDS_PER_PAGE}
            orderBy: incidentDate
            orderDirection: desc
            where:{
              finalized: false
            }
          ) {
            id
            coverKey
            productKey
            incidentDate
            resolutionDeadline
            resolved
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
        if (ignore) return;

        if (res.errors || !res.data) {
          return;
        }

        const isLastPage =
          res.data.incidentReports.length === 0 ||
          res.data.incidentReports.length < CARDS_PER_PAGE;

        if (isLastPage) {
          setHasMore(false);
        }

        setData((prev) => ({
          incidentReports: [
            ...prev.incidentReports,
            ...res.data.incidentReports,
          ],
        }));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });

      return () => {
        ignore = true;
      };
  }, [itemsToSkip, networkId]);

  const handleShowMore = useCallback(() => {
    setItemsToSkip((prev) => prev + CARDS_PER_PAGE);
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
