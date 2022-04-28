import { ROWS_PER_PAGE } from "@/src/config/constants";
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

export const useLiquidityTxs = () => {
  const [data, setData] = useState({
    blockNumber: null,
    liquidityTransactions: [],
  });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [itemsToSkip, setItemsToSkip] = useState(0);

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
        query: getQuery(account, ROWS_PER_PAGE, itemsToSkip),
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.errors || !res.data) {
          return;
        }

        const isLastPage =
          res.data.liquidityTransactions.length === 0 ||
          res.data.liquidityTransactions.length < ROWS_PER_PAGE;

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
  }, [account, itemsToSkip, networkId]);

  const handleShowMore = () => {
    setItemsToSkip((prev) => prev + ROWS_PER_PAGE);
  };

  return {
    handleShowMore,
    hasMore,
    data: {
      blockNumber: data.blockNumber,
      transactions: data.liquidityTransactions,
      totalCount: data.liquidityTransactions.length,
    },
    loading,
  };
};
