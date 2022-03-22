import { getGraphURL } from "@/src/config/environment";
import { useWeb3React } from "@web3-react/core";
import DateLib from "@/lib/date/DateLib";
import { useState, useEffect } from "react";
import { useNetwork } from "@/src/context/Network";

export const useExpiredPolicies = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { networkId } = useNetwork();
  const { account } = useWeb3React();

  useEffect(() => {
    if (!networkId || !account) {
      return;
    }

    const graphURL = getGraphURL(networkId);

    if (!graphURL) {
      return;
    }

    const startOfMonth = DateLib.toUnix(DateLib.getSomInUTC(Date.now()));

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
          userPolicies(
            where: {
              expiresOn_lt: "${startOfMonth}"
              account: "${account}"
            }
          ) {
            id
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
        `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account, networkId]);

  return {
    data: {
      expiredPolicies: data?.userPolicies || [],
    },
    loading,
  };
};
