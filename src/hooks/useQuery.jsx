import { useNetwork } from "@/src/context/Network";
import { useMountedState } from "@/src/hooks/useMountedState";
import { getSubgraphData } from "@/src/services/subgraph";
import { useCallback, useState } from "react";

export const useQuery = () => {
  const [data, setData] = useState(null);
  const isMounted = useMountedState();
  const { networkId } = useNetwork();

  const fetchApi = useCallback(
    async (query) => {
      const data = await getSubgraphData(networkId, query);

      if (!isMounted()) return;
      setData(data);
    },
    [isMounted, networkId]
  );

  return {
    data,
    refetch: fetchApi,
  };
};
