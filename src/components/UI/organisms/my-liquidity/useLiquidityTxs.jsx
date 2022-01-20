import { getGraphURL } from "@/src/config/environment";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect, useMemo } from "react";

export const useLiquidityTxs = ({ maxItems }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { chainId, account } = useWeb3React();

  // pagination
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    const transactions = data.liquidityTransactions || [];

    let extraPages = 1;
    if (transactions.length % maxItems === 0) {
      extraPages = 0;
    }
    setMaxPage(Math.floor(transactions.length / maxItems) + extraPages);
  }, [data.liquidityTransactions, maxItems]);

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
        _meta {
          block {
            number
          }
        }
        liquidityTransactions(
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
            name: projectName
          }
          transaction {
            id
            timestamp
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

  const filteredTransactions = useMemo(() => {
    const transactions = data.liquidityTransactions || [];

    return transactions
      ? transactions.slice().slice(maxItems * (page - 1), page * maxItems)
      : [];
  }, [data.liquidityTransactions, maxItems, page]);

  return {
    page,
    maxPage,
    setPage,
    data: {
      blockNumber: data?._meta?.block?.number,
      transactions: filteredTransactions,
      totalCount: (data?.liquidityTransactions || []).length,
    },
    loading,
  };
};
