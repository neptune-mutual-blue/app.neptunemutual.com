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
    let ignore = false;

    setLoading(true);

    fetchProtocolDayData(networkId, getQuery())
      .then((_data) => {
        if (ignore || !_data) return;
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
