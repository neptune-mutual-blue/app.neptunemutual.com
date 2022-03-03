import { getGraphURL } from "@/src/config/environment";
import { useAppContext } from "@/src/context/AppWrapper";
import { useCallback, useEffect, useRef, useState } from "react";

export const useQuery = () => {
  const [data, setData] = useState(null);
  const mountedRef = useRef(false);

  const { networkId } = useAppContext();

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
