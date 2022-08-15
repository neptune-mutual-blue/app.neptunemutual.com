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
        tokenDecimals
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

const fetchLiquidityTxs = fetchSubgraph("useLiquidityTxs");

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
    let ignore = false;

    if (!account) {
      return;
    }
    const query = getQuery(account, limit, limit * (page - 1));

    setLoading(true);

    fetchLiquidityTxs(networkId, query)
      .then((_data) => {
        if (ignore || !_data) return;

        const isLastPage =
          _data.liquidityTransactions.length === 0 ||
          _data.liquidityTransactions.length < limit;

        if (isLastPage) {
          setHasMore(false);
        }

        //setData(_data);
        setData((prev) => ({
          blockNumber: _data._meta.block.number,
          liquidityTransactions: [
            ...prev.liquidityTransactions,
            ..._data.liquidityTransactions,
          ],
        }));
      })
      .catch((err) => {
        console.error(err);
      })
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
      transactions: data.liquidityTransactions,
      totalCount: data.liquidityTransactions.length,
    },
    loading,
  };
};
