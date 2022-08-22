import { getNetworkId } from "@/src/config/environment";
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
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const networkId = getNetworkId();
      const data = await fetchProtocolDayData(networkId, getQuery()).catch(
        (err) => console.error(err)
      );

      if (!data || !data.protocolDayDatas) return;

      setData(data.protocolDayDatas);
    })();
  }, []);

  return data;
};
