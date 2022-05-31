import { getGraphURL } from "@/src/config/environment";
import { useNetwork } from "@/src/context/Network";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";

const getQuery = (account, limit, skip) => {
  return `
  {
    _meta {
      block {
        number
      }
    }
    liquidityTransactions(
      skip: ${skip}
      first: ${limit}, 
      orderBy: createdAtTimestamp
      orderDirection: desc
      where: {account: "${account}"}
    ) {
      type
      key
      account
      liquidityAmount
      podAmount
      vault{
        id
        tokenSymbol
      }
      cover {
        id
      }
      transaction {
        id
        timestamp
      }
    }
  }
  `;
};

export const useLiquidityTxs = ({ limit, page }) => {
  const [data, setData] = useState({
    blockNumber: null,
    liquidityTransactions: [],
  });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
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
        query: getQuery(account, limit, limit * (page - 1)),
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.errors || !res.data) {
          return;
        }

        const isLastPage =
          res.data.liquidityTransactions.length === 0 ||
          res.data.liquidityTransactions.length < limit;

        if (isLastPage) {
          setHasMore(false);
        }

        //setData(res.data);
        setData((prev) => ({
          blockNumber: res.data._meta.block.number,
          liquidityTransactions: [
            ...prev.liquidityTransactions,
            ...res.data.liquidityTransactions,
          ],
        }));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account, limit, networkId, page]);

  return {
    hasMore,
    data: {
      blockNumber: data.blockNumber,
      transactions: data.liquidityTransactions,
      totalCount: data.liquidityTransactions.length,
    },
    loading,
  };
};
