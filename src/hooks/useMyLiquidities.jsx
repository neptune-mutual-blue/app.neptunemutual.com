import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { sumOf } from "@/utils/bn";
import { useQuery } from "@/src/hooks/useQuery";

const getQuery = (account) => {
  return `
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
`;
};

export const useMyLiquidities = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { account } = useWeb3React();
  const { data: graphData, refetch } = useQuery();

  useEffect(() => {
    let ignore = false;

    if (!graphData || ignore) return;
    setData(graphData);

    return () => {
      ignore = true;
    };
  }, [graphData]);

  useEffect(() => {
    setLoading(true);

    refetch(getQuery(account))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [account, refetch]);

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
