import { useNetwork } from "@/src/context/Network";
import { getSubgraphData } from "@/src/services/subgraph";
import { useState, useEffect } from "react";

export const useProtocolDayData = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { networkId } = useNetwork();

  useEffect(() => {
    let ignore = false;
    const query = `
    {
      protocolDayDatas {
        date
        totalLiquidity
      }
    }              
  `;

    setLoading(true);
    getSubgraphData(networkId, query)
      .then((_data) => {
        if (ignore) return;
        setData(_data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [networkId]);

  return {
    data: data["protocolDayDatas"],
    loading,
  };
};
