import { ROWS_PER_PAGE } from "@/src/config/constants";
import { getGraphURL } from "@/src/config/environment";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect, useMemo } from "react";

export const useBondTxs = ({ maxItems, itemsToQuery, itemsToSkip }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { chainId, account } = useWeb3React();
  const [bondTransactions, setBondTransactions] = useState([]);
  const [isShowMoreVisible, setIsShowMoreVisible] = useState(true);

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
            skip: ${itemsToSkip}
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
        (!res.data.bondTransactions.length ||
          res.data.bondTransactions.length < ROWS_PER_PAGE) &&
          setIsShowMoreVisible(false);
        setData(res.data);
        setBondTransactions((prev) => {
          return [...prev, ...res.data.bondTransactions];
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account, chainId, itemsToSkip]);

  const filteredTransactions = useMemo(() => {
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
    isShowMoreVisible,
    data: {
      blockNumber: data?._meta?.block?.number,
      transactions: bondTransactions,
      totalCount: (data?.bondTransactions || []).length,
      lpTokenAddress: bondPoolAddress,
    },
    loading,
  };
};
