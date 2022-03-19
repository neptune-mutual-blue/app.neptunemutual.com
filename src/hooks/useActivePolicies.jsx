import { getGraphURL } from "@/src/config/environment";
import { sumOf } from "@/utils/bn";
import { useWeb3React } from "@web3-react/core";
import DateLib from "@/lib/date/DateLib";
import { useState, useEffect } from "react";
import { useNetwork } from "@/src/context/Network";

export const useActivePolicies = () => {
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

    const now = DateLib.unix();

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
              expiresOn_gt: "${now}"
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

  const activePolicies = data?.userPolicies || [];
  const totalActiveProtection = sumOf(
    "0",
    ...activePolicies.map((x) => x.totalAmountToCover || "0")
  );

  return {
    data: {
      activePolicies,
      totalActiveProtection,
    },
    loading,
  };
};
