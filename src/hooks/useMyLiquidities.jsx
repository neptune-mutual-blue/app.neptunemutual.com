import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { getGraphURL } from "@/src/config/environment";
import { sumOf } from "@/utils/bn";

export const useMyLiquidities = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { chainId, account } = useWeb3React();

  useEffect(() => {
    if (!chainId || !account) {
      return;
    }

    const graphURL = getGraphURL(chainId);

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
          coverUsers(
            where: {
              user: "${account}"
              totalLiquity_gt: "0"
            }
          ) {
            id
            user
            totalLiquity
            totalPODs
            cover {
              id
              projectName
            }
          }
        }        
        `,
      }),
    })
      .then((r) => r.json())
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [account, chainId]);

  const myLiquidities = data?.coverUsers || [];
  const totalLiquidityProvided = sumOf(
    ...myLiquidities.map((x) => x.totalLiquity || "0"),
    "0"
  );

  return {
    data: {
      myLiquidities,
      totalLiquidityProvided,
    },
    loading,
  };
};
