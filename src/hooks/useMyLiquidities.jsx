import { useState, useEffect } from "react";
import { fetchSubgraph } from "@/src/services/fetchSubgraph";
import { getNetworkId } from "@/src/config/environment";

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

const fetchMyLiquidities = fetchSubgraph("useMyLiquidities");

/**
 *
 * @param {string} account
 * @returns
 */
export const useMyLiquidities = (account) => {
  const [data, setData] = useState({
    myLiquidities: [],
    liquidityList: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setLoading(true);
      fetchMyLiquidities(getNetworkId(), getQuery(account))
        .then(({ userLiquidities }) => {
          const myLiquidities = userLiquidities || [];
          setData({
            myLiquidities,
            liquidityList: myLiquidities.map(
              ({ totalPodsRemaining, cover }) => ({
                podAmount: totalPodsRemaining || "0",
                podAddress: cover.vaults[0].address,
              })
            ),
          });
        })
        .catch((e) => console.error(`Error: ${e.message}`))
        .finally(() => setLoading(false));
    }
  }, [account]);

  return {
    data,
    loading,
  };
};
