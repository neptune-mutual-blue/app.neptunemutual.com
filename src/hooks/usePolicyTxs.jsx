import { getGraphURL } from "@/src/config/environment";
import { useNetwork } from "@/src/context/Network";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";

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
        query: `
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
          where: {account: "${account}"}
        ) {
          type
          key
          account
          cxTokenAmount
          daiAmount
          cxTokenData {
            id
            tokenSymbol
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
      `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (ignore) return;
        
        if (res.errors || !res.data) {
          return;
        }

        const isLastPage =
          res.data.policyTransactions.length === 0 ||
          res.data.policyTransactions.length < limit;

        if (isLastPage) {
          setHasMore(false);
        }

        setData((prev) => ({
          blockNumber: res.data._meta.block.number,
          policyTransactions: [
            ...prev.policyTransactions,
            ...res.data.policyTransactions,
          ],
        }));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
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
