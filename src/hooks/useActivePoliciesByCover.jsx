import { getGraphURL } from "@/src/config/environment";
import { sumOf } from "@/utils/bn";
import { useWeb3React } from "@web3-react/core";
import DateLib from "@/lib/date/DateLib";
import { useState, useEffect, useMemo } from "react";
import { useNetwork } from "@/src/context/Network";

export const useActivePoliciesByCover = ({
  coverKey,
  productKey,
  limit,
  page,
}) => {
  const [data, setData] = useState({
    userPolicies: [],
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
            skip: ${limit * (page - 1)}
            first: ${limit}
            where: {
              expiresOn_gt: "${startOfMonth}"
              account: "${account}"
              coverKey: "${coverKey}"
              productKey: "${productKey}"
            }
          ) {
            id
            coverKey
            productKey
            cxToken {
              id
              creationDate
              expiryDate
              tokenSymbol
              tokenDecimals
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
        if (ignore) return;

        if (res.errors || !res.data) {
          return;
        }

        const isLastPage =
          res.data.userPolicies.length === 0 ||
          res.data.userPolicies.length < limit;

        if (isLastPage) {
          setHasMore(false);
        }

        setData((prev) => ({
          userPolicies: [...prev.userPolicies, ...res.data.userPolicies],
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
  }, [account, coverKey, limit, networkId, page, productKey]);

  const totalActiveProtection = useMemo(() => {
    return sumOf(
      "0",
      ...data.userPolicies.map((x) => x.totalAmountToCover || "0")
    );
  }, [data.userPolicies]);

  return {
    data: {
      activePolicies: data.userPolicies,
      totalActiveProtection,
    },
    loading,
    hasMore,
  };
};
