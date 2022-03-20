import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { getGraphURL } from "@/src/config/environment";
import { sumOf } from "@/utils/bn";
import { useNetwork } from "@/src/context/Network";

export const useMyLiquidities = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { networkId } = useNetwork();
  const { account } = useWeb3React();

  useEffect(() => {
    if (!networkId || !account) {
      return;
    }

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
          coverUsers(
            where: {
              user: "${account}"
              totalPODs_gt: "0"
            }
          ) {
            id
            user
            totalLiquidity
            totalPODs
            cover {
              id
            }
          }
        }
        `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account, networkId]);

  const myLiquidities = data?.coverUsers || [];
  const totalLiquidityProvided = sumOf(
    ...myLiquidities.map((x) => x.totalLiquidity || "0"),
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
