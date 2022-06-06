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
    bondTransactions(
      skip: ${skip}
      first: ${limit}, 
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
      token0
      token0Symbol
      lpTokenSymbol
      transaction {
        id
        timestamp
      }
    }
  }
  `;
};

export const useBondTxs = ({ limit, page }) => {
  const [data, setData] = useState({
    blockNumber: null,
    bondTransactions: [],
  });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { networkId } = useNetwork();
  const { account } = useWeb3React();

  useEffect(() => {
    let ignore = false;

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
        if (ignore) return;

        if (res.errors || !res.data) {
          return;
        }

        const isLastPage =
          res.data.bondTransactions.length === 0 ||
          res.data.bondTransactions.length < limit;

        if (isLastPage) {
          setHasMore(false);
        }

        setData((prev) => ({
          blockNumber: res.data._meta.block.number,
          bondTransactions: [
            ...prev.bondTransactions,
            ...res.data.bondTransactions,
          ],
        }));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

      return () => {
        ignore = true;
      };
  }, [account, limit, networkId, page]);

  return {
    hasMore,
    data: {
      blockNumber: data.blockNumber,
      transactions: data.bondTransactions,
      totalCount: data.bondTransactions.length,
    },
    loading,
  };
};
