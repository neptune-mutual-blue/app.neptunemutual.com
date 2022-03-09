import { getGraphURL } from "@/src/config/environment";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect, useMemo } from "react";

export const useBondTxs = ({ maxItems, itemsToQuery }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { chainId, account } = useWeb3React();
  const [bondTxs, setBondTxs] = useState([]);

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
  }, [data.bondTransactions, maxItems, itemsToQuery]);

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
            first: ${itemsToQuery}, 
            orderBy: 
            createdAtTimestamp, 
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
          bondPools {
            address0
          }
        }
        `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        console.log("res", res);
        setData(res.data);
        console.log(res.data.bondTransactions);
        setBondTxs((prev) => console.log(prev));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account, chainId, itemsToQuery]);

  const filteredTransactions = useMemo(() => {
    //const all = [];
    console.log("bondTxs", bondTxs);
    const transactions = data.bondTransactions || [];

    return transactions
      ? transactions.slice().slice(maxItems * (page - 1), page * maxItems)
      : [];
  }, [data.bondTransactions, maxItems, page]);

  const bondPoolAddress = data.bondPools ? data.bondPools[0].address0 : "";

  return {
    page,
    maxPage,
    setPage,
    data: {
      blockNumber: data?._meta?.block?.number,
      transactions: filteredTransactions,
      totalCount: (data?.bondTransactions || []).length,
      lpTokenAddress: bondPoolAddress,
    },
    loading,
  };
};
