import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";

export const usePolicyTxs = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { chainId, account } = useWeb3React();

  useEffect(() => {
    if (!chainId || !account) {
      return;
    }

    setLoading(true);
    fetch(
      "https://api.thegraph.com/subgraphs/name/flashburst/policy-subgraph",
      {
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
          orderBy: createdAtTimestamp
          orderDirection: desc
          where: {account: "${account}"}
        ) {
          type
          key
          account
          cxTokenAmount
          daiAmount
          cxToken
          cover {
            id
            name
          }
          transaction {
            id
            timestamp
          }
        }
      }
      `,
        }),
      }
    )
      .then((r) => r.json())
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [account, chainId]);

  return {
    data: {
      blockNumber: data?._meta?.block?.number,
      transactions: data?.policyTransactions || [],
      totalCount: (data?.policyTransactions || []).length,
    },
    loading,
  };
};
