import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useQuery } from "@/src/hooks/useQuery";

const getQuery = (account) => {
  return `
{
  userLiquidities(
    where: {
      account: "${account}"
      totalPodsRemaining_gt: "0"
    }
  ) {
    id
    account
    totalPodsRemaining
    cover {
      id
      coverKey
      vaults {
        tokenSymbol
        tokenDecimals
        address
      }
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

  const myLiquidities = data?.userLiquidities || [];
  const liquidityList = myLiquidities.map((x) => ({
    podAmount: x.totalPodsRemaining || "0",
    podAddress: x.cover.vaults[0].address,
  }));

  return {
    data: {
      myLiquidities,
      liquidityList,
    },
    loading,
  };
};
