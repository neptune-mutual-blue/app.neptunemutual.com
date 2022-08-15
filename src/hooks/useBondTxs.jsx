import { useNetwork } from "@/src/context/Network";
import { fetchSubgraph } from "@/src/services/fetchSubgraph";
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
      bondPool {
        token1
        token1Symbol
        token1Decimals
        lpTokenSymbol
        lpTokenDecimals
      }
      transaction {
        id
        timestamp
      }
    }
  }
  `;
};

const fetchBondTxs = fetchSubgraph("useBondTxs");

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

    if (!account) {
      return;
    }
    const query = getQuery(account, limit, limit * (page - 1));

    setLoading(true);

    fetchBondTxs(networkId, query)
      .then((_data) => {
        if (ignore || !_data) return;

        const isLastPage =
          _data.bondTransactions.length === 0 ||
          _data.bondTransactions.length < limit;

        if (isLastPage) {
          setHasMore(false);
        }

        setData((prev) => ({
          blockNumber: _data._meta.block.number,
          bondTransactions: [
            ...prev.bondTransactions,
            ..._data.bondTransactions,
          ],
        }));
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });

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
