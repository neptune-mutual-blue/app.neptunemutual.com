import { useNetwork } from "@/src/context/Network";
import { getSubgraphData } from "@/src/services/subgraph";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";

const getQuery = (limit, page, account) => {
  return `
  {
    _meta {
      block {
        number
      }
    }
    policyTransactions(
      skip: ${limit * (page - 1)}
      first: ${limit} 
      orderBy: createdAtTimestamp
      orderDirection: desc
      where: {onBehalfOf: "${account}"}
    ) {
      type
      coverKey
      productKey
      onBehalfOf
      cxTokenAmount
      daiAmount
      cxToken {
        id
        tokenSymbol
        tokenDecimals
        tokenName
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

export const usePolicyTxs = ({ limit, page }) => {
  const [data, setData] = useState({
    policyTransactions: [],
    blockNumber: null,
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

    setLoading(true);
    getSubgraphData(networkId, getQuery(limit, page, account))
      .then((_data) => {
        if (ignore || !_data) return;

        const isLastPage =
          _data.policyTransactions.length === 0 ||
          _data.policyTransactions.length < limit;

        if (isLastPage) {
          setHasMore(false);
        }

        setData((prev) => ({
          blockNumber: _data._meta.block.number,
          policyTransactions: [
            ...prev.policyTransactions,
            ..._data.policyTransactions,
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
    data: {
      blockNumber: data.blockNumber,
      transactions: data.policyTransactions,
      totalCount: data.policyTransactions.length,
    },
    loading,
    hasMore,
  };
};
