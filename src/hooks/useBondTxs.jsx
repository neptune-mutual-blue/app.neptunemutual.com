import { ROWS_PER_PAGE } from "@/src/config/constants";
import { getGraphURL } from "@/src/config/environment";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";

export const useBondTxs = ({ itemsToQuery }) => {
  const [itemsToSkip, setItemsToSkip] = useState(0);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { chainId, account } = useWeb3React();
  const [bondTransactions, setBondTransactions] = useState([]);
  const [isShowMoreVisible, setIsShowMoreVisible] = useState(true);

  useEffect(() => {
    setItemsToSkip(0);
  }, [account]);

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
  }, [account, chainId, itemsToQuery, itemsToSkip]);

  const handleShowMore = () => {
    setItemsToSkip((prev) => prev + ROWS_PER_PAGE);
  };

  const bondPoolAddress = data.bondPools ? data.bondPools[0].address0 : "";

  return {
    handleShowMore,
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
