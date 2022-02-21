import { getGraphURL } from "@/src/config/environment";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect, useMemo } from "react";

export const useBondTxs = ({ maxItems }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { chainId, account } = useWeb3React();

  // pagination
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    const transactions = data.bondTransactions || [];

    let extraPages = 1;
    if (transactions.length % maxItems === 0) {
      extraPages = 0;
    }
    setMaxPage(Math.floor(transactions.length / maxItems) + extraPages);
  }, [data.bondTransactions, maxItems]);

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
          bondTransactions(
            orderBy: createdAtTimestamp,
            orderDirection: desc, 
            where: {
              account: "${account}"
            }
          ) {
            type
            account
            npmToVestAmount
            claimAmount
            lpTokenAmount
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
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [account, chainId]);

  const filteredTransactions = useMemo(() => {
    const transactions = data.bondTransactions || [];

    return transactions
      ? transactions.slice().slice(maxItems * (page - 1), page * maxItems)
      : [];
  }, [data.bondTransactions, maxItems, page]);

  return {
    page,
    maxPage,
    setPage,
    data: {
      blockNumber: data?._meta?.block?.number,
      transactions: filteredTransactions,
      totalCount: (data?.bondTransactions || []).length,
    },
    loading,
  };
};
