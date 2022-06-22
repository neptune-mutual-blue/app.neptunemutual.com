import { getGraphURL } from "@/src/config/environment";
import { useNetwork } from "@/src/context/Network";
import { useState, useEffect } from "react";

export const useProtocolDayData = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { networkId } = useNetwork();

  useEffect(() => {
    let ignore = false;

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
          protocolDayDatas {
            date
            totalLiquidity
          }
        }              
      `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (ignore) return;
        setData(res.data);
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
  }, [networkId]);

  return {
    data: data?.protocolDayDatas,
    loading,
  };
};
