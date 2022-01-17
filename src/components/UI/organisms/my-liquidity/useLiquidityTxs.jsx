import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";

export const useLiquidityTxs = () => {
  const { chainId, account } = useWeb3React();
  const [data, setData] = useState({});

  useEffect(() => {
    if (!chainId || !account) {
      return;
    }

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
        liquidityTransactions(
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
          }
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
        console.log("data returned:", data);
        setData(data);
      });
  }, [account, chainId]);

  return {
    data,
  };
};
