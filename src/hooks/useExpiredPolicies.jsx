import { useWeb3React } from "@web3-react/core";
import DateLib from "@/lib/date/DateLib";
import { useState, useEffect } from "react";
import { useNetwork } from "@/src/context/Network";
import { getSubgraphData } from "@/src/services/subgraph";

export const useExpiredPolicies = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { networkId } = useNetwork();
  const { account } = useWeb3React();

  useEffect(() => {
    let ignore = false;

    if (!account) {
      return;
    }

    const startOfMonth = DateLib.toUnix(DateLib.getSomInUTC(Date.now()));
    const query = `
    {
      userPolicies(
        where: {
          expiresOn_lt: "${startOfMonth}"
          account: "${account}"
        }
      ) {
        id
        coverKey
        productKey
        cxToken {
          id
          creationDate
          expiryDate
        }
        totalAmountToCover
        expiresOn
        cover {
          id
        }
      }
    }
    `;

    setLoading(true);
    getSubgraphData(networkId, query)
      .then((_data) => {
        if (ignore) return;
        setData(_data);
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
  }, [account, networkId]);

  return {
    data: {
      expiredPolicies: data["userPolicies"] || [],
    },
    loading,
  };
};
