import { useWeb3React } from "@web3-react/core";
import DateLib from "@/lib/date/DateLib";
import { useState, useEffect } from "react";
import { useNetwork } from "@/src/context/Network";
import { fetchSubgraph } from "@/src/services/fetchSubgraph";

const getQuery = (startOfMonth, account) => {
  return `
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
};

const fetchExpiredPolicies = fetchSubgraph("useExpiredPolicies");

export const useExpiredPolicies = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { networkId } = useNetwork();
  const { account } = useWeb3React();

  useEffect(() => {
    if (!account) {
      return;
    }

    const startOfMonth = DateLib.toUnix(DateLib.getSomInUTC(Date.now()));

    setLoading(true);
    fetchExpiredPolicies(networkId, getQuery(startOfMonth, account))
      .then((_data) => {
        if (!_data) return;
        setData(_data);
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
      expiredPolicies: data["userPolicies"] || [],
    },
    loading,
  };
};
