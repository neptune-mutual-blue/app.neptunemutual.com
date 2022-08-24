import { useNetwork } from "@/src/context/Network";
import { useSubgraphFetch } from "@/src/hooks/useSubgraphFetch";
import { useState, useEffect } from "react";

const getQuery = () => {
  return `
  {
    protocolDayDatas {
      date
      totalLiquidity
    }
  }              
`;
};

export const useProtocolDayData = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { networkId } = useNetwork();
  const fetchProtocolDayData = useSubgraphFetch("useProtocolDayData");

  useEffect(() => {
    setLoading(true);

    fetchProtocolDayData(networkId, getQuery())
      .then((_data) => {
        if (!_data) return;
        setData(_data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchProtocolDayData, networkId]);

  return {
    data: data["protocolDayDatas"],
    loading,
  };
};
