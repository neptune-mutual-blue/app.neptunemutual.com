import { useNetwork } from "@/src/context/Network";
import { fetchSubgraph } from "@/src/services/fetchSubgraph";
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

const fetchProtocolDayData = fetchSubgraph("useProtocolDayData");

export const useProtocolDayData = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { networkId } = useNetwork();

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
  }, [networkId]);

  return {
    data: data["protocolDayDatas"],
    loading,
  };
};
