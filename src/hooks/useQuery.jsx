import { getGraphURL } from "@/src/config/environment";
import { useNetwork } from "@/src/context/Network";
import { useCallback, useEffect, useRef, useState } from "react";

export const useQuery = () => {
  const [data, setData] = useState(null);
  const mountedRef = useRef(false);

  const { networkId } = useNetwork();

  const fetchApi = useCallback(
    async (query) => {
      if (!networkId) {
        return;
      }

      const graphURL = getGraphURL(networkId);

      if (!graphURL) {
        return;
      }

      const response = await fetch(graphURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          query: query,
        }),
      });

      if (!response.ok) {
        return;
      }

      const result = await response.json();

      if (result.errors) {
        return;
      }

      if (!mountedRef.current) return;
      setData(result.data);
    },
    [networkId]
  );

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    refetch: fetchApi,
  };
};
